#!/usr/bin/env python3
"""
ENT Group — TouchWork Datasheet PDF Generator
Pre-generates premium 2-page A4 technical datasheets for all 16 TouchWork models.

Design: Technical Datasheet — Dense info + colored sidebar
Output: public/datasheets/{MODEL}-Datasheet-ENTGroup.pdf
"""

import json
import os
import sys
from pathlib import Path
from io import BytesIO

import qrcode
from PIL import Image
from reportlab.lib.colors import HexColor, white, black
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas
from reportlab.platypus import Table, TableStyle, Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT

# ── Paths ──────────────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent
DATA_FILE = ROOT / "scripts" / "touchwork-products-data.json"
PRODUCTS_DIR = ROOT / "src" / "assets" / "touchwork"
OUTPUT_DIR = ROOT / "public" / "datasheets"
FONT_DIR = Path("/tmp/fonts")

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# ── Brand ──────────────────────────────────────────────────────────────────
BRAND_PRIMARY = HexColor("#1d4ed8")        # ENT blue
BRAND_DARK = HexColor("#0f172a")           # Slate-900
BRAND_ACCENT = HexColor("#0ea5e9")         # Sky-500 (gradient pair)
TEXT_DARK = HexColor("#0f172a")
TEXT_MUTED = HexColor("#64748b")
BORDER = HexColor("#e2e8f0")
ROW_ALT = HexColor("#f8fafc")
TABLE_HEADER_BG = HexColor("#1e293b")      # Slate-800
SIDEBAR_BG = HexColor("#0f172a")           # Slate-900

# ── Company (hardcoded as requested) ───────────────────────────────────────
COMPANY = {
    "name_en": "ENT GROUP Co., Ltd.",
    "name_th": "บริษัท อีเอ็นที กรุ๊ป จำกัด",
    "address_line1": "70/5 Moo 4, Metro Biztown, Chaengwattana 2",
    "address_line2": "Khlong Phra Udom, Pak Kret, Nonthaburi 11120",
    "address_line3": "Thailand",
    "tax_id": "0135558013167",
    "email": "sales@entgroup.co.th",
    "website": "www.entgroup.co.th",
}

# ── Fonts ──────────────────────────────────────────────────────────────────
pdfmetrics.registerFont(TTFont("Sarabun", str(FONT_DIR / "Sarabun-Regular.ttf")))
pdfmetrics.registerFont(TTFont("Sarabun-Bold", str(FONT_DIR / "Sarabun-Bold.ttf")))
pdfmetrics.registerFont(TTFont("Sarabun-Semi", str(FONT_DIR / "Sarabun-SemiBold.ttf")))
pdfmetrics.registerFont(TTFont("Sarabun-Light", str(FONT_DIR / "Sarabun-Light.ttf")))

PAGE_W, PAGE_H = A4
SIDEBAR_W = 38 * mm
CONTENT_X = SIDEBAR_W + 8 * mm
CONTENT_W = PAGE_W - CONTENT_X - 8 * mm

# ── Defaults ───────────────────────────────────────────────────────────────
DEFAULT_ANDROID = [
    ("Rockchip RK3568", "ARM Mali-G52 2EE", "2GB (เลือก 4GB)", "16/32GB eMMC", "Android 11"),
    ("Rockchip RK3588", "ARM Mali-G610",     "4GB (เลือก 8GB)", "64/128GB eMMC", "Android 12"),
    ("Rockchip RK3576", "ARM Mali-G52",      "4GB (เลือก 8GB)", "32/64GB eMMC", "Android 14"),
]
DEFAULT_WINDOWS = [
    ("Intel® Celeron® J6412",   "Intel® UHD Graphics",          "DDR4 8GB",  "mSATA 128GB", "Win 10 LTSC"),
    ("Intel® Core™ i5-8257U",   "Intel® Iris® Plus 645",        "DDR4 8GB",  "mSATA 256GB", "Win 10/11"),
    ("Intel® Core™ i7-10510U",  "Intel® UHD Graphics",          "DDR4 8GB",  "mSATA 256GB", "Win 10/11"),
]


