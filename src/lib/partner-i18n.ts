/**
 * Localized labels for Partner Application form.
 * Inline 3-language dictionary (TH/EN/ZH) — kept separate from messages.ts
 * to avoid bloating the global i18n bundle.
 */
import type { Lang } from "@/contexts/messages";

type Dict = Record<string, { th: string; en: string; zh: string }>;

export const partnerForm: Dict = {
  // Page
  applyTitle:        { th: "ใบสมัครพันธมิตรโรงงาน", en: "Partner Application", zh: "合作伙伴申请" },
  applySubtitle:     { th: "กรอกข้อมูล 5 ขั้นตอน — ระบบจะบันทึกร่างอัตโนมัติ", en: "Complete 5 steps — your draft is auto-saved", zh: "完成 5 个步骤——草稿自动保存" },
  saveDraft:         { th: "บันทึกร่าง", en: "Save Draft", zh: "保存草稿" },
  draftSaved:        { th: "บันทึกร่างแล้ว", en: "Draft saved", zh: "草稿已保存" },
  next:              { th: "ถัดไป", en: "Next", zh: "下一步" },
  prev:              { th: "ย้อนกลับ", en: "Back", zh: "上一步" },
  submit:            { th: "ส่งใบสมัคร", en: "Submit Application", zh: "提交申请" },
  submitted:         { th: "ส่งใบสมัครเรียบร้อย", en: "Application submitted", zh: "申请已提交" },
  submittedDesc:     { th: "ทีมงานจะตรวจสอบและติดต่อกลับภายใน 7 วันทำการ", en: "Our team will review and contact you within 7 business days.", zh: "我们将在 7 个工作日内审核并联系您。" },
  required:          { th: "จำเป็น", en: "Required", zh: "必填" },
  optional:          { th: "ไม่บังคับ", en: "Optional", zh: "可选" },

  // Step titles
  step1:             { th: "ข้อมูลบริษัท", en: "Company Info", zh: "公司信息" },
  step2:             { th: "สินค้าและกำลังการผลิต", en: "Products & Capacity", zh: "产品与产能" },
  step3:             { th: "ใบรับรองและประสบการณ์", en: "Certifications & Experience", zh: "认证与经验" },
  step4:             { th: "เงื่อนไขความร่วมมือ", en: "Partnership Terms", zh: "合作条款" },
  step5:             { th: "ตรวจทานและส่ง", en: "Review & Submit", zh: "确认并提交" },

  // Step 1
  companyNameLocal:  { th: "ชื่อบริษัท (ภาษาท้องถิ่น)", en: "Company name (local)", zh: "公司名称（中文）" },
  companyNameEn:     { th: "ชื่อบริษัท (อังกฤษ)", en: "Company name (English)", zh: "公司名称（英文）" },
  businessLicense:   { th: "เลขที่ใบอนุญาตธุรกิจ", en: "Business license no.", zh: "营业执照号" },
  legalRep:          { th: "ผู้แทนตามกฎหมาย", en: "Legal representative", zh: "法定代表人" },
  capital:           { th: "ทุนจดทะเบียน (CNY)", en: "Registered capital (CNY)", zh: "注册资本（人民币）" },
  established:       { th: "ปีที่ก่อตั้ง", en: "Year established", zh: "成立年份" },
  address:           { th: "ที่อยู่", en: "Address", zh: "地址" },
  city:              { th: "เมือง", en: "City", zh: "城市" },
  province:          { th: "มณฑล", en: "Province", zh: "省份" },
  website:           { th: "เว็บไซต์", en: "Website", zh: "网站" },
  contactName:       { th: "ชื่อผู้ติดต่อ", en: "Contact name", zh: "联系人姓名" },
  contactPosition:   { th: "ตำแหน่ง", en: "Position", zh: "职位" },
  contactEmail:      { th: "อีเมลธุรกิจ", en: "Business email", zh: "企业邮箱" },
  contactPhone:      { th: "โทรศัพท์", en: "Phone", zh: "电话" },
  contactWechat:     { th: "WeChat", en: "WeChat", zh: "微信" },
  contactWhatsapp:   { th: "WhatsApp", en: "WhatsApp", zh: "WhatsApp" },
  emailWarning:      { th: "ใช้อีเมลโดเมนบริษัท (ห้ามใช้ Gmail/QQ/163)", en: "Use a corporate email domain (no Gmail/QQ/163)", zh: "请使用企业邮箱（不接受 Gmail/QQ/163）" },

  // Step 2
  productCats:       { th: "หมวดสินค้าที่ผลิต", en: "Product categories", zh: "产品类别" },
  mainProducts:      { th: "สินค้าหลัก / รุ่นเด่น", en: "Main products / flagship models", zh: "主要产品/旗舰型号" },
  oem:               { th: "รับงาน OEM", en: "OEM capable", zh: "可做 OEM" },
  odm:               { th: "รับงาน ODM", en: "ODM capable", zh: "可做 ODM" },
  monthlyCapacity:   { th: "กำลังการผลิตต่อเดือน", en: "Monthly capacity", zh: "月产能" },
  factorySize:       { th: "ขนาดโรงงาน (ตร.ม.)", en: "Factory size (sqm)", zh: "工厂面积（平方米）" },
  staffCount:        { th: "จำนวนพนักงานทั้งหมด", en: "Total staff", zh: "员工总数" },
  qaStaff:           { th: "พนักงาน QA", en: "QA staff", zh: "质检人员" },
  rdStaff:           { th: "พนักงาน R&D", en: "R&D staff", zh: "研发人员" },

  // Step 3
  certs:             { th: "ใบรับรองที่มี", en: "Certifications", zh: "持有认证" },
  exportCountries:   { th: "ประเทศที่ส่งออก", en: "Export countries", zh: "出口国家" },
  majorClients:      { th: "ลูกค้าหลัก (ที่เปิดเผยได้)", en: "Major clients (disclosable)", zh: "主要客户（可披露）" },
  exportValue:       { th: "มูลค่าการส่งออกต่อปี (USD)", en: "Annual export value (USD)", zh: "年出口额（美元）" },
  thailandExp:       { th: "เคยทำตลาดประเทศไทยมาก่อน", en: "Prior Thailand market experience", zh: "有泰国市场经验" },
  thailandExpDetail: { th: "รายละเอียดประสบการณ์ในไทย", en: "Thailand experience details", zh: "泰国经验详情" },

  // Step 4
  exclusivity:       { th: "นโยบาย Exclusive", en: "Exclusivity preference", zh: "独家政策" },
  exclYes:           { th: "Exclusive ในประเทศไทย", en: "Exclusive in Thailand", zh: "泰国独家" },
  exclNo:            { th: "ไม่บังคับ Exclusive", en: "Non-exclusive", zh: "非独家" },
  exclNeg:           { th: "เจรจาได้", en: "Negotiable", zh: "可协商" },
  moq:               { th: "MOQ ขั้นต่ำ", en: "Minimum order quantity", zh: "最低起订量" },
  paymentTerms:      { th: "เงื่อนไขการชำระเงิน", en: "Payment terms", zh: "付款条件" },
  samplePolicy:      { th: "นโยบายตัวอย่างสินค้า", en: "Sample policy", zh: "样品政策" },
  warranty:          { th: "เงื่อนไขการรับประกัน", en: "Warranty terms", zh: "保修条款" },
  partnershipType:   { th: "รูปแบบความร่วมมือที่ต้องการ", en: "Preferred partnership type", zh: "期望的合作类型" },

  // Step 5 (review/notes)
  why:               { th: "ทำไมจึงเลือก ENT Group เป็นพันธมิตร", en: "Why partner with ENT Group?", zh: "为什么选择 ENT Group 作为合作伙伴？" },
  notes:             { th: "หมายเหตุเพิ่มเติม", en: "Additional notes", zh: "其他备注" },
  heardFrom:         { th: "รู้จัก ENT Group จากที่ใด", en: "How did you hear about us?", zh: "您是如何了解 ENT Group 的？" },

  // Files
  uploadTitle:       { th: "เอกสารแนบ", en: "Documents", zh: "附件文件" },
  uploadLicense:     { th: "ใบอนุญาตธุรกิจ (PDF/JPG)", en: "Business license (PDF/JPG)", zh: "营业执照（PDF/JPG）" },
  uploadFactory:     { th: "ภาพถ่ายโรงงาน (สูงสุด 6 ภาพ)", en: "Factory photos (up to 6)", zh: "工厂照片（最多 6 张）" },
  uploadVideo:       { th: "วิดีโอเดินชมโรงงาน (สำคัญมาก)", en: "Factory walkthrough video (highly recommended)", zh: "工厂参观视频（强烈推荐）" },
  uploadCert:        { th: "ใบรับรอง ISO/CE/FCC", en: "ISO/CE/FCC certificates", zh: "ISO/CE/FCC 证书" },
  uploadCatalog:     { th: "แคตตาล็อกสินค้า", en: "Product catalog", zh: "产品目录" },
  uploadHint:        { th: "ลากไฟล์มาวาง หรือคลิกเลือก", en: "Drag files here or click to upload", zh: "拖放文件或点击上传" },
  uploading:         { th: "กำลังอัปโหลด...", en: "Uploading...", zh: "正在上传..." },

  // Validation
  errCompanyName:    { th: "กรุณากรอกชื่อบริษัท", en: "Company name is required", zh: "请填写公司名称" },
  errLicense:        { th: "กรุณากรอกเลขที่ใบอนุญาต", en: "Business license is required", zh: "请填写营业执照号" },
  errEmail:          { th: "อีเมลไม่ถูกต้อง หรือใช้โดเมนส่วนตัว", en: "Invalid email or personal domain", zh: "邮箱无效或为个人邮箱" },
  errAgree:          { th: "กรุณายอมรับข้อตกลง", en: "You must accept the agreement", zh: "请同意条款" },

  agreement:         { th: "ฉันยืนยันว่าข้อมูลทั้งหมดเป็นความจริง และยินยอมให้ ENT Group ตรวจสอบ", en: "I confirm all information is true and consent to verification by ENT Group.", zh: "我确认所有信息真实，并同意 ENT Group 进行核实。" },
};

