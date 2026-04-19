import { useEffect, useState } from "react";
import { Type, Plus, Minus, RotateCcw } from "lucide-react";

const KEY = "investor_font_scale";
const MIN = 1;
const MAX = 1.4;
const STEP = 0.1;

export default function FontSizeControl({ targetId }: { targetId: string }) {
  const [scale, setScale] = useState<number>(() => {
    try {
      const v = parseFloat(localStorage.getItem(KEY) || "1");
      return isNaN(v) ? 1 : Math.min(MAX, Math.max(MIN, v));
    } catch { return 1; }
  });

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (el) el.style.fontSize = `${scale * 100}%`;
    try { localStorage.setItem(KEY, String(scale)); } catch {}
    return () => { if (el) el.style.fontSize = ""; };
  }, [scale, targetId]);

  const dec = () => setScale(s => Math.max(MIN, +(s - STEP).toFixed(2)));
  const inc = () => setScale(s => Math.min(MAX, +(s + STEP).toFixed(2)));
  const reset = () => setScale(1);

  const pct = Math.round(scale * 100);

  return (
    <div
      className="fixed bottom-5 right-5 z-40 flex items-center gap-1 rounded-full shadow-2xl px-2 py-1.5"
      style={{
        backgroundColor: "#0A1628",
        border: "1px solid rgba(201, 169, 97, 0.4)",
      }}
      role="group"
      aria-label="ปรับขนาดตัวอักษร"
    >
      <Type size={14} style={{ color: "#C9A961" }} className="ml-1.5 mr-1 hidden sm:block" />
      <button
        type="button"
        onClick={dec}
        disabled={scale <= MIN}
        aria-label="ลดขนาดตัวอักษร"
        className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ color: "#C9A961" }}
      >
        <Minus size={16} />
      </button>
      <span
        className="text-[11px] font-bold tabular-nums w-10 text-center"
        style={{ color: "#D4B876" }}
        aria-live="polite"
      >
        {pct}%
      </span>
      <button
        type="button"
        onClick={inc}
        disabled={scale >= MAX}
        aria-label="เพิ่มขนาดตัวอักษร"
        className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110 disabled:opacity-30 disabled:cursor-not-allowed"
        style={{ color: "#C9A961" }}
      >
        <Plus size={16} />
      </button>
      {scale !== 1 && (
        <button
          type="button"
          onClick={reset}
          aria-label="คืนค่าขนาดตัวอักษร"
          title="คืนค่าเริ่มต้น"
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ color: "#94A3B8" }}
        >
          <RotateCcw size={13} />
        </button>
      )}
    </div>
  );
}