# ── Helpers ────────────────────────────────────────────────────────────────
def gen_qr(url: str, size_px: int = 400) -> Image.Image:
    qr = qrcode.QRCode(
        version=None, error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=10, border=1,
    )
    qr.add_data(url)
    qr.make(fit=True)
    img = qr.make_image(fill_color="#0f172a", back_color="white").convert("RGB")
    return img.resize((size_px, size_px), Image.LANCZOS)


def find_product_image(model: str) -> Path | None:
    """Pick the best hero image (prefer X86 > ARM > Monitor)."""
    candidates = []
    for arch in ["X86", "ARM", "Monitor"]:
        for p in [
            PRODUCTS_DIR / f"{model}-{arch}.jpg",
            PRODUCTS_DIR / "products" / f"{model.lower()}-{arch.lower()}.jpg",
        ]:
            if p.exists():
                candidates.append(p)
                break
    return candidates[0] if candidates else None


def draw_sidebar(c: canvas.Canvas, page_num: int, total_pages: int, model: str):
    """Left vertical colored sidebar with brand + page info."""
    # Gradient-like effect: solid dark + accent stripe
    c.setFillColor(SIDEBAR_BG)
    c.rect(0, 0, SIDEBAR_W, PAGE_H, fill=1, stroke=0)
    # Accent stripe right edge
    c.setFillColor(BRAND_PRIMARY)
    c.rect(SIDEBAR_W - 3, 0, 3, PAGE_H, fill=1, stroke=0)

    # Brand mark — "ENT" wordmark stacked
    c.setFillColor(white)
    c.setFont("Sarabun-Bold", 22)
    c.drawString(8 * mm, PAGE_H - 22 * mm, "ENT")
    c.setFont("Sarabun-Light", 9)
    c.setFillColor(HexColor("#94a3b8"))
    c.drawString(8 * mm, PAGE_H - 28 * mm, "GROUP")

    # Vertical divider
    c.setStrokeColor(HexColor("#334155"))
    c.setLineWidth(0.5)
    c.line(8 * mm, PAGE_H - 32 * mm, SIDEBAR_W - 8 * mm, PAGE_H - 32 * mm)

    # Section: Series
    c.setFillColor(HexColor("#94a3b8"))
    c.setFont("Sarabun-Semi", 7)
    c.drawString(8 * mm, PAGE_H - 38 * mm, "SERIES")
    c.setFillColor(white)
    c.setFont("Sarabun-Bold", 11)
    c.drawString(8 * mm, PAGE_H - 44 * mm, "TouchWork")

    # Section: Model
    c.setFillColor(HexColor("#94a3b8"))
    c.setFont("Sarabun-Semi", 7)
    c.drawString(8 * mm, PAGE_H - 54 * mm, "MODEL")
    c.setFillColor(white)
    c.setFont("Sarabun-Bold", 14)
    c.drawString(8 * mm, PAGE_H - 61 * mm, model)

    # Bottom: rotated tagline
    c.saveState()
    c.translate(14 * mm, 30 * mm)
    c.rotate(90)
    c.setFillColor(HexColor("#64748b"))
    c.setFont("Sarabun-Semi", 7)
    c.drawString(0, 0, "B2B INDUSTRIAL PLATFORM")
    c.restoreState()

    # Bottom: page number
    c.setFillColor(HexColor("#94a3b8"))
    c.setFont("Sarabun", 8)
    c.drawString(8 * mm, 16 * mm, f"Page {page_num}")
    c.setFillColor(HexColor("#64748b"))
    c.setFont("Sarabun-Light", 7)
    c.drawString(8 * mm, 12 * mm, f"of {total_pages}")


def draw_header_bar(c: canvas.Canvas, title: str, subtitle: str = ""):
    """Top right header bar — DATASHEET label."""
    y_top = PAGE_H - 14 * mm
    c.setFillColor(TEXT_MUTED)
    c.setFont("Sarabun-Semi", 7)
    c.drawString(CONTENT_X, y_top, "PRODUCT DATASHEET")
    c.setFillColor(BRAND_PRIMARY)
    c.setFont("Sarabun-Bold", 7)
    c.drawRightString(PAGE_W - 8 * mm, y_top, "ENTGROUP.CO.TH")
    # underline
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.5)
    c.line(CONTENT_X, y_top - 2, PAGE_W - 8 * mm, y_top - 2)


