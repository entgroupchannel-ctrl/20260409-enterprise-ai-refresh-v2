import { useState } from "react";
import { AlertTriangle, Phone } from "lucide-react";
import LineQRDialog from "./LineQRDialog";

const PriceDisclaimer = () => {
  const [openLine, setOpenLine] = useState(false);
  return (
    <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
      <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={16} />
      <p className="text-xs text-muted-foreground leading-relaxed">
        <span className="font-semibold text-foreground">ราคาอาจมีการเปลี่ยนแปลงโดยมิต้องแจ้งให้ทราบล่วงหน้า</span>{" "}
        กรุณาสอบถามราคากับแอดมินเพื่อความถูกต้อง{" "}
        <a href="tel:0957391053" className="inline-flex items-center gap-1 text-primary hover:underline font-medium">
          <Phone size={12} /> 095-739-1053
        </a>
        {" · "}
        <button
          type="button"
          onClick={() => setOpenLine(true)}
          className="text-primary hover:underline font-medium"
        >
          Line: @entgroup
        </button>
      </p>
      <LineQRDialog open={openLine} onClose={() => setOpenLine(false)} />
    </div>
  );
};

export default PriceDisclaimer;
