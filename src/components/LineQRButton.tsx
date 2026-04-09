import { useState, ReactNode } from "react";
import LineQRDialog from "./LineQRDialog";

interface LineQRButtonProps {
  children: ReactNode;
  className?: string;
}

const LineQRButton = ({ children, className = "" }: LineQRButtonProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {children}
      >
      </button>
      <LineQRDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default LineQRButton;
