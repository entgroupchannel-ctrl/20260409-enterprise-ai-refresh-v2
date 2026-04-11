import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Search, User, Building2, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ContactData {
  id: string;
  contact_type: 'customer' | 'supplier' | 'both';
  entity_type: 'individual' | 'juristic';
  company_name: string;
  tax_id: string | null;
  address: string | null;
  branch_type: string | null;
  branch_code: string | null;
  branch_name: string | null;
  contact_name: string | null;
  contact_position: string | null;
  email: string | null;
  mobile_phone: string | null;
  office_phone: string | null;
  line_id: string | null;
  business_location: string | null;
}

interface Props {
  onSelect: (contact: ContactData) => void;
  className?: string;
  typeFilter?: 'customer' | 'supplier' | 'both' | 'all';
}

export default function CustomerAutocomplete({ onSelect, className, typeFilter }: Props) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<ContactData[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (search.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        let query = (supabase as any).from('contacts')
          .select('id, contact_type, entity_type, company_name, tax_id, address, branch_type, branch_code, branch_name, contact_name, contact_position, email, mobile_phone, office_phone, line_id, business_location')
          .eq('is_active', true);

        const filter = typeFilter || 'customer';
        if (filter === 'customer') {
          query = query.in('contact_type', ['customer', 'both']);
        } else if (filter === 'supplier') {
          query = query.in('contact_type', ['supplier', 'both']);
        } else if (filter !== 'all') {
          query = query.eq('contact_type', filter);
        }

        const { data } = await query
          .or(`company_name.ilike.%${search}%,contact_name.ilike.%${search}%,email.ilike.%${search}%,tax_id.ilike.%${search}%`)
          .order('company_name', { ascending: true })
          .limit(8);

        setResults((data as ContactData[]) || []);
        setOpen(true);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, typeFilter]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="ค้นหาลูกค้า: ชื่อบริษัท / ผู้ติดต่อ / Tax ID / อีเมล (พิมพ์อย่างน้อย 2 ตัว)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          className="pl-9 pr-9"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        )}
        {!loading && search && (
          <button
            onClick={() => {
              setSearch('');
              setResults([]);
              setOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-80 overflow-y-auto shadow-lg">
          {results.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                onSelect(c);
                setSearch('');
                setOpen(false);
              }}
              className="w-full text-left p-3 hover:bg-accent border-b last:border-b-0 transition-colors"
            >
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {c.entity_type === 'juristic' ? (
                    <Building2 className="w-4 h-4 text-primary" />
                  ) : (
                    <User className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm truncate">{c.company_name}</p>
                    {c.contact_type === 'both' && (
                      <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
                        ลูกค้า+ผู้จำหน่าย
                      </Badge>
                    )}
                    {c.branch_type === 'branch' && c.branch_name && (
                      <Badge variant="outline" className="text-[9px] px-1 py-0 h-4">
                        สาขา: {c.branch_name}
                      </Badge>
                    )}
                  </div>

                  {c.contact_name && (
                    <p className="text-xs text-muted-foreground truncate">
                      ผู้ติดต่อ: {c.contact_name}
                      {c.contact_position && ` • ${c.contact_position}`}
                    </p>
                  )}

                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5 flex-wrap">
                    {c.email && <span>📧 {c.email}</span>}
                    {(c.mobile_phone || c.office_phone) && (
                      <span>📞 {c.mobile_phone || c.office_phone}</span>
                    )}
                  </div>

                  {c.tax_id && (
                    <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                      Tax: {c.tax_id}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))}
        </Card>
      )}

      {open && search.length >= 2 && results.length === 0 && !loading && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 p-3 text-center text-sm text-muted-foreground">
          ไม่พบลูกค้า — กรอกข้อมูลด้านล่างเพื่อสร้างใหม่
        </Card>
      )}
    </div>
  );
}
