import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { I18nProvider } from "@/contexts/I18nContext";
import { CartProvider } from "@/hooks/useCart";
import Index from "./pages/Index.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import SocialRibbon from "./components/SocialRibbon.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

/* ── Lazy-loaded pages ── */
const GTSeries = lazy(() => import("./pages/GTSeries"));
const GBSeries = lazy(() => import("./pages/GBSeries"));
const EPCBoxSeries = lazy(() => import("./pages/EPCBoxSeries"));
const MiniPC = lazy(() => import("./pages/MiniPC"));
const WaterproofPC = lazy(() => import("./pages/WaterproofPC"));
const Volktek = lazy(() => import("./pages/Volktek"));
const EPCSeries = lazy(() => import("./pages/EPCSeries"));
const RuggedTablet = lazy(() => import("./pages/RuggedTablet"));
const Handheld = lazy(() => import("./pages/Handheld"));
const GKSeries = lazy(() => import("./pages/GKSeries"));
const PanelPCGTG = lazy(() => import("./pages/PanelPCGTG"));
const SmartDisplay = lazy(() => import("./pages/SmartDisplay"));
const Promotions = lazy(() => import("./pages/Promotions"));
const UTCSeries = lazy(() => import("./pages/UTCSeries"));
const MiniPCFirewall = lazy(() => import("./pages/MiniPCFirewall"));
const VCloudPoint = lazy(() => import("./pages/VCloudPoint"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const Warrantys = lazy(() => import("./pages/Warrantys"));
const Payment = lazy(() => import("./pages/Payment"));
const Delivery = lazy(() => import("./pages/Delivery"));
const Cabinets = lazy(() => import("./pages/Cabinets"));
const IBoxSeries = lazy(() => import("./pages/IBoxSeries"));
const IBoxDetail = lazy(() => import("./pages/IBoxDetail"));
const RuggedHandheldDetail = lazy(() => import("./pages/RuggedHandheldDetail"));
const RuggedTabletDetail = lazy(() => import("./pages/RuggedTabletDetail"));
const RuggedNotebook = lazy(() => import("./pages/RuggedNotebook"));
const RuggedNotebookDetail = lazy(() => import("./pages/RuggedNotebookDetail"));
const AllInOnePC = lazy(() => import("./pages/AllInOnePC"));
const AIODetail = lazy(() => import("./pages/AIODetail"));
const CaseStudies = lazy(() => import("./pages/CaseStudies"));
const CaseStudyDetail = lazy(() => import("./pages/CaseStudyDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminQuotesList = lazy(() => import("./pages/admin/AdminQuotesList"));
const AdminQuoteDetail = lazy(() => import("./pages/admin/AdminQuoteDetail"));
const AdminQuoteCreate = lazy(() => import("./pages/admin/AdminQuoteCreate"));
const AdminPermissions = lazy(() => import("./pages/admin/AdminPermissions"));
const AdminSaleOrders = lazy(() => import("./pages/admin/AdminSaleOrders"));
const QuoteRequestForm = lazy(() => import("./pages/customer/QuoteRequestForm"));
const MyQuotes = lazy(() => import("./pages/customer/MyQuotes"));
const MyQuoteDetail = lazy(() => import("./pages/customer/MyQuoteDetail"));
const Cart = lazy(() => import("./pages/customer/Cart"));
const UserProfile = lazy(() => import("./pages/customer/UserProfile"));
const UserDashboard = lazy(() => import("./pages/customer/UserDashboard"));
const CustomerSODetail = lazy(() => import("./pages/customer/CustomerSODetail"));

/* ── Loading fallback ── */
const PageLoader = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-sm text-muted-foreground">กำลังโหลด...</span>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
});

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>

      <ThemeProvider>
        <I18nProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <CartProvider>
              <ScrollToTop />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/gt-series" element={<GTSeries />} />
                  <Route path="/gb-series" element={<GBSeries />} />
                  <Route path="/epc-box-series" element={<EPCBoxSeries />} />
                  <Route path="/gk-series" element={<GKSeries />} />
                  <Route path="/mini-pc" element={<MiniPC />} />
                  <Route path="/waterproof-pc" element={<WaterproofPC />} />
                  <Route path="/volktek" element={<Volktek />} />
                  <Route path="/epc-series" element={<EPCSeries />} />
                  <Route path="/rugged-tablet" element={<RuggedTablet />} />
                  <Route path="/handheld" element={<Handheld />} />
                  <Route path="/panel-pc-gtg" element={<PanelPCGTG />} />
                  <Route path="/smart-display" element={<SmartDisplay />} />
                  <Route path="/promotions" element={<Promotions />} />
                  <Route path="/utc-series" element={<UTCSeries />} />
                  <Route path="/minipc-firewall" element={<MiniPCFirewall />} />
                  <Route path="/mini-pc-firewall" element={<MiniPCFirewall />} />
                  <Route path="/vcloudpoint" element={<VCloudPoint />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route path="/warrantys" element={<Warrantys />} />
                  <Route path="/payment" element={<Payment />} />
                  <Route path="/delivery" element={<Delivery />} />
                  <Route path="/cabinets" element={<Cabinets />} />
                  <Route path="/ibox-series" element={<IBoxSeries />} />
                  <Route path="/ibox-series/:id" element={<IBoxDetail />} />
                  <Route path="/handheld/:id" element={<RuggedHandheldDetail />} />
                  <Route path="/rugged-tablet/:id" element={<RuggedTabletDetail />} />
                  <Route path="/rugged-notebook" element={<RuggedNotebook />} />
                  <Route path="/rugged-notebook/:id" element={<RuggedNotebookDetail />} />
                  <Route path="/aio" element={<AllInOnePC />} />
                  <Route path="/aio/:id" element={<AIODetail />} />
                  <Route path="/case-studies" element={<CaseStudies />} />
                  <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:id" element={<BlogDetail />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/admin/dashboard" element={<ProtectedRoute requireSales><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/quotes" element={<ProtectedRoute requireSales><AdminQuotesList /></ProtectedRoute>} />
                  <Route path="/admin/quotes/new" element={<ProtectedRoute requireSales><AdminQuoteCreate /></ProtectedRoute>} />
                  <Route path="/admin/quotes/:id" element={<ProtectedRoute requireSales><AdminQuoteDetail /></ProtectedRoute>} />
                  <Route path="/admin/contacts" element={<ProtectedRoute requireSales><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/documents" element={<ProtectedRoute requireSales><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/admin/permissions" element={<ProtectedRoute requireAdmin><AdminPermissions /></ProtectedRoute>} />
                  <Route path="/admin/sale-orders" element={<ProtectedRoute requireSales><AdminSaleOrders /></ProtectedRoute>} />
                  <Route path="/admin/sale-orders/:id" element={<ProtectedRoute requireSales><AdminSaleOrders /></ProtectedRoute>} />
                  <Route path="/request-quote" element={<QuoteRequestForm />} />
                  <Route path="/my-quotes" element={<ProtectedRoute><MyQuotes /></ProtectedRoute>} />
                  <Route path="/my-quotes/:id" element={<ProtectedRoute><MyQuoteDetail /></ProtectedRoute>} />
                  <Route path="/cart" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                  <Route path="/my-orders/:id" element={<ProtectedRoute><CustomerSODetail /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <SocialRibbon />
              </CartProvider>
            </BrowserRouter>
          </TooltipProvider>
        </I18nProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

