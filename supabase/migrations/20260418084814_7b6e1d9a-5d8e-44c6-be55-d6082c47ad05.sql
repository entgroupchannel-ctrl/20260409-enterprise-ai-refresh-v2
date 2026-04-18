
-- ============================================================
-- SUPPLIER OUTREACH KIT — Full schema (14 gaps coverage)
-- ============================================================

ALTER TABLE public.suppliers
  ADD COLUMN IF NOT EXISTS lifecycle_stage TEXT NOT NULL DEFAULT 'prospect'
    CHECK (lifecycle_stage IN ('prospect','pre_qualified','video_screened','sample_ordered','pilot_running','partner','disqualified')),
  ADD COLUMN IF NOT EXISTS region_cluster TEXT
    CHECK (region_cluster IN ('shenzhen','shanghai_yangtze','dongguan_guangzhou','yueqing_wenzhou','northeast','other') OR region_cluster IS NULL),
  ADD COLUMN IF NOT EXISTS product_categories TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS verification_links JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS red_flags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS overall_score NUMERIC(3,2),
  ADD COLUMN IF NOT EXISTS qualified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS disqualified_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS disqualified_reason TEXT;

CREATE INDEX IF NOT EXISTS idx_suppliers_lifecycle ON public.suppliers(lifecycle_stage) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_suppliers_score ON public.suppliers(overall_score DESC) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS public.supplier_qualifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  factory_type TEXT CHECK (factory_type IN ('manufacturer','trader','hybrid')),
  year_established INTEGER,
  total_employees INTEGER,
  production_employees INTEGER,
  rd_employees INTEGER,
  monthly_capacity TEXT,
  annual_revenue_range TEXT CHECK (annual_revenue_range IN ('under_1m','1m_5m','5m_20m','over_20m')),
  export_countries TEXT[],
  export_revenue_percent INTEGER,
  certifications_listed TEXT[],
  oem_capability TEXT CHECK (oem_capability IN ('label_only','hardware_mod','full_custom','none')),
  moq_per_sku TEXT,
  sample_policy TEXT CHECK (sample_policy IN ('free','paid','free_with_commitment','no_samples')),
  sample_shipping_paid_by TEXT CHECK (sample_shipping_paid_by IN ('supplier','buyer','split')),
  business_license_url TEXT,
  factory_photos JSONB DEFAULT '[]'::jsonb,
  flagship_datasheets JSONB DEFAULT '[]'::jsonb,
  raw_answers TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(supplier_id)
);

CREATE TABLE IF NOT EXISTS public.supplier_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  response_speed SMALLINT CHECK (response_speed BETWEEN 1 AND 5),
  manufacturer_proof SMALLINT CHECK (manufacturer_proof BETWEEN 1 AND 5),
  experience SMALLINT CHECK (experience BETWEEN 1 AND 5),
  certifications SMALLINT CHECK (certifications BETWEEN 1 AND 5),
  export_experience SMALLINT CHECK (export_experience BETWEEN 1 AND 5),
  oem_flexibility SMALLINT CHECK (oem_flexibility BETWEEN 1 AND 5),
  communication SMALLINT CHECK (communication BETWEEN 1 AND 5),
  documentation SMALLINT CHECK (documentation BETWEEN 1 AND 5),
  average_score NUMERIC(3,2) GENERATED ALWAYS AS (
    (COALESCE(response_speed,0) + COALESCE(manufacturer_proof,0) + COALESCE(experience,0)
     + COALESCE(certifications,0) + COALESCE(export_experience,0) + COALESCE(oem_flexibility,0)
     + COALESCE(communication,0) + COALESCE(documentation,0))::numeric
    / NULLIF(
      (CASE WHEN response_speed IS NULL THEN 0 ELSE 1 END
      +CASE WHEN manufacturer_proof IS NULL THEN 0 ELSE 1 END
      +CASE WHEN experience IS NULL THEN 0 ELSE 1 END
      +CASE WHEN certifications IS NULL THEN 0 ELSE 1 END
      +CASE WHEN export_experience IS NULL THEN 0 ELSE 1 END
      +CASE WHEN oem_flexibility IS NULL THEN 0 ELSE 1 END
      +CASE WHEN communication IS NULL THEN 0 ELSE 1 END
      +CASE WHEN documentation IS NULL THEN 0 ELSE 1 END),0)
  ) STORED,
  notes TEXT,
  scored_by UUID,
  scored_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_supplier_scores_supplier ON public.supplier_scores(supplier_id, scored_at DESC);

