/**
 * CF Fiberlink — Industrial Power Supply (DIN-Rail)
 * Source: 2024_CF_Fiberlink_price_list_v3.xlsx — sheet "Industrial power supply"
 *
 * 2 Series:
 *  - SGD: Plastic Molded Case, DIN-Rail
 *  - LGD: Aluminum Alloy Case, DIN-Rail
 *
 * Common Input: 85–264VAC, 50–60Hz
 * Color: Blue / Black
 */

export type PowerSeries = "SGD" | "LGD";

export interface PowerSupplyModel {
  model: string;
  series: PowerSeries;
  /** กำลังไฟรวม (W) */
  power: number;
  /** แรงดัน DC ออก */
  voltage: 12 | 24 | 48;
  /** กระแส (A) */
  current: string;
  /** Input AC range */
  input: string;
  /** Frequency */
  freq: string;
}

export interface PowerSeriesDef {
  id: PowerSeries;
  title: string;
  th: string;
  desc: string;
  models: PowerSupplyModel[];
}

const COMMON_INPUT = "85–264VAC";
const COMMON_FREQ = "50–60Hz";

const SGD_MODELS: PowerSupplyModel[] = [
  { model: "SGD-24-12", series: "SGD", power: 24, voltage: 12, current: "2.0A", input: COMMON_INPUT, freq: COMMON_FREQ },
  { model: "SGD-24-24", series: "SGD", power: 24, voltage: 24, current: "1.0A", input: COMMON_INPUT, freq: COMMON_FREQ },
  { model: "SGD-48-12", series: "SGD", power: 48, voltage: 12, current: "4.0A", input: COMMON_INPUT, freq: COMMON_FREQ },
  { model: "SGD-48-24", series: "SGD", power: 48, voltage: 24, current: "2.0A", input: COMMON_INPUT, freq: COMMON_FREQ },
  { model: "SGD-48-48", series: "SGD", power: 48, voltage: 48, current: