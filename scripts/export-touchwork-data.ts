// Export corrected TouchWork raw data → scripts/touchwork-products-data.json
// Run: bun scripts/export-touchwork-data.ts
import { writeFileSync } from "node:fs";
import { touchworkProducts } from "../src/data/touchwork-products";

// Re-import the raw array via dynamic require workaround:
// We instead derive what the PDF generator needs from the public touchworkProducts shape.
const out = touchworkProducts.map((p) => {
  const lcd = Object.fromEntries(p.specs.lcd.map((r) => [r.label, r.value]));
  const touch = Object.fromEntries(p.specs.touch.map((r) => [r.label, r.value]));
  const env = Object.fromEntries(p.specs.environment.map((r) => [r.label, r.value]));
  const dim = Object.fromEntries(p.specs.dimension.map((r) => [r.label, r.value]));
  const pwr = Object.fromEntries(p.specs.power.map((r) => [r.label, r.value]));
  return {
    model: p.model,
    size: p.size,
    resolution: p.resolution,
    ratio: p.ratio,
    brightness: p.brightness,
    ipRating: p.ipRating,
    mounting: p.mounting,
    highlights: p.highlights,
    archs: p.variants.map((v) => v.arch),
    dimensionMm: (p as any).dimensionMm,
    netWeight: (p as any).netWeight,
    // Resolved spec fields (source of truth for PDF)
    panelType: lcd["ชนิด Panel"],
    brightnessSpec: lcd["ความสว่าง"],
    contrast: lcd["Contrast Ratio"],
    viewingAngle: lcd["มุมมอง H / V"],
    backlight: lcd["Backlight"],
    colorGamut: lcd["Color Gamut"],
    touchTech: touch["เทคโนโลยี"],
    touchPoints: touch["จำนวนจุดสัมผัส"],
    touchGlass: touch["Surface Hardness"],
    envOpTemp: env["อุณหภูมิใช้งาน"],
    envOpHum: env["ความชื้นใช้งาน"],
    envStTemp: env["อุณหภูมิเก็บรักษา"],
    envStHum: env["ความชื้นเก็บรักษา"],
    powerInput: pwr["Power Adapter Input"],
    powerOutput: pwr["Power Adapter Output"],
    powerStandby: pwr["Standby Power"],
    powerMaxMonitor: pwr["Power สูงสุด (Monitor)"],
    powerMaxArm: pwr["Power สูงสุด (Android/ARM)"],
    powerMaxX86: pwr["Power สูงสุด (Windows/X86)"],
  };
});

writeFileSync("scripts/touchwork-products-data.json", JSON.stringify(out, null, 2));
console.log(`✓ wrote ${out.length} products → scripts/touchwork-products-data.json`);
