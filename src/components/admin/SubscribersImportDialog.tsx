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
  first_name?: string;
  last_name?: string;
  phone?: string;
  phone_secondary?: string;
  company?: string;
  position?: string;
  labels?: string;
  language?: string;
  address?: string;
  city?: string;
  state_region?: string;
  zip?: string;
  country?: string;
  website?: string;
  company_tax_id?: string;
  branch?: string;
  customer_type?: string;
  email_subscriber_status?: string;
  sms_subscriber_status?: string;
  last_activity?: string;
  last_activity_at?: string | null;
  imported_from?: string;
  extra_data?: Record<string, string>;
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

// Header aliases (lowercase) → canonical column name
const HEADER_MAP: Record<string, string> = {
  // email
  'email': 'email', 'email 1': 'email', 'อีเมล': 'email', 'e-mail': 'email',
  // name
  'first name': 'first_name', 'firstname': 'first_name', 'ชื่อ': 'first_name',
  'last name': 'last_name', 'lastname': 'last_name', 'นามสกุล': 'last_name',
  'contactperson': 'first_name',
  // phones
  'phone': 'phone', 'phone 1': 'phone', 'โทรศัพท์': 'phone', 'เบอร์มือถือ': 'phone',
  'phone 2': 'phone_secondary', 'phone 3': 'phone_secondary', 'เบอร์สำนักงาน': 'phone_secondary',
  // company
  'company': 'company', 'companyname': 'company', 'namelocal': 'company', 'บริษัท': 'company',
  'position': 'position', 'ตำแหน่ง': 'position',
  'companytaxid': 'company_tax_id', 'tax id': 'company_tax_id', 'เลขผู้เสียภาษี': 'company_tax_id',
  'branch': 'branch', 'สาขา': 'branch',
  'cus_type': 'customer_type', 'type-ประเภทลูกค้า': 'customer_type', 'ประเภทลูกค้า': 'customer_type',
  // address
  'address 1 - street': 'address', 'addresss': 'address', 'address3': 'address', 'address': 'address', 'ที่อยู่': 'address',
  'address 1 - city': 'city', 'city': 'city',
  'address 1 - state/region': 'state_region', 'state': 'state_region',
  'address 1 - zip': 'zip', 'zip': 'zip', 'zcode': 'zip',
  'address 1 - country': 'country', 'country': 'country',
  // misc
  'website': 'website', 'website (1)': 'website', 'website (2)': 'website',
  'labels': 'labels', 'tags': 'labels',
  'language': 'language', 'ภาษา': 'language',
  'source': 'source', 'แหล่งที่มา': 'source',
  'notes': 'notes', 'note': 'notes', 'บันทึก': 'notes',
  'email subscriber status': 'email_subscriber_status',
  'sms subscriber status': 'sms_subscriber_status',
  'last activity': 'last_activity',
  'last activity date (utc+0)': 'last_activity_at',
};

const KNOWN_COLS = new Set(Object.values(HEADER_MAP));

// CSV parser supporting quoted fields and commas inside quotes
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

function parseDate(v: string): string | null {
  if (!v) return null;
  const d = new Date(v.replace(' ', 'T'));
  return isNaN(d.getTime()) ? null : d.toISOString();
}

