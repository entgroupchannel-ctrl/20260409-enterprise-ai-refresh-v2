-- 1. เพิ่ม columns ใหม่ในตาราง profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS credit_terms text DEFAULT 'COD',
  ADD COLUMN IF NOT EXISTS discount_percent numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS account_manager_id uuid;

-- 2. อัปเดตฟังก์ชัน can_download_document ให้รองรับ dealer tier
CREATE OR REPLACE FUNCTION public.can_download_document(_user_id uuid, _document_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _access_level TEXT;
  _user_tier TEXT;
  _has_grant BOOLEAN;
BEGIN
  SELECT access_level INTO _access_level FROM document_library WHERE id = _document_id;
  IF _access_level IS NULL THEN RETURN false; END IF;
  IF _access_level = 'public' THEN RETURN true; END IF;
  IF public.is_admin(_user_id) THEN RETURN true; END IF;

  SELECT customer_tier INTO _user_tier FROM profiles WHERE id = _user_id;

  -- vip level: accessible by vip, premium, dealer
  IF _access_level = 'vip' THEN
    IF _user_tier IN ('vip', 'premium', 'dealer') THEN RETURN true; END IF;
  END IF;

  -- dealer level: accessible by dealer, vip, premium
  IF _access_level = 'dealer' THEN
    IF _user_tier IN ('dealer', 'vip', 'premium') THEN RETURN true; END IF;
  END IF;

  -- private: check document_access grants
  SELECT EXISTS(
    SELECT 1 FROM document_access
    WHERE user_id = _user_id AND document_id = _document_id
    AND (expires_at IS NULL OR expires_at > now())
  ) INTO _has_grant;
  RETURN _has_grant;
END;
$$;