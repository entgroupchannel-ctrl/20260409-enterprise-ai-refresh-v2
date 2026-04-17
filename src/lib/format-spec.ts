/**
 * แปลง product description แบบบรรทัดเดียวยาวๆ ให้แบ่งเป็นหมวด/บรรทัดอ่านง่าย
 * โดยตรวจจับ keyword หมวดที่พบบ่อยในสเปกอุปกรณ์ industrial PC
 *
 * - ไม่แตะข้อมูลเดิมใน DB — formatting ตอนแสดงผลอย่างเดียว
 * - ถ้า description มี \n อยู่แล้ว → คืนค่าเดิม (admin ตั้งใจจัดเอง)
 */

// หมวดหลัก: ตรวจจับเป็น "section break" — ขึ้นบรรทัดใหม่และเป็นหัวข้อ
const SECTION_KEYWORDS = [
  'System Physical Standard Configuration',
  'Interface Configuration',
  'Certification',
  'Warranty',
];

// keyword ย่อย: ขึ้นบรรทัดใหม่แต่ไม่เป็นหัวข้อ (• bullet)
const FIELD_KEYWORDS = [
  'Processor',
  'Memory',
  'Storage',
  'Dimensions',
  'Scanner',
  'Screen Size',
  'Screen Resolution',
  'Touch',
  'Battery',
  'Working Time',
  'Camera',
  'OS support',
  'WIFI',
  'Bluetooth',
  'Ethernet',
  'Network',
  'Type-C',
  'USB Interface',
  'SD / TF Card reader',
  'TF Card reader',
  'SIM Card Slot',
  'SIM Slot',
  'Audio Jack',
  'HDMI',
  'COM Port',
  'IP67',
  'IP68',
  'IP65',
  'CE',
  'FCC',
  'MIL-STD-810G',
];

export interface FormattedSpec {
  /** เป็น array ของบรรทัด — แต่ละบรรทัดมี type เพื่อให้ render style ต่างกัน */
  lines: Array<{ type: 'section' | 'field' | 'text'; label?: string; value: string }>;
  /** Plain text version (มี \n) สำหรับ fallback / pre-line */
  plainText: string;
}

export function formatProductSpec(description: string | null | undefined): FormattedSpec {
  if (!description) return { lines: [], plainText: '' };

  // ถ้า admin ใส่ \n เองแล้ว ให้เคารพ
  if (description.includes('\n')) {
    const lines = description.split('\n').map(l => ({
      type: 'text' as const,
      value: l.trim(),
    })).filter(l => l.value.length > 0);
    return { lines, plainText: description };
  }

  // Normalize: ยุบช่องว่างซ้ำ
  let text = description.replace(/\s+/g, ' ').trim();

  // สร้าง regex รวม keyword ทั้งหมด เรียงตามความยาว (ยาวก่อน) เพื่อ match ตัวที่เฉพาะกว่า
  const allKeywords = [...SECTION_KEYWORDS, ...FIELD_KEYWORDS]
    .sort((a, b) => b.length - a.length);

  // Escape regex special chars
  const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`(${allKeywords.map(escapeRe).join('|')})`, 'g');

  // หา positions ของ keyword ทั้งหมด
  const matches: Array<{ keyword: string; start: number; end: number }> = [];
  let m: RegExpExecArray | null;
  const seen = new Set<string>(); // ป้องกัน keyword ซ้ำในตำแหน่งเดียว
  while ((m = pattern.exec(text)) !== null) {
    const key = `${m.index}-${m[1]}`;
    if (seen.has(key)) continue;
    seen.add(key);
    matches.push({ keyword: m[1], start: m.index, end: m.index + m[1].length });
  }

  if (matches.length === 0) {
    return {
      lines: [{ type: 'text', value: text }],
      plainText: text,
    };
  }

  // แบ่งเป็น chunks ตาม keyword
  const lines: FormattedSpec['lines'] = [];

  // ข้อความก่อน keyword แรก (ถ้ามี)
  if (matches[0].start > 0) {
    const pre = text.slice(0, matches[0].start).trim();
    if (pre) lines.push({ type: 'text', value: pre });
  }

  for (let i = 0; i < matches.length; i++) {
    const cur = matches[i];
    const next = matches[i + 1];
    const valueStart = cur.end;
    const valueEnd = next ? next.start : text.length;
    let value = text.slice(valueStart, valueEnd).trim();
    // ตัด punctuation นำหน้าที่ไม่จำเป็น
    value = value.replace(/^[:\-,;]\s*/, '').trim();

    const isSection = SECTION_KEYWORDS.includes(cur.keyword);
    lines.push({
      type: isSection ? 'section' : 'field',
      label: cur.keyword,
      value,
    });
  }

  // สร้าง plain text version
  const plainText = lines
    .map(l => {
      if (l.type === 'section') return `\n[${l.label}]${l.value ? ' ' + l.value : ''}`;
      if (l.type === 'field') return `• ${l.label}: ${l.value}`;
      return l.value;
    })
    .join('\n')
    .trim();

  return { lines, plainText };
}