def draw_footer(c: canvas.Canvas):
    """Bottom — minimal company strip."""
    y = 10 * mm
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.5)
    c.line(CONTENT_X, y + 6 * mm, PAGE_W - 8 * mm, y + 6 * mm)
    c.setFillColor(TEXT_MUTED)
    c.setFont("Sarabun", 7)
    c.drawString(CONTENT_X, y + 2 * mm, f"{COMPANY['name_en']}  •  Tax ID: {COMPANY['tax_id']}  •  {COMPANY['email']}")
    c.drawRightString(PAGE_W - 8 * mm, y + 2 * mm, COMPANY["website"])


def section_title(c: canvas.Canvas, x: float, y: float, label: str, w: float = None):
    """Section header bar with brand accent (vertical bar + label + horizontal divider)."""
    if w is None:
        w = CONTENT_W
    # Vertical accent bar
    c.setFillColor(BRAND_PRIMARY)
    c.rect(x, y - 1, 3, 10, fill=1, stroke=0)
    c.setFillColor(TEXT_DARK)
    c.setFont("Sarabun-Bold", 9)
    c.drawString(x + 7, y + 2, label.upper())
    # Horizontal divider — starts AFTER the label, sits BELOW baseline
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.4)
    label_w = c.stringWidth(label.upper(), "Sarabun-Bold", 9) + 14
    c.line(x + label_w, y + 5, x + w, y + 5)


def subheading(c: canvas.Canvas, x: float, y: float, label: str):
    """Small blue subheading without underline (used above each spec table)."""
    c.setFillColor(BRAND_PRIMARY)
    c.setFont("Sarabun-Bold", 8)
    c.drawString(x, y, label.upper())


def spec_table(rows, col_widths, header_row=None, font_size=8) -> Table:
    """Build a clean technical spec table."""
    data = []
    if header_row:
        data.append(header_row)
    data.extend(rows)
    t = Table(data, colWidths=col_widths, hAlign="LEFT")
    style = [
        ("FONT", (0, 0), (-1, -1), "Sarabun", font_size),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ("LINEBELOW", (0, 0), (-1, -1), 0.3, BORDER),
    ]
    if header_row:
        style += [
            ("BACKGROUND", (0, 0), (-1, 0), TABLE_HEADER_BG),
            ("TEXTCOLOR", (0, 0), (-1, 0), white),
            ("FONT", (0, 0), (-1, 0), "Sarabun-Bold", font_size),
            ("LINEBELOW", (0, 0), (-1, 0), 0, white),
        ]
        data_rows_start = 1
    else:
        data_rows_start = 0
        # First column = label (muted)
        style += [
            ("TEXTCOLOR", (0, 0), (0, -1), TEXT_MUTED),
            ("FONT", (0, 0), (0, -1), "Sarabun", font_size),
            ("FONT", (1, 0), (-1, -1), "Sarabun-Semi", font_size),
            ("TEXTCOLOR", (1, 0), (-1, -1), TEXT_DARK),
        ]
    # alternating rows
    for i in range(data_rows_start, len(data)):
        if (i - data_rows_start) % 2 == 0:
            style.append(("BACKGROUND", (0, i), (-1, i), ROW_ALT))
    t.setStyle(TableStyle(style))
    return t


