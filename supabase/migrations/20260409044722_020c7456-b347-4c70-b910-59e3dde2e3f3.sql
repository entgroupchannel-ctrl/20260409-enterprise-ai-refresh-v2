
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- TABLE 1: USERS (Profile Management)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(50),
  company VARCHAR(255),
  role VARCHAR(50) DEFAULT 'member' NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  last_login TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active);

-- ==========================================
-- TABLE 2: CONTACT SUBMISSIONS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'new' NOT NULL,
  priority VARCHAR(20) DEFAULT 'medium',
  lead_score INTEGER DEFAULT 0,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  follow_up_date DATE,
  notes TEXT,
  source VARCHAR(50) DEFAULT 'website',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_assigned ON contact_submissions(assigned_to);
CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_email ON contact_submissions(email);

-- ==========================================
-- TABLE 3: QUOTE REQUESTS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.quote_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_number VARCHAR(50) UNIQUE NOT NULL,
  contact_id UUID REFERENCES contact_submissions(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  customer_company VARCHAR(255),
  customer_address TEXT,
  customer_tax_id VARCHAR(50),
  products JSONB NOT NULL DEFAULT '[]'::JSONB,
  subtotal DECIMAL(12,2),
  discount_percent DECIMAL(5,2) DEFAULT 0,
  discount_amount DECIMAL(12,2) DEFAULT 0,
  vat_percent DECIMAL(5,2) DEFAULT 7,
  vat_amount DECIMAL(12,2),
  grand_total DECIMAL(12,2),
  status VARCHAR(50) DEFAULT 'pending' NOT NULL,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  valid_until DATE,
  payment_terms TEXT DEFAULT 'เงินสด / โอน / เช็ค',
  delivery_terms TEXT DEFAULT 'จัดส่งฟรีกรุงเทพและปริมณฑล',
  warranty_terms TEXT DEFAULT 'รับประกัน 1 ปี',
  notes TEXT,
  internal_notes TEXT,
  sla_response_due TIMESTAMP,
  sla_po_review_due TIMESTAMP,
  sla_breached BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  sent_at TIMESTAMP,
  viewed_at TIMESTAMP,
  po_uploaded_at TIMESTAMP,
  approved_at TIMESTAMP,
  rejected_at TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_quote_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_customer_email ON quote_requests(customer_email);
CREATE INDEX IF NOT EXISTS idx_quote_assigned ON quote_requests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_quote_created ON quote_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quote_number ON quote_requests(quote_number);
CREATE INDEX IF NOT EXISTS idx_quote_sla_breached ON quote_requests(sla_breached) WHERE sla_breached = TRUE;

-- ==========================================
-- TABLE 4: QUOTE FILES
-- ==========================================

CREATE TABLE IF NOT EXISTS public.quote_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID REFERENCES quote_requests(id) ON DELETE CASCADE NOT NULL,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT,
  file_type VARCHAR(100),
  category VARCHAR(50) DEFAULT 'quote_pdf' NOT NULL,
  description TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW() NOT NULL,
  uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_quote_files_quote ON quote_files(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_files_category ON quote_files(category);

-- ==========================================
-- TABLE 5: QUOTE MESSAGES
-- ==========================================

CREATE TABLE IF NOT EXISTS public.quote_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quote_id UUID REFERENCES quote_requests(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  sender_name VARCHAR(255) NOT NULL,
  sender_role VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  message_type VARCHAR(50) DEFAULT 'text',
  attachment_url TEXT,
  attachment_name VARCHAR(255),
  read_by JSONB DEFAULT '[]'::JSONB,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_quote_messages_quote ON quote_messages(quote_id);
CREATE INDEX IF NOT EXISTS idx_quote_messages_sender ON quote_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_quote_messages_created ON quote_messages(created_at DESC);

-- ==========================================
-- TABLE 6: NOTIFICATIONS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  quote_id UUID REFERENCES quote_requests(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type VARCHAR(50) NOT NULL,
  priority VARCHAR(20) DEFAULT 'normal' NOT NULL,
  action_url TEXT,
  action_label VARCHAR(100),
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_priority ON notifications(priority);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- ==========================================
-- TABLE 7: DOCUMENTS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT,
  file_type VARCHAR(100),
  category VARCHAR(100),
  product_series VARCHAR(100),
  tags TEXT[],
  access_level VARCHAR(50) DEFAULT 'public' NOT NULL,
  thumbnail_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_documents_category ON documents(category);
CREATE INDEX IF NOT EXISTS idx_documents_access ON documents(access_level);
CREATE INDEX IF NOT EXISTS idx_documents_active ON documents(is_active);
CREATE INDEX IF NOT EXISTS idx_documents_product ON documents(product_series);

-- ==========================================
-- TABLE 8: DOCUMENT DOWNLOADS
-- ==========================================

CREATE TABLE IF NOT EXISTS public.document_downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  ip_address INET,
  user_agent TEXT,
  download_source VARCHAR(50) DEFAULT 'web',
  downloaded_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_doc_downloads_document ON document_downloads(document_id);
CREATE INDEX IF NOT EXISTS idx_doc_downloads_user ON document_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_doc_downloads_date ON document_downloads(downloaded_at DESC);

-- ==========================================
-- AUTO-UPDATE TRIGGERS
-- ==========================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_contact_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_quote_updated_at
  BEFORE UPDATE ON quote_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- AUTO-GENERATE QUOTE NUMBER
-- ==========================================

CREATE OR REPLACE FUNCTION public.generate_quote_number()
RETURNS TRIGGER AS $$
DECLARE
  year_part VARCHAR(4);
  seq_part VARCHAR(4);
  next_seq INTEGER;
BEGIN
  IF NEW.quote_number IS NULL OR NEW.quote_number = '' THEN
    year_part := TO_CHAR(NOW(), 'YYYY');
    SELECT COALESCE(MAX(CAST(SUBSTRING(quote_number FROM 9 FOR 4) AS INTEGER)), 0) + 1
    INTO next_seq
    FROM quote_requests
    WHERE quote_number LIKE 'QT-' || year_part || '-%';
    seq_part := LPAD(next_seq::TEXT, 4, '0');
    NEW.quote_number := 'QT-' || year_part || '-' || seq_part;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_generate_quote_number
  BEFORE INSERT ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION generate_quote_number();

-- ==========================================
-- AUTO-SET SLA TIMESTAMPS
-- ==========================================

CREATE OR REPLACE FUNCTION public.set_sla_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'pending' AND NEW.sla_response_due IS NULL THEN
    NEW.sla_response_due := NOW() + INTERVAL '24 hours';
  END IF;
  IF TG_OP = 'UPDATE' THEN
    IF NEW.status = 'po_uploaded' AND OLD.status != 'po_uploaded' THEN
      NEW.sla_po_review_due := NOW() + INTERVAL '24 hours';
      NEW.po_uploaded_at := NOW();
    END IF;
    IF NEW.status = 'quote_sent' AND OLD.status != 'quote_sent' THEN
      NEW.sent_at := NOW();
    END IF;
    IF NEW.status = 'po_approved' AND OLD.status != 'po_approved' THEN
      NEW.approved_at := NOW();
    END IF;
    IF NEW.status = 'rejected' AND OLD.status != 'rejected' THEN
      NEW.rejected_at := NOW();
    END IF;
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
      NEW.completed_at := NOW();
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_sla_timestamps
  BEFORE INSERT OR UPDATE ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION set_sla_timestamps();

-- ==========================================
-- AUTO-CREATE NOTIFICATIONS
-- ==========================================

CREATE OR REPLACE FUNCTION public.create_quote_notification()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    IF NEW.status = 'po_uploaded' AND NEW.assigned_to IS NOT NULL THEN
      INSERT INTO notifications (
        user_id, quote_id, title, message, type, priority, action_url, action_label
      ) VALUES (
        NEW.assigned_to, NEW.id,
        'รอตรวจสอบ PO',
        'ลูกค้าอัปโหลด PO สำหรับ ' || NEW.quote_number,
        'po_uploaded', 'urgent',
        '/admin/quotes/' || NEW.id,
        'ตรวจสอบเลย'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_quote_notification
  AFTER INSERT OR UPDATE ON quote_requests
  FOR EACH ROW
  EXECUTE FUNCTION create_quote_notification();

-- ==========================================
-- SUBSCRIBERS TABLE (for newsletter)
-- ==========================================

CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  source VARCHAR(50) DEFAULT 'website',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers(email);

-- ==========================================
-- RLS POLICIES
-- ==========================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Users: own profile
CREATE POLICY "users_select_own" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "users_insert_own" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- Admin: see all users
CREATE POLICY "admin_select_all_users" ON users FOR SELECT
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Contact submissions: anyone can insert, admin can see all
CREATE POLICY "contact_insert_anon" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "contact_select_admin" ON contact_submissions FOR SELECT
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'sales')));
CREATE POLICY "contact_update_admin" ON contact_submissions FOR UPDATE
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'sales')));