CREATE TABLE IF NOT EXISTS public.supplier_outreach_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('email','wechat','whatsapp','phone','alibaba_msg','line','other')),
  direction TEXT NOT NULL CHECK (direction IN ('outbound','inbound')),
  subject TEXT,
  body TEXT,
  template_id UUID,
  sent_by UUID,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  responded_at TIMESTAMPTZ,
  response_time_hours NUMERIC(8,2),
  attachments JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_supplier_outreach_supplier ON public.supplier_outreach_log(supplier_id, sent_at DESC);

CREATE TABLE IF NOT EXISTS public.supplier_outreach_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('initial_outreach','prequalification','followup','sample_request','rejection','partnership_offer','quarterly_review','other')),
  language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en','zh','th','en_zh')),
  subject_en TEXT,
  subject_zh TEXT,
  body_en TEXT,
  body_zh TEXT,
  variables TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.supplier_video_calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ,
  conducted_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  attendees_ent TEXT[],
  attendees_supplier TEXT[],
  factory_tour_done BOOLEAN DEFAULT false,
  factory_tour_notes TEXT,
  technical_qa_passed BOOLEAN,
  red_flags TEXT[] DEFAULT '{}',
  recording_url TEXT,
  agenda_completed JSONB DEFAULT '{}'::jsonb,
  category_questions_used TEXT,
  outcome TEXT CHECK (outcome IN ('proceed_to_sample','need_more_info','disqualify','reschedule')),
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_supplier_video_calls_supplier ON public.supplier_video_calls(supplier_id, conducted_at DESC);

CREATE TABLE IF NOT EXISTS public.supplier_category_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  question_en TEXT NOT NULL,
  question_zh TEXT,
  expected_answer_hint TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_supplier_cat_questions_cat ON public.supplier_category_questions(category, display_order);

CREATE TABLE IF NOT EXISTS public.supplier_sample_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  purchase_order_id UUID,
  product_model TEXT NOT NULL,
  ordered_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ,
  packaging_intact BOOLEAN,
  packaging_professional BOOLEAN,
  arrived_on_time BOOLEAN,
  build_quality_score SMALLINT CHECK (build_quality_score BETWEEN 1 AND 5),
  matches_datasheet BOOLEAN,
  burn_in_72h_passed BOOLEAN,
  documentation_clear BOOLEAN,
  thai_market_fit BOOLEAN,
  voltage_compatible BOOLEAN,
  serial_verifiable BOOLEAN,
  evaluator_notes TEXT,
  decision TEXT CHECK (decision IN ('proceed_pilot','need_revision','reject')),
  evaluated_by UUID,
  evaluated_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.supplier_pilot_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  purchase_order_id UUID,
  pilot_started_at TIMESTAMPTZ,
  review_due_at TIMESTAMPTZ,
  on_time_delivery BOOLEAN,
  accurate_quantity BOOLEAN,
  quality_consistent BOOLEAN,
  defects_handled BOOLEAN,
  support_responsive BOOLEAN,
  sell_through_rate NUMERIC(5,2),
  customer_feedback_score SMALLINT CHECK (customer_feedback_score BETWEEN 1 AND 5),
  decision TEXT CHECK (decision IN ('promote_partner','extend_pilot','disqualify')),
  notes TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.supplier_relationship_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE CASCADE,
  review_type TEXT NOT NULL CHECK (review_type IN ('quarterly','annual','adhoc')),
  period_start DATE,
  period_end DATE,
  total_orders INTEGER,
  total_revenue NUMERIC(14,2),
  defect_rate NUMERIC(5,2),
  on_time_rate NUMERIC(5,2),
  thai_market_feedback TEXT,
  roadmap_discussed TEXT,
  marketing_plans TEXT,
  next_review_at TIMESTAMPTZ,
  conducted_by UUID,
  conducted_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE public.supplier_qualifications        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_scores                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_outreach_log          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_outreach_templates    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_video_calls           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_category_questions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_sample_evaluations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_pilot_reviews         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_relationship_reviews  ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'supplier_qualifications','supplier_scores','supplier_outreach_log',
    'supplier_outreach_templates','supplier_video_calls','supplier_category_questions',
    'supplier_sample_evaluations','supplier_pilot_reviews','supplier_relationship_reviews'
  ])
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "admin_staff_all_%s" ON public.%I', t, t);
    EXECUTE format($p$
      CREATE POLICY "admin_staff_all_%s" ON public.%I
      FOR ALL TO authenticated
      USING (
        public.has_role(auth.uid(), 'admin')
        OR public.has_role(auth.uid(), 'super_admin')
        OR public.has_role(auth.uid(), 'staff')
        OR public.has_role(auth.uid(), 'sales')
      )
      WITH CHECK (
        public.has_role(auth.uid(), 'admin')
        OR public.has_role(auth.uid(), 'super_admin')
        OR public.has_role(auth.uid(), 'staff')
        OR public.has_role(auth.uid(), 'sales')
      )
    $p$, t, t);
  END LOOP;