# ── Page builders ──────────────────────────────────────────────────────────
def build_page1(c: canvas.Canvas, p: dict):
    draw_sidebar(c, 1, 2, p["model"])
    draw_header_bar(c, p["model"])
    draw_footer(c)

    # ── Hero block ──
    y = PAGE_H - 22 * mm
    # Title
    c.setFillColor(TEXT_DARK)
    c.setFont("Sarabun-Bold", 26)
    c.drawString(CONTENT_X, y - 8 * mm, p["model"])
    # Subtitle
    c.setFillColor(TEXT_MUTED)
    c.setFont("Sarabun", 10)
    subtitle = f'จอสัมผัสอุตสาหกรรม {p["size"]}" • {p["resolution"]} ({p["ratio"]}) • PCAP 10-point'
    c.drawString(CONTENT_X, y - 14 * mm, subtitle)

    # Spec chips row
    chips = [
        f'{p["size"]}"',
        p["resolution"],
        p["brightness"],
        p["ipRating"].split("(")[0].strip(),
        " / ".join(p["mounting"][:2]),
    ]
    cx = CONTENT_X
    cy = y - 22 * mm
    c.setFont("Sarabun-Semi", 8)
    for chip in chips:
        w = c.stringWidth(chip, "Sarabun-Semi", 8) + 10
        c.setFillColor(HexColor("#eff6ff"))
        c.setStrokeColor(BRAND_PRIMARY)
        c.setLineWidth(0.5)
        c.roundRect(cx, cy - 2, w, 14, 7, fill=1, stroke=1)
        c.setFillColor(BRAND_PRIMARY)
        c.drawString(cx + 5, cy + 2, chip)
        cx += w + 4

    # Hero image (right side) + highlights (left)
    hero_top = cy - 8 * mm
    img_w = 70 * mm
    img_h = 52 * mm
    img_x = PAGE_W - 8 * mm - img_w
    img_y = hero_top - img_h

    # Image background card
    c.setFillColor(HexColor("#f1f5f9"))
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.5)
    c.roundRect(img_x, img_y, img_w, img_h, 4, fill=1, stroke=1)

    img_path = find_product_image(p["model"])
    if img_path:
        try:
            from reportlab.lib.utils import ImageReader
            ir = ImageReader(str(img_path))
            iw, ih = ir.getSize()
            scale = min((img_w - 16) / iw, (img_h - 16) / ih)
            dw, dh = iw * scale, ih * scale
            c.drawImage(ir, img_x + (img_w - dw) / 2, img_y + (img_h - dh) / 2,
                        width=dw, height=dh, mask="auto", preserveAspectRatio=True)
        except Exception as e:
            print(f"  ⚠ image error {p['model']}: {e}")

    # Highlights (left of image)
    hx = CONTENT_X
    hy = hero_top - 4 * mm
    c.setFillColor(TEXT_DARK)
    c.setFont("Sarabun-Bold", 9)
    c.drawString(hx, hy, "★ HIGHLIGHTS")
    hy -= 6 * mm
    c.setFont("Sarabun", 9)
    for hl in p["highlights"]:
        c.setFillColor(BRAND_PRIMARY)
        c.circle(hx + 1.5, hy + 2, 1.2, fill=1, stroke=0)
        c.setFillColor(TEXT_DARK)
        c.drawString(hx + 6, hy, hl)
        hy -= 5.2 * mm

    # Architecture options
    arch_y = hy - 3 * mm
    c.setFillColor(TEXT_DARK)
    c.setFont("Sarabun-Bold", 9)
    c.drawString(hx, arch_y, "⚙ ARCHITECTURE")
    arch_y -= 5 * mm
    arch_descs = {
        "Monitor": ("Monitor", "Plug & Play (HDMI/VGA)", "ต่อเข้ากับเครื่องคอมหลัก"),
        "ARM": ("ARM (Android)", "Android 11/13", "Rockchip RK3568/RK3588"),
        "X86": ("X86 (Windows)", "Windows 10/11", "Intel Celeron–Core i7"),
    }
    for arch in p["archs"]:
        if arch not in arch_descs:
            continue
        name, os_, cpu = arch_descs[arch]
        c.setFillColor(BRAND_PRIMARY)
        c.setFont("Sarabun-Bold", 8)
        c.drawString(hx, arch_y, "▸ " + name)
        c.setFillColor(TEXT_MUTED)
        c.setFont("Sarabun", 7.5)
        c.drawString(hx + 5, arch_y - 3.5 * mm, f"{os_} • {cpu}")
        arch_y -= 8 * mm

    # ── Specs grid (LCD + Touch + Environment + Dimension) ──
    spec_y = img_y - 8 * mm
    section_title(c, CONTENT_X, spec_y, "Technical Specifications")
    spec_y -= 6 * mm

    # Two-column grid
    col_w = (CONTENT_W - 6 * mm) / 2

    lcd_rows = [
        ["ขนาดหน้าจอ", f'{p["size"]} นิ้ว'],
        ["ความละเอียด", p["resolution"]],
        ["อัตราส่วน", p["ratio"]],
        ["ความสว่าง", p["brightness"]],
        ["Contrast Ratio", "1000:1"],
        ["มุมมอง H/V", "178° / 178°"],
        ["Refresh Rate", "60 Hz"],
    ]
    touch_rows = [
        ["เทคโนโลยี", "PCAP Multi-touch"],
        ["จุดสัมผัส", "10 จุด"],
        ["Response Time", "< 5 ms"],
        ["Scanning Freq.", "200 Hz"],
        ["Glass", "Mohs Class 7"],
        ["Operating Voltage", "DC +5V ±5%"],
        ["Surface", "Explosion-proof"],
    ]

    # LCD card
    subheading(c, CONTENT_X, spec_y - 2, "LCD PANEL")
    t1 = spec_table(lcd_rows, [col_w * 0.45, col_w * 0.55])
    t1.wrapOn(c, col_w, 200)
    t1.drawOn(c, CONTENT_X, spec_y - 7 * mm - t1._height)

    # Touch card
    subheading(c, CONTENT_X + col_w + 6 * mm, spec_y - 2, "TOUCH PANEL")
    t2 = spec_table(touch_rows, [col_w * 0.45, col_w * 0.55])
    t2.wrapOn(c, col_w, 200)
    t2.drawOn(c, CONTENT_X + col_w + 6 * mm, spec_y - 7 * mm - t2._height)

    grid_bottom = spec_y - 7 * mm - max(t1._height, t2._height)

    # Environment + Dimension row
    env_y = grid_bottom - 7 * mm
    env_rows = [
        ["อุณหภูมิใช้งาน", "0°C – 50°C"],
        ["ความชื้นใช้งาน", "10% – 80% RH"],
        ["อุณหภูมิเก็บ", "−5°C – 60°C"],
        ["ความชื้นเก็บ", "10% – 85% RH"],
    ]
    dim_rows = [
        ["IP Rating", p["ipRating"]],
        ["ติดตั้ง", " • ".join(p["mounting"])],
    ]
    if p.get("dimensionMm"):
        dim_rows.insert(0, ["ขนาด (W×H×T)", p["dimensionMm"]])
    if p.get("netWeight"):
        dim_rows.append(["น้ำหนัก", p["netWeight"]])

    subheading(c, CONTENT_X, env_y - 2, "ENVIRONMENT")
    t3 = spec_table(env_rows, [col_w * 0.45, col_w * 0.55])
    t3.wrapOn(c, col_w, 200)
    t3.drawOn(c, CONTENT_X, env_y - 7 * mm - t3._height)

    subheading(c, CONTENT_X + col_w + 6 * mm, env_y - 2, "DIMENSION & MOUNTING")
    t4 = spec_table(dim_rows, [col_w * 0.45, col_w * 0.55])
    t4.wrapOn(c, col_w, 200)
    t4.drawOn(c, CONTENT_X + col_w + 6 * mm, env_y - 7 * mm - t4._height)


