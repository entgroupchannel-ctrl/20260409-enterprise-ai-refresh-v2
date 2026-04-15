import { Link } from "react-router-dom";

const MiniFooter = () => (
  <footer className="border-t border-border py-3 text-center text-xs text-muted-foreground">
    © {new Date().getFullYear()} ENT Group Co., Ltd. All rights reserved.
    <span className="mx-2">·</span>
    <Link to="/" className="hover:text-primary transition-colors">หน้าหลัก</Link>
    <span className="mx-1">·</span>
    <Link to="/about-us" className="hover:text-primary transition-colors">เกี่ยวกับเรา</Link>
  </footer>
);

export default MiniFooter;