export default function SubscribersImportDialog({ open, onOpenChange, onImported }: Props) {
  const { toast } = useToast();
  const [fileName, setFileName] = useState<string>('');
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [defaultSource, setDefaultSource] = useState('csv_import');
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ inserted: number; skipped: number; errors: number } | null>(null);
  const [detectedFields, setDetectedFields] = useState<string[]>([]);

  const reset = () => {
    setFileName(''); setRows([]); setProgress(0); setResult(null); setDetectedFields([]);
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
    const rawHeader = grid[0].map(h => h.trim());
    const headerLc = rawHeader.map(h => h.toLowerCase());
    // Build column index map: canonical → first index found
    const colIdx: Record<string, number> = {};
    headerLc.forEach((h, i) => {
      const canon = HEADER_MAP[h];
      if (canon && colIdx[canon] === undefined) colIdx[canon] = i;
    });

    if (colIdx['email'] === undefined) {
      toast({ title: 'ไม่พบคอลัมน์ email', description: 'CSV ต้องมีคอลัมน์ email / Email 1 / อีเมล ใน header', variant: 'destructive' });
      return;
    }
    setDetectedFields(Object.keys(colIdx));

    const seen = new Set<string>();
    const parsed: ParsedRow[] = [];
    for (let i = 1; i < grid.length; i++) {
      const r = grid[i];
      const get = (k: string) => colIdx[k] !== undefined ? (r[colIdx[k]] || '').trim() : '';
      const email = get('email').toLowerCase();

      // Collect unmapped columns into extra_data
      const extra: Record<string, string> = {};
      headerLc.forEach((h, idx) => {
        const canon = HEADER_MAP[h];
        const val = (r[idx] || '').trim();
        if (!canon && val) extra[rawHeader[idx]] = val;
      });

      let valid = true;
      let error: string | undefined;
      if (!email) { valid = false; error = 'อีเมลว่าง'; }
      else if (!EMAIL_RE.test(email)) { valid = false; error = 'อีเมลไม่ถูกต้อง'; }
      else if (seen.has(email)) { valid = false; error = 'อีเมลซ้ำในไฟล์'; }
      else { seen.add(email); }

      parsed.push({
        email,
        source: get('source'),
        notes: get('notes'),
        first_name: get('first_name'),
        last_name: get('last_name'),
        phone: get('phone'),
        phone_secondary: get('phone_secondary'),
        company: get('company'),
        position: get('position'),
        labels: get('labels'),
        language: get('language'),
        address: get('address'),
        city: get('city'),
        state_region: get('state_region'),
        zip: get('zip'),
        country: get('country'),
        website: get('website'),
        company_tax_id: get('company_tax_id'),
        branch: get('branch'),
        customer_type: get('customer_type'),
        email_subscriber_status: get('email_subscriber_status'),
        sms_subscriber_status: get('sms_subscriber_status'),
        last_activity: get('last_activity'),
        last_activity_at: parseDate(get('last_activity_at')),
        imported_from: file.name,
        extra_data: Object.keys(extra).length ? extra : undefined,
        rowNumber: i + 1,
        valid,
        error,
      });
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
      // Fetch existing emails to skip duplicates
      const emails = validRows.map(r => r.email);
      const existing = new Set<string>();
      for (let i = 0; i < emails.length; i += 200) {
        const chunk = emails.slice(i, i + 200);
        const { data } = await (supabase as any)
          .from('subscribers')
          .select('email')
          .in('email', chunk);
        (data || []).forEach((d: any) => existing.add(String(d.email).toLowerCase()));
      }

      const nowIso = new Date().toISOString();
      const toInsert = validRows
        .filter(r => !existing.has(r.email))
        .map(r => ({
          email: r.email,
          source: r.source || defaultSource || 'csv_import',
          notes: r.notes || null,
          is_active: true,
          first_name: r.first_name || null,
          last_name: r.last_name || null,
          phone: r.phone || null,
          phone_secondary: r.phone_secondary || null,
          company: r.company || null,
          position: r.position || null,
          labels: r.labels || null,
          language: r.language || null,
          address: r.address || null,
          city: r.city || null,
          state_region: r.state_region || null,
          zip: r.zip || null,
          country: r.country || null,
          website: r.website || null,
          company_tax_id: r.company_tax_id || null,
          branch: r.branch || null,
          customer_type: r.customer_type || null,
          email_subscriber_status: r.email_subscriber_status || null,
          sms_subscriber_status: r.sms_subscriber_status || null,
          last_activity: r.last_activity || null,
          last_activity_at: r.last_activity_at || null,
          imported_from: r.imported_from || fileName,
          imported_at: nowIso,
          extra_data: r.extra_data || null,
        }));

      let inserted = 0;
      let errors = 0;
      for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
        const batch = toInsert.slice(i, i + BATCH_SIZE);
        const { error } = await (supabase as any).from('subscribers').insert(batch);
        if (error) { errors += batch.length; console.error('Import batch error:', error); }
        else { inserted += batch.length; }
        setProgress(Math.round(((i + batch.length) / Math.max(toInsert.length, 1)) * 100));
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
    const headers = [
      'Email','First Name','Last Name','Phone','Company','Position',
      'Address','City','State/Region','Zip','Country','Website',
      'CompanyTaxId','Branch','Cus_type','Labels','Language',
      'Source','Notes','Last Activity','Last Activity Date (UTC+0)',
    ];
    const sample = [
      'example@company.com','สมชาย','ใจดี','081-234-5678','บริษัท ตัวอย่าง จำกัด','ผู้จัดการฝ่ายไอที',
      '123 ถนนสุขุมวิท','กรุงเทพ','กรุงเทพมหานคร','10110','TH','https://example.com',
      '0105500000000','สำนักงานใหญ่','SME','VIP;Hot Lead','th',
      'csv_import','ลูกค้าจากงาน Expo 2026','Opened an email campaign','2026-04-30 10:00',
    ];
    const csv = headers.join(',') + '\n' + sample.map(v => `"${v.replace(/"/g, '""')}"`).join(',') + '\n';
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'subscribers_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" /> Import สมาชิกจากไฟล์ CSV
          </DialogTitle>
          <DialogDescription>
            รองรับ header หลายภาษา: <code>Email</code> (จำเป็น), First/Last Name, Phone, Company, Position,
            Address, City, Zip, Country, Website, CompanyTaxId, Branch, Cus_type, Labels, Source, Notes ฯลฯ
            คอลัมน์ที่ไม่รู้จักจะถูกเก็บใน <code>extra_data</code> (JSON) ไม่ตกหล่น
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
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

          {detectedFields.length > 0 && (
            <div className="border rounded-lg p-3 bg-muted/30">
              <p className="text-xs font-medium mb-1.5">✓ คอลัมน์ที่ตรวจพบและจะนำเข้า ({detectedFields.length}):</p>
              <div className="flex flex-wrap gap-1">
                {detectedFields.map(f => (
                  <Badge key={f} variant="outline" className="text-[10px]">{f}</Badge>
                ))}
              </div>
            </div>
          )}

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
                      <th className="text-left p-2">ชื่อ</th>
                      <th className="text-left p-2">บริษัท</th>
                      <th className="text-left p-2">โทร</th>
                      <th className="text-left p-2 w-16">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 100).map((r, i) => (
                      <tr key={i} className="border-t">
                        <td className="p-2 font-mono">{r.email || <span className="text-muted-foreground">—</span>}</td>
                        <td className="p-2">{[r.first_name, r.last_name].filter(Boolean).join(' ') || '—'}</td>
                        <td className="p-2 truncate max-w-[160px]">{r.company || '—'}</td>
                        <td className="p-2">{r.phone || '—'}</td>
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
