/**
 * CF Fiberlink — Industrial Power Supply (DIN-Rail)
 * Source: 2024_CF_Fiberlink_price_list_v3.xlsx — sheet "Industrial power supply"
 *
 * 2 Series:
 *  - SGD: Plastic Molded Case, DIN-Rail
 *  - LGD: Aluminum Alloy Case, DIN-Rail
 *
 * Common Input: 85–264VAC, 50–60Hz / Color: Blue / Black
 */

export type PowerSeries = "SGD" | "LGD";

export interface PowerSupplyModel {
  model: string;
  series: PowerSeries;
  power: number;
  voltage: 12 | 24 | 48;
  current: string;
  input: string;
  freq: string;
}

export interface PowerSeriesDef {
  id: PowerSeries;
  title: string;
  th: string;
  desc: string;
  models: PowerSupplyModel[];
}

const IN = "85–264VAC";
const HZ = "50–60Hz";

const SGD_MODELS: PowerSupplyModel[] = [
  { model: "SGD-24-12", series: "SGD", power: 24, voltage: 12, current: "2.0A", input: IN, freq: HZ },
  { model: "SGD-24-24", series: "SGD", power: 24, voltage: 24, current: "1.0A", input: IN, freq: HZ },
  { model: "SGD-48-12", series: "SGD", power: 48, voltage: 12, current: "4.0A", input: IN, freq: HZ },
  { model: "SGD-48-24", series: "SGD", power: 48, voltage: 24, current: "2.0A", input: IN, freq: HZ },
  { model: "SGD-48-48", series: "SGD", power: 48, voltage: 48, current: "1.0A", input: IN, freq: HZ },
  { model: "SGD-65-12", series: "SGD", power: 65, voltage: 12, current: "5.41A", input: IN, freq: HZ },
  { model: "SGD-65-24", series: "SGD", power: 65, voltage: 24, current: "2.7A", input: "100–240VAC", freq: HZ },
  { model: "SGD-65-48", series: "SGD", power: 65, voltage: 48, current: "1.35A", input: IN, freq: HZ },
  { model: "SGD-75-12", series: "SGD", power: 75, voltage: 12, current: "6.3A", input: IN, freq: HZ },
  { model: "SGD-75-24", series: "SGD", power: 75, voltage: 24, current: "3.2A", input: "100–240VAC", freq: HZ },
  { model: "SGD-75-48", series: "SGD", power: 75, voltage: 48, current: "1.5A", input: IN, freq: HZ },
];

const LGD_MODELS: PowerSupplyModel[] = [
  { model: "LGD-24-12", series: "LGD", power: 24, voltage: 12, current: "2.0A", input: IN, freq: HZ },
  { model: "LGD-24-24", series: "LGD", power: 24, voltage: 24, current: "1.0A", input: IN, freq: HZ },
  { model: "LGD-48-12", series: "LGD", power: 48, voltage: 12, current: "4.0A", input: IN, freq: HZ },
  { model: "LGD-48-24", series: "LGD", power: 48, voltage: 24, current: "2.0A", input: IN, freq: HZ },
  { model: "LGD-48-48", series: "LGD", power: 48, voltage: 48, current: "1.0A", input: IN, freq: HZ },
  { model: "LGD-65-12", series: "LGD", power: 65, voltage: 12, current: "5.41A", input: IN, freq: HZ },
  { model: "LGD-65-24", series: "LGD", power: 65, voltage: 24, current: "2.7A", input: IN, freq: HZ },
  { model: "LGD-65-48", series: "LGD", power: 65, voltage: 48, current: "1.35A", input: IN, freq: HZ },
  { model: "LGD-75-12", series: "LGD", power: 75, voltage: 12, current: "6.3A", input: IN, freq: HZ },
  { model: "LGD-75-24", series: "LGD", power: 75, voltage: 24, current: "3.2A", input: "100–240VAC", freq: HZ },
  { model: "LGD-75-48", series: "LGD", power: 75, voltage: 48, current: "1.6A", input: IN, freq: HZ },
  { model: "LGD-120-12", series: "LGD", power: 120, voltage: 12, current: "10.0A", input: IN, freq: HZ },
  { model: "LGD-120-24", series: "LGD", power: 120, voltage: 24, current: "5.0A", input: IN, freq: HZ },
  { model: "LGD-120-48", series: "LGD", power: 120, voltage: 48, current: "2.5A", input: IN, freq: HZ },
];

export const cfPowerSupplyCatalog: PowerSeriesDef[] = [
  {
    id: "SGD",
    title: "SGD Series — Plastic Molded Case",
    th: "เคสพลาสติก ABS — DIN-Rail Industrial",
    desc: "Power Supply อุตสาหกรรมแบบราง DIN เคสพลาสติก ABS น้ำหนักเบา ติดตั้งง่าย — เหมาะกับงานตู้คอนโทรลทั่วไป โรงงาน อาคาร 24W–75W",
    models: SGD_MODELS,
  },
  {
    id: "LGD",
    title: "LGD Series — Aluminum Alloy Case",
    th: "เคสอลูมิเนียมอัลลอย — ระบายความร้อนสูง",
    desc: "Power Supply อุตสาหกรรมแบบราง DIN เคสอลูมิเนียม ระบายความร้อนดีเยี่ยม รองรับโหลดสูงต่อเนื่อง — เหมาะตู้ที่อุณหภูมิสูง โหลดหนัก 24W–120W",
    models: LGD_MODELS,
  },
];

/** สี badge ตามแรงดัน DC */
export function voltageBadgeClass(v: number): string {
  if (v === 12) return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30";
  if (v === 24) return "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/30";
  return "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/30";
}