def build_page2(c: canvas.Canvas, p: dict, qr_product: Image.Image, qr_quote: Image.Image):
    draw_sidebar(c, 2, 2, p["model"])
    draw_header_bar(c, p["model"])
    draw_footer(c)

    y = PAGE_H - 22 * mm

    # Title
    c.setFillColor(TEXT_DARK)
    c.setFont("Sarabun-Bold", 16)
    c.drawString(CONTENT_X, y, "Configuration Options & Power")
    c.setFillColor(TEXT_MUTED)
    c.setFont("Sarabun", 9)
    c.drawString(CONTENT_X, y - 6 * mm, "ตัวเลือกระบบประมวลผลและแหล่งจ่ายไฟสำหรับรุ่น " + p["model"])

    # Power Supply
    pwr_y = y - 14 * mm
    section_title(c, CONTENT_X, pwr_y, "Power Supply")
    pwr_rows = [
        ["Power Input", "110–240V AC 50/60Hz"],
        ["Power Output", "DC 12V 3A"],
        ["Standby Power", "≤ 0.5W"],
        ["Power สูงสุด (Monitor)", "< 30W"],
        ["Power สูงสุด (Android)", "< 36W"],
        ["Power สูงสุด (Windows)", "< 48W"],
    ]
    col_w = (CONTENT_W - 6 * mm) / 2
    pwr_tbl = spec_table(pwr_rows, [col_w * 0.55, col_w * 0.45])
    pwr_tbl.wrapOn(c, col_w, 200)
    pwr_tbl.drawOn(c, CONTENT_X, pwr_y - 8 * mm - pwr_tbl._height)

    # Delivery contents (right column)
    del_y = pwr_y - 6 * mm
    c.setFillColor(BRAND_PRIMARY)
    c.setFont("Sarabun-Bold", 8)
    c.drawString(CONTENT_X + col_w + 6 * mm, del_y - 2, "IN THE BOX")
    c.rect(CONTENT_X + col_w + 6 * mm, del_y - 4, 30, 0.8, fill=1, stroke=0)
    items = [
        "✓ คู่มือการใช้งาน × 1",
        "✓ อุปกรณ์ติดตั้ง (Bracket/Mount) × 1",
        "✓ สาย AC Power × 1",
    ]
    if "ARM" in p["archs"] or "X86" in p["archs"]:
        items.append("✓ เสาอากาศ Wi-Fi × 1")
    items.append("✓ ใบรับประกัน 1 ปี (มาตรฐาน)")
    items.append("✓ ขยายได้ถึง 3 ปี (Optional)")

    iy = del_y - 6 * mm
    c.setFillColor(TEXT_DARK)
    c.setFont("Sarabun", 9)
    for it in items:
        c.drawString(CONTENT_X + col_w + 6 * mm, iy, it)
        iy -= 5 * mm

    # Android options
    cpu_y = pwr_y - 8 * mm - pwr_tbl._height - 10 * mm
    if "ARM" in p["archs"]:
        section_title(c, CONTENT_X, cpu_y, "Android (ARM) CPU Options")
        rows = [["CPU", "GPU", "Memory", "Storage", "OS"]]
        rows.extend([list(r) for r in DEFAULT_ANDROID])
        cw = [
            CONTENT_W * 0.26, CONTENT_W * 0.21, CONTENT_W * 0.16,
            CONTENT_W * 0.18, CONTENT_W * 0.19,
        ]
        t = spec_table(rows[1:], cw, header_row=rows[0], font_size=7.5)
        t.wrapOn(c, CONTENT_W, 200)
        t.drawOn(c, CONTENT_X, cpu_y - 6 * mm - t._height)
        cpu_y = cpu_y - 6 * mm - t._height - 6 * mm

    # Windows options
    if "X86" in p["archs"]:
        section_title(c, CONTENT_X, cpu_y, "Windows (X86) CPU Options")
        rows = [["CPU", "GPU", "Memory", "Storage", "OS"]]
        rows.extend([list(r) for r in DEFAULT_WINDOWS])
        cw = [
            CONTENT_W * 0.26, CONTENT_W * 0.21, CONTENT_W * 0.16,
            CONTENT_W * 0.18, CONTENT_W * 0.19,
        ]
        t = spec_table(rows[1:], cw, header_row=rows[0], font_size=7.5)
        t.wrapOn(c, CONTENT_W, 200)
        t.drawOn(c, CONTENT_X, cpu_y - 6 * mm - t._height)
        cpu_y = cpu_y - 6 * mm - t._height - 6 * mm

    # ── Contact card with QR codes ──
    card_h = 50 * mm
    card_y = 24 * mm
    c.setFillColor(BRAND_DARK)
    c.roundRect(CONTENT_X, card_y, CONTENT_W, card_h, 6, fill=1, stroke=0)
    # accent stripe
    c.setFillColor(BRAND_PRIMARY)
    c.rect(CONTENT_X, card_y + card_h - 4, CONTENT_W, 4, fill=1, stroke=0)

    # Left column — contact
    cx_l = CONTENT_X + 6 * mm
    cy_l = card_y + card_h - 10 * mm
    c.setFillColor(HexColor("#94a3b8"))
    c.setFont("Sarabun-Semi", 7)
    c.drawString(cx_l, cy_l, "ติดต่อสั่งซื้อ / ขอใบเสนอราคา")
    c.setFillColor(white)
    c.setFont("Sarabun-Bold", 12)
    c.drawString(cx_l, cy_l - 6 * mm, COMPANY["name_en"])
    c.setFont("Sarabun", 8.5)
    c.setFillColor(HexColor("#cbd5e1"))
    c.drawString(cx_l, cy_l - 11 * mm, COMPANY["address_line1"])
    c.drawString(cx_l, cy_l - 15 * mm, COMPANY["address_line2"])
    c.drawString(cx_l, cy_l - 19 * mm, COMPANY["address_line3"])

    c.setFillColor(white)
    c.setFont("Sarabun-Semi", 8.5)
    c.drawString(cx_l, cy_l - 25 * mm, f"✉  {COMPANY['email']}")
    c.drawString(cx_l, cy_l - 29 * mm, f"⌨  {COMPANY['website']}")
    c.setFillColor(HexColor("#94a3b8"))
    c.setFont("Sarabun", 7.5)
    c.drawString(cx_l, cy_l - 33 * mm, f"Tax ID: {COMPANY['tax_id']}")

    # Right — QR codes
    qr_size = 28 * mm
    qr_y = card_y + 8 * mm
    qr1_x = CONTENT_X + CONTENT_W - 2 * qr_size - 12 * mm
    qr2_x = CONTENT_X + CONTENT_W - qr_size - 6 * mm

    # QR backgrounds (white bg)
    c.setFillColor(white)
    c.roundRect(qr1_x - 2, qr_y - 2, qr_size + 4, qr_size + 4, 3, fill=1, stroke=0)
    c.roundRect(qr2_x - 2, qr_y - 2, qr_size + 4, qr_size + 4, 3, fill=1, stroke=0)

    bio1, bio2 = BytesIO(), BytesIO()
    qr_product.save(bio1, format="PNG")
    qr_quote.save(bio2, format="PNG")
    bio1.seek(0); bio2.seek(0)
    from reportlab.lib.utils import ImageReader
    c.drawImage(ImageReader(bio1), qr1_x, qr_y, qr_size, qr_size)
    c.drawImage(ImageReader(bio2), qr2_x, qr_y, qr_size, qr_size)

    # QR labels
    c.setFillColor(HexColor("#cbd5e1"))
    c.setFont("Sarabun-Semi", 7)
    c.drawCentredString(qr1_x + qr_size / 2, qr_y + qr_size + 4, "ดูสินค้าออนไลน์")
    c.drawCentredString(qr2_x + qr_size / 2, qr_y + qr_size + 4, "ขอใบเสนอราคา")

    # Disclaimer
    c.setFillColor(TEXT_MUTED)
    c.setFont("Sarabun-Light", 6.5)
    c.drawString(CONTENT_X, 20 * mm, "ข้อมูลในเอกสารนี้อาจเปลี่ยนแปลงได้โดยไม่ต้องแจ้งล่วงหน้า • โปรดตรวจสอบสเปกล่าสุดผ่านลิงก์ใน QR  •  © 2026 ENT Group Co., Ltd.")


