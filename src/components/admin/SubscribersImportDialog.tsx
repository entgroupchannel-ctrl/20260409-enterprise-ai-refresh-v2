import { useState } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Upload, FileText, CheckCircle2, AlertCircle, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ParsedRow {
  email: string;
  source?: string;
  notes?: string;
  rowNumber: number;
  valid: boolean;
  error?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImported: () => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BATCH_SIZE = 500;

// Simple CSV parser supporting quoted fields and commas inside quotes
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { cur += ch; }
    } else {
      if (ch === '"') { inQuotes = true; }
      else if (ch === ',') { row.push(cur); cur = ''; }
      else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && text[i + 1] === '\n') i++;
        row.push(cur); cur = '';
        if (row.some(c => c.trim() !== '')) rows.push(row);
        row = [];
      } else { cur += ch; }
    }
  }
  if (cur !== '' || row.length > 0) {
    row.push(cur);
    if (row.some(c => c.trim() !== '')) rows.push(row);
  }
  return rows;
}

export default function SubscribersImportDialog({ open, onOpenChange, onImported }: Props) {
  const { toast } = useToast();
  const [fileName, setFileName] = useState<string>('');
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [defaultSource, setDefaultSource] = useState('csv_import');
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ inserted: number; skipped: number; errors: number } | null>(null);

  const reset = () => {
    setFileName(''); setRows([]); setProgress(0); setResult(null);
  };

  const handleFile = async (file: File) => {
    reset();
    setFileName(file.name);
    const text = await file.text();
    const grid = parseCSV(text.replace(/^\uFEFF/, ''));
    if (grid.length === 0) {
      toast({ title: 'ไฟล์ว่าง', variant: 'destructive' });
      return;
    }
    const header = grid[0].map(h => h.trim().toLowerCase());
    const emailIdx = header.findIndex(h => h === 'email' || h === 'อีเมล' || h === 'e-mail');
    const sourceIdx = header.findIndex(h => h === 'source' || h === 'แหล่งที่มา');
    const notesIdx = header.findIndex(h => h === 'notes' || h === 'note' || h === 'บันทึก');

    if (emailIdx === -1) {
      toast({ title: 'ไม่พบคอลัมน์ email', description: 'CSV ต้องมีคอลัมน์ "email" ใน header', variant: 'destructive' });
      return;
    }

    const seen = new Set<string>();
    const parsed: ParsedRow[] = [];
    for (let i = 1; i < grid.length; i++) {
      const r = grid[i];
      const email = (r[emailIdx] || '').trim().toLowerCase();
      const source = sourceIdx >= 0 ? (r[sourceIdx] || '').trim() : '';
      const notes = notesIdx >= 0 ? (r[notesIdx] || '').trim() : '';
      let valid = true;
      let error: string | undefined;
      if (!email) { valid = false; error = 'อีเมลว่าง'; }
      else if (!EMAIL_RE.test(email)) { valid = false; error = 'อีเมลไม่ถูกต้อง'; }
      else if (seen.has(email)) { valid = false; error = 'อีเมลซ้ำในไฟล์'; }
      else { seen.add(email); }
      parsed.push({ email, source, notes, rowNumber: i + 1, valid, error });
    }
    setRows(parsed);
  };

  const validRows = rows.filter(r => r.valid);
  const invalidRows = rows.filter(r => !r.valid);

  const runImport = async () => {
    if (validRows.length === 0) return;
    setImporting(true);
    setProgress(0);
    setResult(null);

    try {
      // Fetch existing emails to skip duplicates against DB
      const emails = validRows.map(r => r.email);
      const existing = new Set<string>();
      // Chunk the .in() query to avoid URL length limits
      for (let i = 0; i < emails.length; i += 200) {
        const chunk = emails.slice(i, i + 200);
        const { data } = await (supabase as any)
          .from('subscribers')
          .select('email')
          .in('email', chunk);
        (data || []).forEach((d: any) => existing.add(String(d.email).toLowerCase()));
      }

      const toInsert = validRows
        .filter(r => !existing.has(r.email))
        .map(r => ({
          email: r.email,
          source: r.source || defaultSource || 'csv_import',
          notes: r.notes || null,
          is_active: true,
        }));

      let inserted = 0;
      let errors = 0;
      for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
        const batch = toInsert.slice(i, i + BATCH_SIZE);
        const { error } = await (supabase as any).from('subscribers').insert(batch);
        if (error) { errors += batch.length; }
        else { inserted += batch.length; }
        setProgress(Math.round(((i + batch.length) / toInsert.length) * 100));
      }

      const skipped = validRows.length - toInsert.length;
      setResult({ inserted, skipped, errors });
      toast({
        title: '✅ Import เสร็จสิ้น',
        description: `เพิ่ม ${inserted} • ข้าม (มีอยู่แล้ว) ${skipped} • ผิดพลาด ${errors}`,
      });
      onImported();
    } catch (e: any) {
      toast({ title: 'Import ล้มเหลว', description: e.message, variant: 'destructive' });
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const csv = 'email,source,notes\nexample@company.com,csv_import,ลูกค้าจากงาน Expo 2026\n';
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'subscribers_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" /> Import สมาชิกจากไฟล์ CSV
          </DialogTitle>
          <DialogDescription>
            อัปโหลดไฟล์ .csv ที่มีคอลัมน์ <code>email</code> (จำเป็น), <code>source</code>, <code>notes</code> (ไม่บังคับ)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <Button variant="outline" size="sm" onClick={downloadTemplate}>
              <Download className="w-4 h-4 mr-1" /> ดาวน์โหลด Template
            </Button>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Source เริ่มต้น:</span>
              <Input
                value={defaultSource}
                onChange={(e) => setDefaultSource(e.target.value)}
                className="h-7 w-40 text-xs"
              />
            </div>
          </div>

          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Input
              type="file"
              accept=".csv,text/csv"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
              className="cursor-pointer"
              disabled={importing}
            />
            {fileName && (
              <p className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
                <FileText className="w-3 h-3" /> {fileName}
              </p>
            )}
          </div>

          {rows.length > 0 && (
            <>
              <div className="grid grid-cols-3 gap-2">
                <div className="border rounded-lg p-3 text-center">
                  <p className="text-2xl font-bold">{rows.length}</p>
                  <p className="text-xs text-muted-foreground">แถวทั้งหมด</p>
                </div>
                <div className="border rounded-lg p-3 text-center bg-green-50 dark:bg-green-950/20">
                  <p className="text-2xl font-bold text-green-600">{validRows.length}</p>
                  <p className="text-xs text-muted-foreground">ใช้ได้</p>
                </div>
                <div className="border rounded-lg p-3 text-center bg-red-50 dark:bg-red-950/20">
                  <p className="text-2xl font-bold text-red-600">{invalidRows.length}</p>
                  <p className="text-xs text-muted-foreground">ผิดพลาด</p>
                </div>
              </div>

              {invalidRows.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    <p className="text-xs font-medium mb-1">ตัวอย่างแถวที่ผิด (จะถูกข้าม):</p>
                    <div className="max-h-24 overflow-y-auto text-xs space-y-0.5">
                      {invalidRows.slice(0, 5).map((r, i) => (
                        <div key={i}>แถว {r.rowNumber}: {r.email || '(ว่าง)'} — {r.error}</div>
                      ))}
                      {invalidRows.length > 5 && <div>... และอีก {invalidRows.length - 5} แถว</div>}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="border rounded-lg max-h-48 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead className="bg-muted sticky top-0">
                    <tr>
                      <th className="text-left p-2">Email</th>
                      <th className="text-left p-2">Source</th>
                      <th className="text-left p-2 w-16">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 100).map((r, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-2 font-mono">{r.email || <span className="text-muted-foreground">—</span>}</td>
                        <td className="p-2">{r.source || defaultSource}</td>
                        <td className="p-2">
                          {r.valid
                            ? <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">OK</Badge>
                            : <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700 border-red-200">{r.error}</Badge>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {rows.length > 100 && (
                  <p className="text-center text-xs text-muted-foreground py-2">แสดง 100 แถวแรกจาก {rows.length}</p>
                )}
              </div>

              {importing && (
                <div className="space-y-1">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-xs text-center text-muted-foreground">{progress}% — กำลังนำเข้า...</p>
                </div>
              )}

              {result && (
                <Alert>
                  <CheckCircle2 className="w-4 h-4" />
                  <AlertDescription className="text-sm">
                    เพิ่มใหม่ <strong>{result.inserted}</strong> • ข้าม (ซ้ำในระบบ) <strong>{result.skipped}</strong> • ผิดพลาด <strong>{result.errors}</strong>
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={importing}>
            ปิด
          </Button>
          <Button
            onClick={runImport}
            disabled={importing || validRows.length === 0 || !!result}
          >
            {importing ? <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> กำลังนำเข้า...</> : <><Upload className="w-4 h-4 mr-1" /> นำเข้า {validRows.length} รายการ</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
