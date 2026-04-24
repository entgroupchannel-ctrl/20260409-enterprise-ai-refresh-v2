#!/usr/bin/env python3
"""
Phase 1: Scrape spec tables from touchwoipc.com for all 16 TouchWork models.
Reuses the URL map from fetch_touchwork_galleries.py.
Output: scripts/touchwork-verified-specs.json
"""
import json, re, ssl, time, urllib.request, importlib.util
from pathlib import Path
from html.parser import HTMLParser

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location("fg", ROOT / "scripts" / "fetch_touchwork_galleries.py")
fg = importlib.util.module_from_spec(spec)
spec.loader.exec_module(fg)
URLS = fg.URLS

OUT = ROOT / "scripts" / "touchwork-verified-specs.json"
CTX = ssl.create_default_context()
CTX.check_hostname = False
CTX.verify_mode = ssl.CERT_NONE

UA = "Mozilla/5.0 (compatible; TouchWorkSpecBot/1.0)"

def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, context=CTX, timeout=30) as r:
        return r.read().decode("utf-8", errors="replace")

class TableParser(HTMLParser):
    """Extract every <table> as list-of-rows-of-cells (text)."""
    def __init__(self):
        super().__init__()
        self.tables = []
        self.cur_table = None
        self.cur_row = None
        self.cur_cell = None
        self.depth = 0

    def handle_starttag(self, tag, attrs):
        if tag == "table":
            self.cur_table = []
            self.depth = 1
        elif self.cur_table is not None:
            if tag == "tr":
                self.cur_row = []
            elif tag in ("td", "th"):
                self.cur_cell = []

    def handle_endtag(self, tag):
        if tag == "table" and self.cur_table is not None:
            self.tables.append(self.cur_table)
            self.cur_table = None
        elif self.cur_table is not None:
            if tag == "tr" and self.cur_row is not None:
                self.cur_table.append(self.cur_row)
                self.cur_row = None
            elif tag in ("td", "th") and self.cur_cell is not None:
                txt = re.sub(r"\s+", " ", "".join(self.cur_cell)).strip()
                if self.cur_row is not None:
                    self.cur_row.append(txt)
                self.cur_cell = None

    def handle_data(self, data):
        if self.cur_cell is not None:
            self.cur_cell.append(data)

def extract_specs(html):
    p = TableParser()
    try:
        p.feed(html)
    except Exception:
        pass
    # Pick the largest 2-column table (typical Woo spec table)
    best = []
    for t in p.tables:
        kv = [r for r in t if len(r) == 2]
        if len(kv) > len(best):
            best = kv
    return {k: v for k, v in best}

def main():
    out = {}
    for (model, arch), url in URLS.items():
        key = f"{model}/{arch}"
        print(f"[{key}] {url}")
        try:
            html = fetch(url)
            specs = extract_specs(html)
            out[key] = {"url": url, "specs": specs}
            print(f"   -> {len(specs)} fields")
        except Exception as e:
            out[key] = {"url": url, "error": str(e)}
            print(f"   ERROR: {e}")
        time.sleep(0.4)
    OUT.write_text(json.dumps(out, indent=2, ensure_ascii=False))
    print(f"\nWrote {OUT} ({len(out)} entries)")

if __name__ == "__main__":
    main()
