import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Mapping: product model → datasheet PDF file(s) under /datasheets/
 * - string: single file
 * - array: multi-variant (Monitor / X86 / ARM) — shows dropdown
 *
 * Files served from /public/datasheets/ — fully public, no auth required.
 */
const DATASHEETS: Record<string, string | { label: string; file: string }[]> = {
  HD27: [
    { label: "HD27 PCAP Touch Monitor (no PC)", file: "ENTGROUP-HD27-Monitor.pdf" },
    { label: "HD27 Windows / Linux (Intel x86)", file: "ENTGROUP-HD27-X86.pdf" },
    { label: "HD27 Android (Rockchip ARM)", file: "ENTGROUP-HD27-ARM.pdf" },
  ],
  HD43: "ENTGROUP-HD43.pdf",
  HD49: [
    { label: "HD49 PCAP Touch Monitor (no PC)", file: "ENTGROUP-HD49-Monitor.pdf" },
    { label: "HD49 Windows / Linux (Intel x86)", file: "ENTGROUP-HD49-X86.pdf" },
    { label: "HD49 Android (Rockchip ARM)", file: "ENTGROUP-HD49-ARM.pdf" },
  ],
  HR43: "ENTGROUP-HR43.pdf",
  HR49: [
    { label: "HR49 IR Touch Monitor (no PC)", file: "ENTGROUP-HR49-Monitor.pdf" },
    { label: "HR49 Windows / Linux (OPS x86)", file: "ENTGROUP-HR49-X86.pdf" },
    { label: "HR49 Android (Rockchip ARM)", file: "ENTGROUP-HR49-ARM.pdf" },
  ],
  KD43B: "ENTGROUP-KD43B.pdf",
  HD55: [
    { label: "HD55 Touch Monitor (no PC)", file: "ENTGROUP-HD55-Monitor.pdf" },
    { label: "HD55 Windows / Linux (Intel x86)", file: "ENTGROUP-HD55-X86.pdf" },
    { label: "HD55 Android (Rockchip ARM)", file: "ENTGROUP-HD55-ARM.pdf" },
  ],
  HR55: [
    { label: "HR55 IR Touch Monitor (no PC)", file: "ENTGROUP-HR55-Monitor.pdf" },
    { label: "HR55 Windows / Linux (OPS x86)", file: "ENTGROUP-HR55-X86.pdf" },
    { label: "HR55 Android (Rockchip ARM)", file: "ENTGROUP-HR55-ARM.pdf" },
  ],
  HR65: [
    { label: "HR65 IR Touch Monitor (no PC)", file: "ENTGROUP-HR65-Monitor.pdf" },
    { label: "HR65 Windows / Linux (OPS x86)", file: "ENTGROUP-HR65-X86.pdf" },
    { label: "HR65 Android (Rockchip ARM)", file: "ENTGROUP-HR65-ARM.pdf" },
  ],
  HD65: [
    { label: "HD65 PCAP Touch Monitor (no PC)", file: "ENTGROUP-HD65-Monitor.pdf" },
    { label: "HD65 Windows / Linux (Intel x86)", file: "ENTGROUP-HD65-X86.pdf" },
    { label: "HD65 Android (Rockchip ARM)", file: "ENTGROUP-HD65-ARM.pdf" },
  ],
  RZ65B: [
    { label: "RZ65B 4K IR Touch Monitor (no PC)", file: "ENTGROUP-RZ65B-Monitor.pdf" },
    { label: "RZ65B 4K Windows / Linux (OPS x86)", file: "ENTGROUP-RZ65B-X86.pdf" },
    { label: "RZ65B 4K Android (Rockchip ARM)", file: "ENTGROUP-RZ65B-ARM.pdf" },
  ],
  RZ75B: [
    { label: "RZ75B 4K IR Touch Monitor (no PC)", file: "ENTGROUP-RZ75B-Monitor.pdf" },
    { label: "RZ75B 4K Windows / Linux (OPS x86)", file: "ENTGROUP-RZ75B-X86.pdf" },
    { label: "RZ75B 4K Android (Rockchip ARM)", file: "ENTGROUP-RZ75B-ARM.pdf" },
  ],
  RZ85B: [
    { label: "RZ85B 4K IR Touch Monitor (no PC)", file: "ENTGROUP-RZ85B-Monitor.pdf" },
    { label: "RZ85B 4K Windows / Linux (OPS x86)", file: "ENTGROUP-RZ85B-X86.pdf" },
    { label: "RZ85B 4K Android (Rockchip ARM)", file: "ENTGROUP-RZ85B-ARM.pdf" },
  ],
  RZ86B: [
    { label: "RZ86B 4K IR Touch Monitor (no PC)", file: "ENTGROUP-RZ86B-Monitor.pdf" },
    { label: "RZ86B 4K Windows / Linux (OPS x86)", file: "ENTGROUP-RZ86B-X86.pdf" },
    { label: "RZ86B 4K Android (Rockchip ARM)", file: "ENTGROUP-RZ86B-ARM.pdf" },
  ],
  RZ98B: [
    { label: "RZ98B 4K IR Touch Monitor (no PC)", file: "ENTGROUP-RZ98B-Monitor.pdf" },
    { label: "RZ98B 4K Windows / Linux (OPS x86)", file: "ENTGROUP-RZ98B-X86.pdf" },
    { label: "RZ98B 4K Android (Rockchip ARM)", file: "ENTGROUP-RZ98B-ARM.pdf" },
  ],
  GD27C: [
    { label: "GD27C Wall-Mount Kiosk · Android (Rockchip ARM)", file: "ENTGROUP-GD27C-ARM.pdf" },
  ],
  GD238C: [
    { label: "GD238C 23.8\" Wall-Mount Kiosk · Android (Rockchip ARM)", file: "ENTGROUP-GD238C-ARM.pdf" },
  ],
};

interface Props {
  productModel: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  fullWidth?: boolean;
}

export function DatasheetButton({
  productModel,
  variant = "outline",
  size = "sm",
  className,
  fullWidth = true,
}: Props) {
  const entry = DATASHEETS[productModel];
  if (!entry) return null;

  const w = fullWidth ? "w-full" : "";

  // Single file → direct download link
  if (typeof entry === "string") {
    return (
      <Button
        asChild
        variant={variant}
        size={size}
        className={`${w} ${className ?? ""}`}
      >
        <a
          href={`/datasheets/${entry}`}
          download
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`ดาวน์โหลด Datasheet ${productModel} (PDF)`}
        >
          <FileText className="h-4 w-4 mr-1.5" />
          Datasheet (PDF)
        </a>
      </Button>
    );
  }

  // Multi-variant → dropdown
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={`${w} ${className ?? ""}`}
        >
          <FileText className="h-4 w-4 mr-1.5" />
          Datasheet (PDF) ▾
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72 z-50 bg-popover">
        {entry.map((v) => (
          <DropdownMenuItem key={v.file} asChild>
            <a
              href={`/datasheets/${v.file}`}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Download className="h-4 w-4 text-primary" />
              <span className="text-sm">{v.label}</span>
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Helper: check whether a model has a datasheet available (for conditional rendering). */
export function hasDatasheet(productModel: string): boolean {
  return productModel in DATASHEETS;
}