END $$;

DO $$
DECLARE t TEXT;
BEGIN
  FOR t IN SELECT unnest(ARRAY[
    'supplier_qualifications','supplier_outreach_templates','supplier_video_calls',
    'supplier_sample_evaluations','supplier_pilot_reviews','supplier_relationship_reviews'
  ])
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%s_updated_at ON public.%I', t, t);
    EXECUTE format('CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column()', t, t);
  END LOOP;
END $$;

CREATE OR REPLACE FUNCTION public.sync_supplier_overall_score()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.suppliers
     SET overall_score = NEW.average_score, updated_at = now()
   WHERE id = NEW.supplier_id;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_sync_overall_score ON public.supplier_scores;
CREATE TRIGGER trg_sync_overall_score
AFTER INSERT ON public.supplier_scores
FOR EACH ROW EXECUTE FUNCTION public.sync_supplier_overall_score();

-- Seed: tech questions
INSERT INTO public.supplier_category_questions (category, question_en, question_zh, display_order) VALUES
('computer','What chipsets do you support? (Intel, AMD, ARM)','您支持哪些芯片组？',1),
('computer','Fanless design method?','无风扇设计方式？',2),
('computer','Wide temperature range tested? BIOS customization?','宽温测试范围？BIOS可定制吗？',3),
('computer','Typical DOA (dead on arrival) rate?','典型DOA率？',4),
('hmi','Display panel brand (not OEM''d)?','显示面板品牌？',1),
('hmi','Touch type (resistive, capacitive, projected capacitive)?','触摸类型？',2),
('hmi','Protocol support (Modbus, OPC UA, EtherNet/IP)?','协议支持？',3),
('network','Switching IC brand (Marvell, Broadcom, Realtek)?','交换芯片品牌？',1),
('network','Ring protocol (ERPS/RSTP) and recovery time?','环网协议及恢复时间？',2),
('network','Power input redundant? CLI/SNMP/Web mgmt?','电源冗余？管理方式？',3),
('connectivity','Radio chipset and cellular modem brand?','无线芯片及蜂窝模块？',1),
('connectivity','Dual SIM failover, VPN, remote API?','双卡、VPN、远程API？',2),
('remote_io','Channel counts and isolation voltage (>2.5kV)?','通道数和隔离电压？',1),
('remote_io','Fieldbus protocols, hot-swap, expansion?','现场总线、热插拔、扩展？',2),
('sensor','Housing material and IP rating (IP67+)?','外壳材质和防护等级？',1),
('sensor','Output type (4-20mA, IO-Link), EMC, calibration cert?','输出类型、EMC、校准？',2),
('iot_controller','Processor, RAM/Storage, OS?','处理器、内存、存储、OS？',1),
('iot_controller','Edge runtime (Python/Node-RED/Docker), cloud-agnostic?','边缘运行时？云无关？',2),
('video_wall','Panel brand, bezel size, 4K per panel?','面板品牌、边框、4K？',1),
('video_wall','Daisy-chain, 24/7 rated?','级联？24/7运行？',2),
('digital_signage','Brightness (nits) and operating temp?','亮度和工作温度？',1),
('digital_signage','Built-in SoC, CMS software, touch with gorilla glass?','SoC、CMS、触摸？',2),
('tv_monitor','Industrial vs commercial vs consumer? Inputs?','级别？输入接口？',1),
('tv_monitor','Open vs closed frame, anti-reflective, burn-in?','开放式？防反光？防烧屏？',2),
('audio_video','Resolution (4K@60/8K@30) and audio formats (Dante/AES67)?','分辨率和音频格式？',1),
('audio_video','HDCP, latency, control API?','HDCP、延迟、API？',2),
('eink','Chip source, colors, refresh rate?','芯片、颜色、刷新率？',1),
('eink','Battery life, communication (2.4G/BLE/WiFi/NFC)?','电池寿命和通信？',2),
('pick_to_light','Display visibility distance, button type, integration API?','可见距离、按键、API？',1),
('pick_to_light','Wireless reliability and install complexity?','无线可靠性和安装？',2),
('amr','Payload (kg) and navigation (LiDAR SLAM + vision)?','载重和导航？',1),
('amr','Safety cert (ISO 3691-4), fleet mgmt, Thai partner?','安全认证、车队、泰国服务？',2),
('accessory','Product range, customization MOQ, OEM packaging?','范围、MOQ、OEM包装？',1)
ON CONFLICT DO NOTHING;

