import { useState, useEffect, useRef, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Search, User, Building2, Loader2, X, ChevronDown } from 'lucide-react';
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

const PAGE_SIZE = 20;
const SELECT_COLS =
  'id, contact_type, entity_type, company_name, tax_id, address, branch_type, branch_code, branch_name, contact_name, contact_position, email, mobile_phone, office_phone, line_id, business_location';

export default function CustomerAutocomplete({ onSelect, className, typeFilter }: Props) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<ContactData[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [mode, setMode] = useState<'browse' | 'search'>('browse');
  const containerRef = useRef<HTMLDivElement>(null);
  const lastQueryRef = useRef<string>('');

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const fetchPage = useCallback(async (
    query: string,
    pageIndex: number,
    append: boolean,
  ) => {
    const from = pageIndex * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    if (append) setLoadingMore(true);
    else setLoading(true);

    try {
      let q = (supabase as any)
        .from('contacts')
        .select(SELECT_COLS)
        .eq('is_active', true);

      const filter = typeFilter || 'customer';
      if (filter === 'customer') {
        q = q.in('contact_type', ['customer', 'both']);
      } else if (filter === 'supplier') {
        q = q.in('contact_type', ['supplier', 'both']);
      } else if (filter !== 'all') {
        q = q.eq('contact_type', filter);
      }

      if (query && query.length >= 2) {
        q = q.or(
          `company_name.ilike.%${query}%,contact_name.ilike.%${query}%,email.ilike.%${query}%,tax_id.ilike.%${query}%`,
        );
      }

      const { data, error } = await q
        .order('company_name', { ascending: true })
        .range(from, to);

      if (error) throw error;
      const rows = (data as ContactData[]) || [];

      setResults((prev) => (append ? [...prev, ...rows] : rows));
      setHasMore(rows.length === PAGE_SIZE);
      setPage(pageIndex);
    } catch (e) {
      console.error('CustomerAutocomplete fetch error:', e);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [typeFilter]);

  const handleOpen = async () => {
    setOpen(true);
    if (results.length === 0 && !loading) {
      setMode('browse');
      lastQueryRef.current = '';
      await fetchPage('', 0, false);
    }
  };

  // Debounced search
  useEffect(() => {
    const trimmed = search.trim();
    if (trimmed.length >= 2) {
      const timer = setTimeout(() => {
        setMode('search');
        lastQueryRef.current = trimmed;
        fetchPage(trimmed, 0, false);
        setOpen(true);
      }, 300);
      return () => clearTimeout(timer);
    }
    if (trimmed.length === 0 && mode === 'search') {
      setMode('browse');
      lastQueryRef.current = '';
      fetchPage('', 0, false);
    }
  }, [search, fetchPage, mode]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (loadingMore || loading || !hasMore) return;
    const el = e.currentTarget;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80) {
      fetchPage(lastQueryRef.current, page + 1, true);
    }
  };

  const loadMore = () => {
    if (loadingMore || loading || !hasMore) return;
    fetchPage(lastQueryRef.current, page + 1, true);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="ค้นหาลูกค้า: ชื่อบริษัท / ผู้ติดต่อ / Tax ID / อีเมล (หรือคลิกเพื่อดูรายชื่อทั้งหมด)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={handleOpen}
          className="pl-9 pr-9"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />
        )}
        {!loading && search && (
          <button
            type="button"
            onClick={() => { setSearch(''); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {open && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg overflow-hidden">
          <div className="px-3 py-2 bg-muted/50 border-b text-xs text-muted-foreground flex items-center justify-between">
            <span>
              {mode === 'search'
                ? `ผลการค้นหา "${lastQueryRef.current}"`
                : 'รายชื่อลูกค้าทั้งหมดในระบบ'}
            </span>
            <span>{results.length} รายการ{hasMore ? '+' : ''}</span>
          </div>

          <div onScroll={handleScroll} className="max-h-96 overflow-y-auto">
            {results.length === 0 && !loading && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                ไม่พบลูกค้า — กรอกข้อมูลด้านล่างเพื่อสร้างใหม่
              </div>
            )}

            {results.map((c) => (
              <button
                key={c.id}
                type="button"
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

            {loadingMore && (
              <div className="px-3 py-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                กำลังโหลดเพิ่ม...
              </div>
            )}

            {!loadingMore && hasMore && results.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={loadMore}
                className="w-full h-9 rounded-none border-t text-xs text-primary"
              >
                <ChevronDown className="w-3.5 h-3.5 mr-1" />
                โหลดเพิ่มอีก {PAGE_SIZE} รายการ
              </Button>
            )}

            {!hasMore && results.length > 0 && (
              <div className="px-3 py-2 text-center text-[10px] text-muted-foreground border-t">
                แสดงครบทุกรายการแล้ว
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
