#!/usr/bin/env python3
"""
Fetch full product image galleries from touchwoipc.com for all 16 TouchWork models
× 3 architectures (Monitor / ARM / X86 where available).

- Reads model list from src/data/touchwork-products.ts (hardcoded mapping below).
- Visits each product page on touchwoipc.com, extracts <img class="large-img"> URLs.
- Downloads images to src/assets/touchwork/gallery/<MODEL>-<ARCH>/<n>.jpg
- Writes a JSON manifest at src/assets/touchwork/gallery/manifest.json
  { "DM121G": { "ARM": ["...path...", ...], "Monitor": [...], "X86": [...] }, ... }
"""

import json, re, sys, time, urllib.parse, urllib.request, ssl
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "src" / "assets" / "touchwork" / "gallery"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Map our internal (MODEL, ARCH) -> touchwoipc product slug.
# ARCH names in touchwoipc: "monitor" / "android-touch-pc" (ARM) / "touch-pc" or "touch-screen-pc" (X86)
# We choose URLs from the sitemap dump (suffix -g, -e, -b, -nf, -wf, -wg).
URLS = {
    # 8" small displays -----------------------------------------------------
    ("DM080NF", "Monitor"): "https://touchwoipc.com/product/8-industrial-touch-screen-monitor-dm080nf/",
    ("DM080NF", "ARM"):     "https://touchwoipc.com/product/8-industrial-android-touch-pc-dm080nf/",
    ("DM080NF", "X86"):     "https://touchwoipc.com/product/8-industrial-touch-pc-dm080nf/",
    ("DM080WG", "Monitor"): "https://touchwoipc.com/product/8-industrial-touch-screen-monitor-dm080wg/",
    # touchwoipc has dm080wf (Android+PC) but no dm080wg ARM/X86 listed individually.
    # Fall back to dm080wf which shares the same chassis.
    ("DM080WG", "ARM"):     "https://touchwoipc.com/product/8-industrial-android-touch-pc-dm080wf/",
    # 10.1" -----------------------------------------------------------------
    ("DM101G",  "Monitor"): "https://touchwoipc.com/product/10-1-industrial-touch-screen-monitor-dm101g/",
    ("DM101G",  "ARM"):     "https://touchwoipc.com/product/10-1-industrial-android-touch-pc-dm101g/",
    ("DM101G",  "X86"):     "https://touchwoipc.com/product/10-1-industrial-touch-pc-dm101g/",
    # 10.4" -----------------------------------------------------------------
    ("DM104G",  "Monitor"): "https://touchwoipc.com/product/10-4-industrial-touch-screen-monitor-dm104g/",
    ("DM104G",  "ARM"):     "https://touchwoipc.com/product/10-4-industrial-android-touch-pc-dm104g/",
    ("DM104G",  "X86"):     "https://touchwoipc.com/product/10-4-industrial-touch-pc-dm104g/",
    # 12.1" -----------------------------------------------------------------
    ("DM121G",  "Monitor"): "https://touchwoipc.com/product/12-1-industrial-touch-screen-monitor-dm121g/",
    ("DM121G",  "ARM"):     "https://touchwoipc.com/product/12-1-industrial-android-touch-pc-dm121g/",
    ("DM121G",  "X86"):     "https://touchwoipc.com/product/12-1-industrial-touch-pc-dm121g/",
    # 15" -------------------------------------------------------------------
    ("DM15G",   "Monitor"): "https://touchwoipc.com/product/15-industrial-touch-screen-monitor-dm15g/",
    ("DM15G",   "ARM"):     "https://touchwoipc.com/product/15-industrial-android-touch-pc-dm15g/",
    ("DM15G",   "X86"):     "https://touchwoipc.com/product/15-industrial-touch-pc-dm15g/",
    # 15.6" -----------------------------------------------------------------
    ("DM156G",  "Monitor"): "https://touchwoipc.com/product/15-6-industrial-touch-screen-monitor-dm156g/",
    ("DM156G",  "ARM"):     "https://touchwoipc.com/product/15-6-industrial-android-touch-pc-dm156g/",
    ("DM156G",  "X86"):     "https://touchwoipc.com/product/15-6-industrial-touch-pc-dm156g/",
    # 17" -------------------------------------------------------------------
    ("DM17G",   "Monitor"): "https://touchwoipc.com/product/17-industrial-touch-screen-monitor-dm17g/",
    ("DM17G",   "ARM"):     "https://touchwoipc.com/product/17-industrial-android-touch-pc-dm17g/",
    ("DM17G",   "X86"):     "https://touchwoipc.com/product/17-industrial-touch-pc-dm17g/",
    # 19" -------------------------------------------------------------------
    ("DM19G",   "Monitor"): "https://touchwoipc.com/product/19-industrial-touch-screen-monitor-dm19g/",
    ("DM19G",   "ARM"):     "https://touchwoipc.com/product/19-industrial-android-touch-pc-dm19g/",
    ("DM19G",   "X86"):     "https://touchwoipc.com/product/19-industrial-touch-pc-dm19g/",
    # 21.5" DM --------------------------------------------------------------
    ("DM215G",  "Monitor"): "https://touchwoipc.com/product/21-5-industrial-touch-screen-monitor-dm215g/",
    ("DM215G",  "ARM"):     "https://touchwoipc.com/product/21-5-industrial-android-touch-pc-dm215g/",
    ("DM215G",  "X86"):     "https://touchwoipc.com/product/21-5-industrial-touch-pc-dm215g/",
    # GD101E (Wall-mount Kiosk) --------------------------------------------
    ("GD101E",  "Monitor"): "https://touchwoipc.com/product/10-1-industrial-wall-mounting-touch-kioskmonitor-gd101e/",
    ("GD101E",  "ARM"):     "https://touchwoipc.com/product/10-1-industrial-wall-mounting-touch-kioskarm-gd101e/",
    ("GD101E",  "X86"):     "https://touchwoipc.com/product/10-1-industrial-wall-mounting-touch-kioskx86-gd101e1/",
    # GD133 (Wall-mount Kiosk) ---------------------------------------------
    ("GD133",   "Monitor"): "https://touchwoipc.com/product/13-3-industrial-wall-mounting-touch-kioskmonitor-gd133/",
    ("GD133",   "ARM"):     "https://touchwoipc.com/product/13-3-industrial-wall-mounting-touch-kioskarm-gd133/",
    ("GD133",   "X86"):     "https://touchwoipc.com/product/13-3-industrial-wall-mounting-touch-kioskx86-gd133/",
    # JD133 -----------------------------------------------------------------
    ("JD133",   "Monitor"): "https://touchwoipc.com/product/13-3-industrial-touch-screen-monitor-jd133/",
    ("JD133",   "ARM"):     "https://touchwoipc.com/product/13-3-industrial-android-touch-pc-jd133/",
    # JD156B ----------------------------------------------------------------
    ("JD156B",  "Monitor"): "https://touchwoipc.com/product/15-6-industrial-touch-screen-monitor-jd156b/",
    ("JD156B",  "ARM"):     "https://touchwoipc.com/product/15-6-industrial-android-touch-pc-jd156b/",
    ("JD156B",  "X86"):     "https://touchwoipc.com/product/15-6-industrial-touch-pc-jd156b/",
    # JD185B ----------------------------------------------------------------
    ("JD185B",  "Monitor"): "https://touchwoipc.com/product/18-5-industrial-touch-screen-monitor-jd185b/",
    ("JD185B",  "ARM"):     "https://touchwoipc.com/product/18-5-industrial-android-touch-pc-jd185b/",
    ("JD185B",  "X86"):     "https://touchwoipc.com/product/18-5-industrial-touch-pc-jd185b/",
    # JD215B ----------------------------------------------------------------
    ("JD215B",  "Monitor"): "https://touchwoipc.com/product/21-5-industrial-touch-screen-monitor-jd215b/",
    ("JD215B",  "ARM"):     "https://touchwoipc.com/product/21-5-industrial-android-touch-pc-jd215b/",
    ("JD215B",  "X86"):     "https://touchwoipc.com/product/21-5-industrial-touch-pc-jd215b/",
}

