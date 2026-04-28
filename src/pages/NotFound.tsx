import { useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SEOHead from "@/components/SEOHead";

const NotFound = () => {
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);

    // Redirect legacy traffic from old Wix site (therdpume.wixsite.com/therdpume) to homepage
    const ref = document.referrer || "";
    if (ref.includes("therdpume.wixsite.com")) {
      setShouldRedirect(true);
    }
  }, [location.pathname]);

  if (shouldRedirect) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <SEOHead
        title="ไม่พบหน้าที่ค้นหา (404)"
        description="ขออภัย ไม่พบหน้าที่คุณต้องการ กรุณากลับสู่หน้าแรกของ ENT Group"
        path={location.pathname}
        noindex
      />
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;

