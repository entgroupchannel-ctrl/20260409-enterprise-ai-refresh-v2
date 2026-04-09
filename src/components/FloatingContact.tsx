import { useState } from "react";
import { MessageCircle, Phone, X } from "lucide-react";
import { LineQRDialog, LineSvgIcon } from "./LineQRDialog";
import { useAutoHideWidget } from "@/hooks/useAutoHideWidget";

const FloatingContact = () => {
  const [open, setOpen] = useState(false);
  const [showLineDialog, setShowLineDialog] = useState(false);
  const { visible, onInteraction, forceShow, forceHide } = useAutoHideWidget({
    initialDelay: 2000,
    hideAfter: 8000,
    showInterval: 25000,
    showDuration: 4000,
  });

  const handleToggle = () => {
    if (open) {
      setOpen(false);
    } else {
      setOpen(true);
      forceShow();
    }
  };

  // Button visible when auto-show is active OR open
  const showButton = visible || open;

  return (
    <>
      <div
        className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 transition-all duration-500 ${
          showButton ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
        }`}
        onMouseEnter={onInteraction}
      >
        {open && (
          <div className="flex flex-col gap-2 mb-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button
              onClick={() => { setShowLineDialog(true); setOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#06C755] text-white shadow-lg hover:opacity-90 transition-opacity text-left"
            >
              <LineSvgIcon className="w-5 h-5 shrink-0" />
              <div className="text-sm">
                <p className="font-semibold">LINE @entgroup</p>
                <p className="text-xs opacity-80">แชทกับทีมขาย</p>
              </div>
            </button>

            <a
              href="tel:02-026-3854"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
            >
              <Phone size={20} className="shrink-0" />
              <div className="text-sm">
                <p className="font-semibold">02-026-3854</p>
                <p className="text-xs opacity-80">โทรหาเรา</p>
              </div>
            </a>
          </div>
        )}

        <button
          onClick={handleToggle}
          className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 ${
            open ? "bg-muted text-foreground" : "bg-primary text-primary-foreground"
          }`}
        >
          {open ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>

      <LineQRDialog open={showLineDialog} onClose={() => setShowLineDialog(false)} />
    </>
  );
};

export default FloatingContact;
