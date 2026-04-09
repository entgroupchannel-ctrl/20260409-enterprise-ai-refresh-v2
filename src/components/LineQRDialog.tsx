import { useState } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, X } from "lucide-react";

interface LineQRDialogProps {
  open: boolean;
  onClose: () => void;
}

const LINE_QR_URL = "https://qr-official.line.me/gs/M_entgroup_GW.png?oat_content=qr";
const LINE_ADD_URL = "https://line.me/R/ti/p/@entgroup?from=page&oat_content=url&searchId=entgroup";

const LineSvgIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.064-.022.134-.033.2-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.349 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

const LineQRDialog = ({ open, onClose }: LineQRDialogProps) => {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4" onClick={onClose}>
      <div
        className="bg-gradient-to-b from-white to-gray-100 dark:from-[hsl(220,20%,18%)] dark:to-[hsl(220,15%,12%)] rounded-2xl border border-border shadow-2xl p-6 max-w-sm w-full text-center space-y-4 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <MessageCircle size={20} className="text-[#06C755]" />
            เพิ่มเพื่อน LINE
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground"
            <X size={18} />
          </button>
        </div>

        <div className="bg-white rounded-xl p-3 inline-block">
          <img
            src={LINE_QR_URL}
            alt="LINE QR Code @entgroup"
            className="w-48 h-48 object-contain"
          />
        </div>

        <p className="text-sm text-muted-foreground">สแกน QR Code เพื่อเพิ่มเพื่อน</p>
        <p className="text-lg font-bold text-[#06C755]">@entgroup</p>

        <a
          href={LINE_ADD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#06C755] text-white font-semibold text-sm hover:opacity-90 transition-opacity"
          <LineSvgIcon />
          เพิ่มเพื่อนใน LINE
        </a>
      </div>
    </div>,
    document.body
  );
};

export { LineQRDialog, LineSvgIcon, LINE_QR_URL, LINE_ADD_URL };
export default LineQRDialog;
