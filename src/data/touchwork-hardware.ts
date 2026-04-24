// Auto-generated from scripts/touchwork-io-install.json
// Maps TouchWork model → Interface I/O image + Installation gallery images
// Source: touchwoipc.com (scraped via scripts/fetch_touchwork_io_install.py)

import dm080nfIo from "@/assets/touchwork/io/DM080NF.png";
import dm080wgIo from "@/assets/touchwork/io/DM080WG.png";
import dm101gIo from "@/assets/touchwork/io/DM101G.png";
import dm104gIo from "@/assets/touchwork/io/DM104G.png";
import dm121gIo from "@/assets/touchwork/io/DM121G.png";
import dm156gIo from "@/assets/touchwork/io/DM156G.png";
import dm15gIo from "@/assets/touchwork/io/DM15G.png";
import dm17gIo from "@/assets/touchwork/io/DM17G.png";
import dm19gIo from "@/assets/touchwork/io/DM19G.png";
import dm215gIo from "@/assets/touchwork/io/DM215G.png";
import gd101eIo from "@/assets/touchwork/io/GD101E.png";
import gd133Io from "@/assets/touchwork/io/GD133.jpg";
import jd133Io from "@/assets/touchwork/io/JD133.png";
import jd156bIo from "@/assets/touchwork/io/JD156B.png";
import jd185bIo from "@/assets/touchwork/io/JD185B.png";
import jd215bIo from "@/assets/touchwork/io/JD215B.png";

import dm080nfIn1 from "@/assets/touchwork/install/DM080NF-1.png";
import dm080wgIn1 from "@/assets/touchwork/install/DM080WG-1.png";
import dm080wgIn2 from "@/assets/touchwork/install/DM080WG-2.png";
import dm101gIn1 from "@/assets/touchwork/install/DM101G-1.png";
import dm101gIn2 from "@/assets/touchwork/install/DM101G-2.png";
import dm104gIn1 from "@/assets/touchwork/install/DM104G-1.png";
import dm104gIn2 from "@/assets/touchwork/install/DM104G-2.png";
import dm104gIn3 from "@/assets/touchwork/install/DM104G-3.png";
import dm121gIn1 from "@/assets/touchwork/install/DM121G-1.png";
import dm121gIn2 from "@/assets/touchwork/install/DM121G-2.png";
import dm156gIn1 from "@/assets/touchwork/install/DM156G-1.png";
import dm156gIn2 from "@/assets/touchwork/install/DM156G-2.png";
import dm15gIn1 from "@/assets/touchwork/install/DM15G-1.png";
import dm15gIn2 from "@/assets/touchwork/install/DM15G-2.png";
import dm17gIn1 from "@/assets/touchwork/install/DM17G-1.png";
import dm17gIn2 from "@/assets/touchwork/install/DM17G-2.png";
import dm19gIn1 from "@/assets/touchwork/install/DM19G-1.png";
import dm19gIn2 from "@/assets/touchwork/install/DM19G-2.png";
import dm215gIn1 from "@/assets/touchwork/install/DM215G-1.png";
import dm215gIn2 from "@/assets/touchwork/install/DM215G-2.png";
import gd101eIn1 from "@/assets/touchwork/install/GD101E-1.png";
import gd101eIn2 from "@/assets/touchwork/install/GD101E-2.png";
import gd101eIn3 from "@/assets/touchwork/install/GD101E-3.png";
import gd133In1 from "@/assets/touchwork/install/GD133-1.png";
import gd133In2 from "@/assets/touchwork/install/GD133-2.png";
import gd133In3 from "@/assets/touchwork/install/GD133-3.png";
import jd133In1 from "@/assets/touchwork/install/JD133-1.png";
import jd133In2 from "@/assets/touchwork/install/JD133-2.png";
import jd133In3 from "@/assets/touchwork/install/JD133-3.png";
import jd156bIn1 from "@/assets/touchwork/install/JD156B-1.png";
import jd156bIn2 from "@/assets/touchwork/install/JD156B-2.png";
import jd156bIn3 from "@/assets/touchwork/install/JD156B-3.png";
import jd185bIn1 from "@/assets/touchwork/install/JD185B-1.png";
import jd185bIn2 from "@/assets/touchwork/install/JD185B-2.png";
import jd185bIn3 from "@/assets/touchwork/install/JD185B-3.png";
import jd215bIn1 from "@/assets/touchwork/install/JD215B-1.png";
import jd215bIn2 from "@/assets/touchwork/install/JD215B-2.png";
import jd215bIn3 from "@/assets/touchwork/install/JD215B-3.png";

export interface TouchWorkHardwareImages {
  io: string | null;
  install: string[];
}

export const touchworkHardware: Record<string, TouchWorkHardwareImages> = {
  DM080NF: { io: dm080nfIo, install: [dm080nfIn1] },
  DM080WG: { io: dm080wgIo, install: [dm080wgIn1, dm080wgIn2] },
  DM101G:  { io: dm101gIo,  install: [dm101gIn1, dm101gIn2] },
  DM104G:  { io: dm104gIo,  install: [dm104gIn1, dm104gIn2, dm104gIn3] },
  DM121G:  { io: dm121gIo,  install: [dm121gIn1, dm121gIn2] },
  DM156G:  { io: dm156gIo,  install: [dm156gIn1, dm156gIn2] },
  DM15G:   { io: dm15gIo,   install: [dm15gIn1, dm15gIn2] },
  DM17G:   { io: dm17gIo,   install: [dm17gIn1, dm17gIn2] },
  DM19G:   { io: dm19gIo,   install: [dm19gIn1, dm19gIn2] },
  DM215G:  { io: dm215gIo,  install: [dm215gIn1, dm215gIn2] },
  GD101E:  { io: gd101eIo,  install: [gd101eIn1, gd101eIn2, gd101eIn3] },
  GD133:   { io: gd133Io,   install: [gd133In1, gd133In2, gd133In3] },
  JD133:   { io: jd133Io,   install: [jd133In1, jd133In2, jd133In3] },
  JD156B:  { io: jd156bIo,  install: [jd156bIn1, jd156bIn2, jd156bIn3] },
  JD185B:  { io: jd185bIo,  install: [jd185bIn1, jd185bIn2, jd185bIn3] },
  JD215B:  { io: jd215bIo,  install: [jd215bIn1, jd215bIn2, jd215bIn3] },
};

export function getTouchworkHardware(model: string): TouchWorkHardwareImages {
  return touchworkHardware[model.toUpperCase()] ?? { io: null, install: [] };
}
