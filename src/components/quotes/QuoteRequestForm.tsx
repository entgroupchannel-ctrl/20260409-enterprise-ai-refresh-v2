import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface QuoteRequestFormProps {
  onSuccess?: (quoteId: string) => void;
  prefilledProducts?: Array<{ model: string; category: string; qty: number }>;
}

const QuoteRequestForm = ({ onSuccess, prefilledProducts }: QuoteRequestFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    details: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setLoading(true);
    try {
      const products = prefilledProducts || [];
      const { data, error } = await (supabase.from as any)("quote_requests")
        .insert({
          quote_number: "", // trigger will auto-generate
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone || null,
          customer_company: form.company || null,
          products,
          notes: form.details || null,
          status: "pending",
        })
        .select()
        .single();
      if (error) throw error;
      toast({ title: "ส่งคำขอใบเสนอราคาเรียบร้อย!", description: `เลขที่: ${data.quote_number}` });
      onSuccess?.(data.id);
    } catch (err: any) {
      toast({ title: "เกิดข้อผิดพลาด", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input name="name" placeholder="ชื่อ-นามสกุล *" required value={form.name} onChange={handleChange} />
        <Input name="email" type="email" placeholder="อีเมล *" required value={form.email} onChange={handleChange} />
        <Input name="phone" placeholder="เบอร์โทร" value={form.phone} onChange={handleChange} />
        <Input name="company" placeholder="บริษัท" value={form.company} onChange={handleChange} />
      </div>
      <Textarea name="details" placeholder="รายละเอียดเพิ่มเติม..." value={form.details} onChange={handleChange} rows={3} />
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
        {loading ? "กำลังส่ง..." : "ส่งคำขอใบเสนอราคา"}
      </Button>
    </form>
  );
};

export default QuoteRequestForm;