-- Quote requests: customer sees own, admin sees all
CREATE POLICY "quote_select_own" ON quote_requests FOR SELECT
  USING (customer_email = (SELECT email FROM users WHERE id = auth.uid()));
CREATE POLICY "quote_select_admin" ON quote_requests FOR SELECT
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'sales')));
CREATE POLICY "quote_insert_auth" ON quote_requests FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "quote_update_admin" ON quote_requests FOR UPDATE
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'sales')));

-- Quote files: linked to quote access
CREATE POLICY "quote_files_select" ON quote_files FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM quote_requests qr
    WHERE qr.id = quote_id AND (
      qr.customer_email = (SELECT email FROM users WHERE id = auth.uid())
      OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'sales'))
    )
  ));
CREATE POLICY "quote_files_insert" ON quote_files FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Quote messages: linked to quote access
CREATE POLICY "quote_messages_select" ON quote_messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM quote_requests qr
    WHERE qr.id = quote_id AND (
      qr.customer_email = (SELECT email FROM users WHERE id = auth.uid())
      OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'sales'))
    )
  ));
CREATE POLICY "quote_messages_insert" ON quote_messages FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Notifications: own only
CREATE POLICY "notifications_select_own" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "notifications_update_own" ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- Documents: public docs for all, member/internal for auth
CREATE POLICY "documents_select_public" ON documents FOR SELECT USING (access_level = 'public' AND is_active = true);
CREATE POLICY "documents_select_member" ON documents FOR SELECT
  USING (access_level = 'member_only' AND is_active = true AND auth.uid() IS NOT NULL);
CREATE POLICY "documents_select_admin" ON documents FOR SELECT
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "documents_insert_admin" ON documents FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "documents_update_admin" ON documents FOR UPDATE
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Document downloads: auth users can insert
CREATE POLICY "doc_downloads_insert" ON document_downloads FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "doc_downloads_select_admin" ON document_downloads FOR SELECT
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

-- Subscribers: anyone can insert
CREATE POLICY "subscribers_insert_anon" ON subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "subscribers_select_admin" ON subscribers FOR SELECT
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