-- Seed: outreach templates
INSERT INTO public.supplier_outreach_templates (template_key, name, category, language, subject_en, subject_zh, body_en, body_zh, variables) VALUES
('initial_prequalification','Initial Pre-qualification (10 Questions)','initial_outreach','en_zh',
 'ENT Group Thailand — Partnership Inquiry','泰国ENT Group — 合作伙伴询问',
 E'Dear {supplier_name},\n\nWe are ENT Group, Thailand''s leading distributor of industrial computers and automation products. We are expanding our product catalog and looking for qualified Chinese manufacturing partners.\n\nBefore scheduling a video call, please answer:\n\n1. Factory type: manufacturer or trader?\n2. Year established?\n3. Total employees (production vs R&D)?\n4. Monthly capacity for main product line?\n5. Annual revenue range (USD)?\n6. Export markets and % of revenue from exports?\n7. Certifications (ISO 9001, CE, FCC, RoHS, CCC, UL)?\n8. OEM/ODM capability level?\n9. MOQ per SKU for first order?\n10. Sample policy and shipping cost?\n\nPlease respond within 3 business days with: business license, factory photos (3+ exterior, 3+ production line), and 1-2 flagship datasheets.\n\nBest regards,\n{sender_name}\nENT Group Co., Ltd.',
 E'尊敬的 {supplier_name}：\n\n我们是泰国领先的工业电脑及自动化产品分销商 ENT Group，正在寻找合格的中国制造合作伙伴。\n\n在安排视频通话前请回答：\n\n1. 工厂性质：制造商还是贸易公司？\n2. 成立年份？\n3. 员工人数（生产 vs 研发）？\n4. 主产品月产能？\n5. 年营业额范围？\n6. 出口市场及占比？\n7. 认证（ISO 9001、CE、FCC、RoHS、CCC、UL）？\n8. OEM/ODM 能力？\n9. 首次订购MOQ？\n10. 样品政策和运费？\n\n请3个工作日内回复，附：营业执照、工厂照片（外观3张+产线3张）、1-2份主打产品规格书。\n\n此致\n{sender_name}\nENT Group Co., Ltd.',
 ARRAY['supplier_name','sender_name']),
