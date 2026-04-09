
-- Prevent duplicate version numbers per quote
CREATE UNIQUE INDEX IF NOT EXISTS idx_po_versions_unique 
ON po_versions(quote_id, version_number);

-- Safe version number generator with advisory lock
CREATE OR REPLACE FUNCTION public.get_next_po_version(p_quote_id UUID)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  next_version INT;
BEGIN
  PERFORM pg_advisory_xact_lock(hashtext(p_quote_id::text));
  
  SELECT COALESCE(MAX(version_number), 0) + 1
  INTO next_version
  FROM po_versions
  WHERE quote_id = p_quote_id;
  
  RETURN next_version;
END;
$$;