export function pf(key: keyof typeof partnerForm, lang: Lang): string {
  const v = partnerForm[key];
  return v ? v[lang] : key;
}

export const PRODUCT_CATEGORIES = [
  { id: "industrial-pc",  th: "Industrial PC / Box PC",      en: "Industrial PC / Box PC",      zh: "工控机 / 嵌入式电脑" },
  { id: "edge-ai",        th: "Edge AI / NVIDIA Jetson",     en: "Edge AI / NVIDIA Jetson",     zh: "边缘 AI / NVIDIA Jetson" },
  { id: "panel-pc",       th: "Panel PC / Display",          en: "Panel PC / Display",          zh: "工业平板 / 显示器" },
  { id: "rugged-tablet",  th: "Rugged Tablet / Handheld",    en: "Rugged Tablet / Handheld",    zh: "三防平板 / 手持终端" },
  { id: "networking",     th: "Networking / Firewall",       en: "Networking / Firewall",       zh: "网络设备 / 防火墙" },
  { id: "cabinets",       th: "Cabinets / Power",            en: "Cabinets / Power",            zh: "机柜 / 电源" },
  { id: "iot-gateway",    th: "IoT Gateway",                 en: "IoT Gateway",                 zh: "物联网网关" },
  { id: "other",          th: "อื่น ๆ",                       en: "Other",                       zh: "其他" },
];

export const CERTS = ["ISO 9001", "ISO 14001", "CE", "FCC", "RoHS", "UL", "CCC", "BSMI"];

export const PARTNERSHIP_TYPES = [
  { id: "distributor", th: "ตัวแทนจำหน่าย", en: "Distributor", zh: "分销商" },
  { id: "oem",         th: "OEM",            en: "OEM",         zh: "OEM" },
  { id: "odm",         th: "ODM",            en: "ODM",         zh: "ODM" },
  { id: "white-label", th: "White Label",    en: "White Label", zh: "贴牌" },
  { id: "joint-rd",    th: "ร่วมพัฒนา R&D",  en: "Joint R&D",   zh: "联合研发" },
];
