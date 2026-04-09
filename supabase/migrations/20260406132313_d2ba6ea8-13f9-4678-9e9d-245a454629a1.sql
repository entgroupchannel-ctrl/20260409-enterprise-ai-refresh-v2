UPDATE company_settings SET logo_url = '/images/ent-logo.png' WHERE id = 'default';
ALTER TABLE company_settings ALTER COLUMN logo_url SET DEFAULT '/images/ent-logo.png';