# ── Main ──────────────────────────────────────────────────────────────────
def generate_pdf(p: dict):
    model = p["model"]
    out = OUTPUT_DIR / f"{model}-Datasheet-ENTGroup.pdf"
    base_url = "https://www.entgroup.co.th"
    product_url = f"{base_url}/touchwork/{model.lower()}"
    quote_url = f"{base_url}/quote-request?product={model}&series=TouchWork"

    qr_product = gen_qr(product_url)
    qr_quote = gen_qr(quote_url)

    c = canvas.Canvas(str(out), pagesize=A4)
    c.setTitle(f"{model} Datasheet — ENT Group")
    c.setAuthor("ENT Group Co., Ltd.")
    c.setSubject(f"TouchWork {model} Industrial Touch Display Datasheet")
    c.setCreator("ENT Group B2B Industrial Platform")

    build_page1(c, p)
    c.showPage()
    build_page2(c, p, qr_product, qr_quote)
    c.showPage()
    c.save()
    print(f"  ✓ {out.name}")


def main():
    with open(DATA_FILE) as f:
        products = json.load(f)
    print(f"Generating {len(products)} datasheets → {OUTPUT_DIR}")
    only = sys.argv[1] if len(sys.argv) > 1 else None
    for p in products:
        if only and p["model"].lower() != only.lower():
            continue
        generate_pdf(p)
    print("Done.")


if __name__ == "__main__":
    main()
