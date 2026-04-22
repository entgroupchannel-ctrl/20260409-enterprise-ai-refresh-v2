import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2, MailX } from 'lucide-react';
import SEOHead from '@/components/SEOHead';

type Status = 'loading' | 'valid' | 'already' | 'invalid' | 'success' | 'error';

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [status, setStatus] = useState<Status>('loading');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) { setStatus('invalid'); return; }

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    fetch(`${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`, {
      headers: { apikey: anonKey },
    })
      .then(r => r.json())
      .then(data => {
        if (data.valid === false && data.reason === 'already_unsubscribed') setStatus('already');
        else if (data.valid) setStatus('valid');
        else setStatus('invalid');
      })
      .catch(() => setStatus('error'));
  }, [token]);

  const handleUnsubscribe = async () => {
    if (!token) return;
    setBusy(true);
    try {
      const { data, error } = await supabase.functions.invoke('handle-email-unsubscribe', {
        body: { token },
      });
      if (error) throw error;
      const result = typeof data === 'string' ? JSON.parse(data) : data;
      if (result.success) setStatus('success');
      else if (result.reason === 'already_unsubscribed') setStatus('already');
      else setStatus('error');
    } catch {
      setStatus('error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <SEOHead
        title="ยกเลิกรับอีเมล — ENT Group"
        description="ยกเลิกการรับอีเมลข่าวสารและโปรโมชันจาก ENT Group"
        path="/unsubscribe"
        noindex
      />
      <div className="max-w-md w-full bg-card rounded-xl border shadow-sm p-8 text-center space-y-4">
        {status === 'loading' && (
          <>
            <Loader2 className="w-10 h-10 mx-auto text-muted-foreground animate-spin" />
            <p className="text-muted-foreground">กำลังตรวจสอบ...</p>
          </>
        )}

        {status === 'valid' && (
          <>
            <MailX className="w-12 h-12 mx-auto text-destructive" />
            <h1 className="text-xl font-semibold">ยกเลิกรับอีเมล</h1>
            <p className="text-muted-foreground text-sm">
              คุณต้องการยกเลิกรับอีเมลจาก ENT Group หรือไม่?
            </p>
            <Button onClick={handleUnsubscribe} disabled={busy} variant="destructive" className="w-full">
              {busy ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              ยืนยันยกเลิก
            </Button>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
            <h1 className="text-xl font-semibold">ยกเลิกเรียบร้อยแล้ว</h1>
            <p className="text-muted-foreground text-sm">คุณจะไม่ได้รับอีเมลจากเราอีกต่อไป</p>
          </>
        )}

        {status === 'already' && (
          <>
            <CheckCircle className="w-12 h-12 mx-auto text-muted-foreground" />
            <h1 className="text-xl font-semibold">ยกเลิกแล้วก่อนหน้านี้</h1>
            <p className="text-muted-foreground text-sm">อีเมลนี้ถูกยกเลิกจากรายชื่อรับข่าวสารแล้ว</p>
          </>
        )}

        {status === 'invalid' && (
          <>
            <AlertCircle className="w-12 h-12 mx-auto text-destructive" />
            <h1 className="text-xl font-semibold">ลิงก์ไม่ถูกต้อง</h1>
            <p className="text-muted-foreground text-sm">ลิงก์ยกเลิกการรับอีเมลไม่ถูกต้องหรือหมดอายุ</p>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="w-12 h-12 mx-auto text-destructive" />
            <h1 className="text-xl font-semibold">เกิดข้อผิดพลาด</h1>
            <p className="text-muted-foreground text-sm">กรุณาลองใหม่อีกครั้งภายหลัง</p>
          </>
        )}
      </div>
    </div>
  );
}
