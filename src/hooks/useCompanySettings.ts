import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface CompanySettings {
  id: string;
  name_th: string;
  address_th: string | null;
  name_en: string | null;
  address_en: string | null;
  tax_id: string | null;
  vat_registered: boolean;
  branch_type: string;
  branch_code: string | null;
  branch_name: string | null;
  phone: string | null;
  fax: string | null;
  email: string | null;
  website: string | null;
  bank_name: string | null;
  bank_account_number: string | null;
  bank_account_name: string | null;
  bank_branch: string | null;
  promptpay_id: string | null;
  logo_url: string | null;
  signature_url: string | null;
  letterhead_url: string | null;
  default_payment_terms: string | null;
  default_delivery_terms: string | null;
  default_warranty_terms: string | null;
  default_quote_validity_days: number;
  default_vat_percent: number;
}

export function useCompanySettings() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await (supabase as any).from('company_settings')
        .select('*')
        .eq('is_active', true)
        .maybeSingle();
      setSettings(data);
    } finally {
      setLoading(false);
    }
  };

  return { settings, loading, refresh: loadSettings };
}
