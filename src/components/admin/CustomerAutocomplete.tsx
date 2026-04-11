import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Search, User, Building2, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CustomerData {
  id: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  contact_position: string | null;
  contact_line: string | null;
  company_name: string | null;
  company_tax_id: string | null;
  company_address: string | null;
  company_phone: string | null;
}

interface Props {
  onSelect: (customer: CustomerData) => void;
  className?: string;
}

export default function CustomerAutocomplete({ onSelect, className }: Props) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<CustomerData[]>([]);
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
        const { data } = await (supabase as any).from('user_profiles')
          .select('id, contact_name, contact_email, contact_phone, contact_position, contact_line, company_name, company_tax_id, company_address, company_phone')
          .or(`contact_name.ilike.%${search}%,company_name.ilike.%${search}%,contact_email.ilike.%${search}%,company_tax_id.ilike.%${search}%`)
          .limit(8);

        setResults((data as CustomerData[]) || []);
        setOpen(true);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="ค้นหาลูกค้า: ชื่อ / บริษัท / Tax ID / อีเมล (พิมพ์อย่างน้อย 2 ตัว)"
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
                  {c.company_name ? (
                    <Building2 className="w-4 h-4 text-primary" />
                  ) : (
                    <User className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {c.company_name || c.contact_name || 'ไม่มีชื่อ'}
                  </p>
                  {c.company_name && c.contact_name && (
                    <p className="text-xs text-muted-foreground truncate">
                      ผู้ติดต่อ: {c.contact_name}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                    {c.contact_email && <span>{c.contact_email}</span>}
                    {c.contact_phone && <span>• {c.contact_phone}</span>}
                  </div>
                  {c.company_tax_id && (
                    <p className="text-[11px] text-muted-foreground font-mono">
                      Tax: {c.company_tax_id}
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