('followup_3day','3-Day Follow-up','followup','en_zh',
 'Following up — ENT Group inquiry','跟进 — ENT Group 询问',
 E'Dear {supplier_name},\n\nFollowing up on our inquiry sent on {sent_date}. We are still very interested in exploring a partnership.\n\nIf the timing was inconvenient, please let us know a better time.\n\nBest regards,\n{sender_name}',
 E'尊敬的 {supplier_name}：\n\n跟进 {sent_date} 发送的询问。我们仍非常有兴趣探索合作。\n\n如时机不便请告知合适时间。\n\n此致\n{sender_name}',
 ARRAY['supplier_name','sender_name','sent_date']),
('sample_request','Sample Order Request','sample_request','en_zh',
 'Sample Order Request — {product_model}','样品订购请求 — {product_model}',
 E'Dear {supplier_name},\n\nAfter our productive video call, we are ready to order samples for hands-on evaluation in Thailand.\n\nSample Order:\n- Product: {product_model}\n- Quantity: {quantity}\n- Shipping: DHL/FedEx Express to Bangkok\n\nPlease prepare:\n1. Pro-forma invoice\n2. Packing list with HS code\n3. Certificate of origin\n4. Product manual/datasheet in English\n\nWe expect samples within 7-14 days.\n\nBest regards,\n{sender_name}',
 E'尊敬的 {supplier_name}：\n\n经过视频通话，我们准备订购样品在泰国测试。\n\n样品订单：\n- 产品：{product_model}\n- 数量：{quantity}\n- 运输：DHL/FedEx 至曼谷\n\n请准备：形式发票、装箱单(HS编码)、原产地证书、英文手册。7-14天内收到样品。\n\n此致\n{sender_name}',
 ARRAY['supplier_name','sender_name','product_model','quantity']),
('polite_rejection','Polite Rejection','rejection','en_zh',
 'Update on partnership evaluation','合作评估更新',
 E'Dear {supplier_name},\n\nThank you for the time and information. After careful internal review, we have decided not to proceed at this time.\n\nWe wish you success and may reconnect in the future.\n\nBest regards,\n{sender_name}',
 E'尊敬的 {supplier_name}：\n\n感谢您的时间与信息。经评估，我们目前暂不推进合作。\n\n祝贵公司发展顺利，未来再联。\n\n此致\n{sender_name}',
 ARRAY['supplier_name','sender_name']),
('partnership_offer','Partnership Offer','partnership_offer','en_zh',
 'Welcome to ENT Group Partner Network','欢迎加入 ENT Group 合作伙伴',
 E'Dear {supplier_name},\n\nCongratulations! Based on the successful 90-day pilot results, we are pleased to offer official partner status with ENT Group.\n\nNext steps:\n- Onboard to ENT Partner Portal\n- Featured on ENT website\n- Thai market exclusivity discussion\n- Joint marketing planning\n\nBest regards,\n{sender_name}',
 E'尊敬的 {supplier_name}：\n\n恭喜！基于90天试单成功表现，正式邀请加入ENT合作伙伴体系。\n\n下一步：合作伙伴门户、网站展示、泰国独家、联合营销。\n\n此致\n{sender_name}',
 ARRAY['supplier_name','sender_name']),
('quarterly_review','Quarterly Business Review Invite','quarterly_review','en_zh',
 'Quarterly Business Review — {quarter}','季度业务回顾 — {quarter}',
 E'Dear {supplier_name},\n\nIt is time for our scheduled quarterly business review for {quarter}. Please join us to discuss order/delivery, quality, Thai market feedback, roadmap, and joint marketing.\n\nProposed: {meeting_date}. Please confirm or suggest alternative.\n\nBest regards,\n{sender_name}',
 E'尊敬的 {supplier_name}：\n\n本季度（{quarter}）业务回顾时间已到。请视频通话讨论订单交付、质量、泰国反馈、产品路线图、联合营销。\n\n建议：{meeting_date}。请确认或提议其它时间。\n\n此致\n{sender_name}',
 ARRAY['supplier_name','sender_name','quarter','meeting_date'])
ON CONFLICT (template_key) DO NOTHING;
