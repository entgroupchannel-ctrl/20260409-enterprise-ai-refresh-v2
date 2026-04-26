// Shared peripherals & customization options for all TouchWo Kiosk models
// (GD27C, GD238C, GD238C3, GD32C, KD32B, KD43B …)
// อุปกรณ์ต่อพ่วงในตัวเครื่องและ Add-on Module ใช้ชุดเดียวกันทั้ง Series
import type { Display32 } from "./displays-32";

import imgThermal from "@/assets/touchwo/kiosk-peripherals/thermal-printer.jpg";
import imgScanner from "@/assets/touchwo/kiosk-peripherals/barcode-scanner.jpg";
import imgRfid from "@/assets/touchwo/kiosk-peripherals/rfid-reader.jpg";
import imgFinger from "@/assets/touchwo/kiosk-peripherals/fingerprint.jpg";
import imgKeyboard from "@/assets/touchwo/kiosk-peripherals/keyboard.jpg";
import imgDispenser from "@/assets/touchwo/kiosk-peripherals/card-dispenser.jpg";
import imgPayment from "@/assets/touchwo/kiosk-peripherals/payment-terminal.jpg";
import imgCamera from "@/assets/touchwo/kiosk-peripherals/camera.jpg";
import imgNfc from "@/assets/touchwo/kiosk-peripherals/nfc-payment.jpg";
import img4g from "@/assets/touchwo/kiosk-peripherals/4g-lte.jpg";
import imgBattery from "@/assets/touchwo/kiosk-peripherals/battery-ups.jpg";

export const KIOSK_PERIPHERALS: NonNullable<Display32["peripherals"]> = [
  {
    image: imgThermal,
    name: "Thermal Printer",
    model: "MS-E80I",
    description:
      "เครื่องพิมพ์ใบเสร็จความร้อนแบบฝังในตู้ — ตัด-เลื่อนกระดาษอัตโนมัติ พิมพ์เร็ว 250mm/s เหมาะกับงาน POS, จองคิว, ใบเสร็จเข้า-ออก",
    specs: [
      { label: "Model", value: "MS-E80I" },
      { label: "Printing Speed", value: "250 mm/s (MAX)" },
      { label: "Printing Width", value: "72 mm" },
      { label: "Paper Width", value: "80 mm (MAX)" },
      { label: "Resolution", value: "576 dots/line" },
      { label: "Paper Roll", value: "Dia. 80 mm (MAX)" },
      { label: "Paper Cut", value: "Auto Cut" },
    ],
  },
  {
    image: imgScanner,
    name: "Barcode Scanner",
    model: "EMT8020",
    description:
      "เครื่องสแกน 1D/2D ฝังหน้าตู้ — รองรับ QR Code, PDF417, DataMatrix และบาร์โค้ดทั่วไป สแกนผ่านหน้าจอมือถือได้",
    specs: [
      { label: "Model", value: "EMT8020" },
      { label: "Resolution", value: "640 × 480 CMOS" },
      { label: "Recognition Accuracy", value: "5 mil" },
      { label: "Field of View", value: "Horizontal 68°, Vertical 51°" },
      { label: "2D Codes", value: "PDF417, QR Code, DataMatrix, ฯลฯ" },
      { label: "1D Codes", value: "Code 128, EAN-13, EAN-8, Code 39, ฯลฯ" },
    ],
  },
  {
    image: imgRfid,
    name: "RFID Card Reader",
    model: "M11",
    description:
      "เครื่องอ่าน-เขียนบัตร IC/ID Mifare มาตรฐาน 13.56MHz — เหมาะกับระบบสมาชิก, Loyalty, Access Control, ตั๋วโดยสาร",
    specs: [
      { label: "Model", value: "M11" },
      { label: "Frequency", value: "IC Mifare1 / CPU / TypeA / 14443A" },
      { label: "Protocols", value: "IC / ID" },
      { label: "Supported Cards", value: "ISO 14443A / Mifare" },
      { label: "Functions", value: "Read / Write IC, Read ID" },
    ],
  },
];

export const KIOSK_CUSTOMIZATION_OPTIONS: NonNullable<Display32["customizationOptions"]> = [
  { image: imgFinger,    name: "Fingerprint Sensor", description: "เซ็นเซอร์ลายนิ้วมือ สำหรับยืนยันตัวตน / Time Attendance" },
  { image: imgKeyboard,  name: "Metal Keyboard",     description: "คีย์แพดโลหะกันน้ำ-กันงัด สำหรับ ATM / รับชำระเงิน" },
  { image: imgDispenser, name: "Card Dispenser",     description: "เครื่องจ่ายบัตรอัตโนมัติ สำหรับห้องพัก/ที่จอดรถ/บัตรสมาชิก" },
  { image: imgPayment,   name: "Payment Terminal",   description: "เครื่องรับชำระเงิน EMV / รองรับ Square / Stripe / Clover" },
  { image: imgCamera,    name: "Camera",             description: "กล้องถ่ายภาพ / Face Recognition / e-KYC" },
  { image: imgNfc,       name: "NFC Payment",        description: "โมดูล NFC สำหรับ Tap-to-Pay / Apple Pay / Google Pay" },
  { image: img4g,        name: "4G LTE",             description: "โมดูลเชื่อมต่อ 4G LTE สำหรับจุดที่ไม่มี Wi-Fi/LAN" },
  { image: imgBattery,   name: "Battery UPS",        description: "แบตเตอรี่สำรองภายใน ป้องกันไฟดับกะทันหัน" },
];

export const KIOSK_CUSTOMIZATION_LEAD_TIME =
  "ระยะเวลาปรับแต่งสั้น 7 – 35 วันทำการ ขึ้นกับจำนวนและประเภทอุปกรณ์";
