import { Navigate, useLocation, useParams } from "react-router-dom";

/**
 * Backward-compat redirect for legacy /my-account/<section>/<rest>
 * URLs that appear in older notification emails / external links.
 *
 * Maps `/my-account/<section>/...` → `/my-<section>/...`
 * (e.g. /my-account/tax-invoices/123 → /my-tax-invoices/123).
 *
 * Section name is preserved as-is so any current or future customer
 * portal section under /my-<section> works without hardcoding a list.
 * Falls back to /dashboard if no section is given.
 */
export default function MyAccountRedirect() {
  const { section } = useParams<{ section?: string }>();
  const location = useLocation();

  if (!section) {
    return <Navigate to="/dashboard" replace />;
  }

  // Capture anything after "/my-account/<section>" as the trailing path.
  const prefix = `/my-account/${section}`;
  const rest = location.pathname.startsWith(prefix)
    ? location.pathname.slice(prefix.length)
    : "";

  const target = `/my-${section}${rest}${location.search}${location.hash}`;
  return <Navigate to={target} replace />;
}
