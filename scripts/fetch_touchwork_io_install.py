#!/usr/bin/env python3
"""
Fetch Interface I/O image + Versatile Installation Options gallery
from touchwoipc.com for each TouchWork model.

Output:
  src/assets/touchwork/io/{MODEL}.png
  src/assets/touchwork/install/{MODEL}-{n}.png
  scripts/touchwork-io-install.json  (manifest)
"""
import json
import re
import sys
import urllib.request
from pathlib import Path

# Reuse URL list from gallery script
sys.path.insert(0, str(Path(__file__).resolve().parent))
from fetch_touchwork_galleries import URLS as MODEL_URLS  # type: ignore

ROOT = Path(__file__).resolve().parent.parent
IO_DIR = ROOT / "src" / "assets" / "touchwork" / "io"
INSTALL_DIR = ROOT / "src" / "assets" / "touchwork" / "install"
MANIFEST = ROOT / "scripts" / "touchwork-io-install.json"
IO_DIR.mkdir(parents=True, exist_ok=True)
INSTALL_DIR.mkdir(parents=True, exist_ok=True)

UA = {"User-Agent": "Mozilla/5.0 (compatible; ENT-Group-Bot/1.0)"}

# Architecture preference: Monitor pages most reliably contain the I/O figure
ARCH_PREF = ["Monitor", "ARM", "X86"]


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers=UA)
    return urllib.request.urlopen(req, timeout=30).read().decode("utf-8", "ignore")


def download(url: str, dest: Path) -> bool:
    try:
        req = urllib.request.Request(url, headers=UA)
        data = urllib.request.urlopen(req, timeout=30).read()
        dest.write_bytes(data)
        return True
    except Exception as e:
        print(f"    ✗ download {url}: {e}")
        return False


# Capture the FIRST <img src="..."> inside the Interface section
RE_INTERFACE = re.compile(
    r'Interface\s*l?/?\s*[0O].{0,3000}?<img[^>]+src="([^"]+)"',
    re.IGNORECASE | re.DOTALL,
)
# Capture all gallery-item images inside Versatile Installation Options
RE_INSTALL_BLOCK = re.compile(
    r'Versatile Installation Options.{0,15000}?</figure>\s*</div>',
    re.IGNORECASE | re.DOTALL,
)
RE_GALLERY_HREF = re.compile(r"href='(https://[^']+\.(?:png|jpg|jpeg|webp))'", re.I)
RE_GALLERY_SRC = re.compile(r'<img[^>]+src="(https://[^"]+\.(?:png|jpg|jpeg|webp))"', re.I)


def extract_for_model(model: str) -> dict:
    """Try each architecture URL; return {io: url|None, install: [url,...]}."""
    io_url = None
    install_urls: list[str] = []
    for arch in ARCH_PREF:
        url = MODEL_URLS.get((model, arch))
        if not url:
            continue
        try:
            html = fetch(url)
        except Exception as e:
            print(f"    ✗ fetch {arch}: {e}")
            continue

        if not io_url:
            m = RE_INTERFACE.search(html)
            if m:
                io_url = m.group(1)

        if not install_urls:
            block = RE_INSTALL_BLOCK.search(html)
            if block:
                seg = block.group(0)
                # Prefer full-size hrefs; fall back to <img src>
                hrefs = RE_GALLERY_HREF.findall(seg)
                if not hrefs:
                    hrefs = RE_GALLERY_SRC.findall(seg)
                # de-dupe preserve order
                seen = set()
                for h in hrefs:
                    if h not in seen:
                        seen.add(h)
                        install_urls.append(h)

        if io_url and install_urls:
            break

    return {"io": io_url, "install": install_urls}


def ext_of(url: str) -> str:
    m = re.search(r"\.(png|jpg|jpeg|webp)(?:\?|$)", url, re.I)
    return ("." + m.group(1).lower()) if m else ".png"


def main():
    models = sorted({m for (m, _a) in MODEL_URLS.keys()})
    manifest: dict[str, dict] = {}
    print(f"Processing {len(models)} models …")
    for model in models:
        print(f"• {model}")
        found = extract_for_model(model)
        entry = {"io": None, "install": []}

        if found["io"]:
            dest = IO_DIR / f"{model}{ext_of(found['io'])}"
            if download(found["io"], dest):
                entry["io"] = f"@/assets/touchwork/io/{dest.name}"
                print(f"    ✓ I/O → {dest.name}")
        else:
            print("    – no I/O image found")

        for i, u in enumerate(found["install"], 1):
            dest = INSTALL_DIR / f"{model}-{i}{ext_of(u)}"
            if download(u, dest):
                entry["install"].append(f"@/assets/touchwork/install/{dest.name}")
                print(f"    ✓ install[{i}] → {dest.name}")
        if not found["install"]:
            print("    – no install gallery found")

        manifest[model] = entry

    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2))
    print(f"\n✓ wrote manifest → {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