CTX = ssl.create_default_context()
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; ENT-Asset-Sync/1.0)",
    "Accept": "text/html,image/*,*/*;q=0.8",
}

LARGE_IMG_RE = re.compile(
    r'<img[^>]+class="[^"]*large-img[^"]*"[^>]+src="([^"]+)"', re.IGNORECASE
)
# fallback: thumb data-large
THUMB_LARGE_RE = re.compile(
    r'<img[^>]+data-large="([^"]+)"', re.IGNORECASE
)


def fetch(url: str) -> bytes:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, context=CTX, timeout=30) as r:
        return r.read()


def extract_gallery(html: str) -> list[str]:
    urls = LARGE_IMG_RE.findall(html)
    if not urls:
        urls = THUMB_LARGE_RE.findall(html)
    # dedupe preserving order
    seen, result = set(), []
    for u in urls:
        u = u.strip().replace("&amp;", "&")
        if u not in seen:
            seen.add(u)
            result.append(u)
    return result


def safe_filename(idx: int) -> str:
    return f"{idx:02d}.jpg"


def main():
    manifest: dict[str, dict[str, list[str]]] = {}
    failed: list[tuple[str, str, str]] = []

    for (model, arch), page_url in URLS.items():
        key = f"{model}-{arch}"
        sub = OUT_DIR / key
        sub.mkdir(parents=True, exist_ok=True)
        print(f"\n▶ {key}  ←  {page_url}")
        try:
            html = fetch(page_url).decode("utf-8", errors="ignore")
        except Exception as e:
            print(f"  ✗ fetch page failed: {e}")
            failed.append((model, arch, str(e)))
            continue

        img_urls = extract_gallery(html)
        if not img_urls:
            print("  ⚠ no gallery images found")
            failed.append((model, arch, "no images"))
            continue

        rels = []
        for i, img_url in enumerate(img_urls, 1):
            try:
                data = fetch(img_url)
                fname = safe_filename(i)
                (sub / fname).write_bytes(data)
                rels.append(f"src/assets/touchwork/gallery/{key}/{fname}")
                print(f"  ✓ {i:>2} {img_url[-60:]}  ({len(data)//1024} KB)")
                time.sleep(0.15)
            except Exception as e:
                print(f"  ✗ {i:>2} download failed: {e}")

        manifest.setdefault(model, {})[arch] = rels

    (OUT_DIR / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print("\n=== DONE ===")
    print(f"Manifest: {OUT_DIR / 'manifest.json'}")
    if failed:
        print("Failures:")
        for f in failed:
            print(" -", f)


if __name__ == "__main__":
    main()
