import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { I18nProvider } from "@/contexts/I18nContext";
import { CartProvider } from "@/hooks/useCart";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { lazyRetry } from "@/lib/route-loader";
import Index from "./pages/Index.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import PrintInterceptor from "./components/PrintInterceptor.tsx";
import SocialRibbon from "./components/SocialRibbon.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import GeneralChatWidget from "./components/chat/GeneralChatWidget.tsx";

/* ── Lazy-loaded pages (with auto-retry on chunk errors) ── */
const GTSeries = lazyRetry(() => import("./pages/GTSeries"));
const GBSeries = lazyRetry(() => import("./pages/GBSeries"));
const EPCBoxSeries = lazyRetry(() => import("./pages/EPCBoxSeries"));
const MiniPC = lazyRetry(() => import("./pages/MiniPC"));
const WaterproofPC = lazyRetry(() => import("./pages/WaterproofPC"));
const Volktek = lazyRetry(() => import("./pages/Volktek"));
const EPCSeries = lazyRetry(() => import("./pages/EPCSeries"));
const UPCSeries = lazyRetry(() => import("./pages/UPCSeries"));
const RuggedTablet = lazyRetry(() => import("./pages/RuggedTablet"));
const Handheld = lazyRetry(() => import("./pages/Handheld"));
const GKSeries = lazyRetry(() => import("./pages/GKSeries"));
const PanelPCGTG = lazyRetry(() => import("./pages/PanelPCGTG"));
const SmartDisplay = lazyRetry(() => import("./pages/SmartDisplay"));
const InteractiveDisplay = lazyRetry(() => import("./pages/InteractiveDisplay"));
const Accessories = lazyRetry(() => import("./pages/Accessories"));
const Display32Detail = lazyRetry(() => import("./pages/Display32Detail"));
const FPMSeries = lazyRetry(() => import("./pages/FPMSeries"));
const FPMSeriesDetail = lazyRetry(() => import("./pages/FPMSeriesDetail"));
const TouchWork = lazyRetry(() => import("./pages/TouchWork"));
const TouchWorkDetail = lazyRetry(() => import("./pages/TouchWorkDetail"));
const Promotions = lazyRetry(() => import("./pages/Promotions"));
const UTCSeries = lazyRetry(() => import("./pages/UTCSeries"));
const MiniPCFirewall = lazyRetry(() => import("./pages/MiniPCFirewall"));
const VCloudPoint = lazyRetry(() => import("./pages/VCloudPoint"));
const AboutUs = lazyRetry(() => import("./pages/AboutUs"));
const ContactUs = lazyRetry(() => import("./pages/ContactUs"));
const Warrantys = lazyRetry(() => import("./pages/Warrantys"));
const Payment = lazyRetry(() => import("./pages/Payment"));
const Delivery = lazyRetry(() => import("./pages/Delivery"));
const Cabinets = lazyRetry(() => import("./pages/Cabinets"));
const IBoxSeries = lazyRetry(() => import("./pages/IBoxSeries"));
const IBoxDetail = lazyRetry(() => import("./pages/IBoxDetail"));
const RuggedHandheldDetail = lazyRetry(() => import("./pages/RuggedHandheldDetail"));
const RuggedTabletDetail = lazyRetry(() => import("./pages/RuggedTabletDetail"));
const RuggedNotebook = lazyRetry(() => import("./pages/RuggedNotebook"));
const RuggedNotebookDetail = lazyRetry(() => import("./pages/RuggedNotebookDetail"));
const AllInOnePC = lazyRetry(() => import("./pages/AllInOnePC"));
const AIODetail = lazyRetry(() => import("./pages/AIODetail"));
const CaseStudies = lazyRetry(() => import("./pages/CaseStudies"));
const CaseStudyDetail = lazyRetry(() => import("./pages/CaseStudyDetail"));
const Blog = lazyRetry(() => import("./pages/Blog"));
const BlogDetail = lazyRetry(() => import("./pages/BlogDetail"));
const NotFound = lazyRetry(() => import("./pages/NotFound"));
const ShopStorefront = lazyRetry(() => import("./pages/shop/ShopStorefront"));
const ShopProductDetail = lazyRetry(() => import("./pages/shop/ShopProductDetail"));
const ShopCompare = lazyRetry(() => import("./pages/shop/ShopCompare"));
const ShopDisplays156 = lazyRetry(() => import("./pages/shop/ShopDisplays156"));
const ShopDisplays215 = lazyRetry(() => import("./pages/shop/ShopDisplays215"));
const ShopDisplays32 = lazyRetry(() => import("./pages/shop/ShopDisplays32"));
const ShopDisplays43 = lazyRetry(() => import("./pages/shop/ShopDisplays43"));
const ShopDisplaysGD215C = lazyRetry(() => import("./pages/shop/ShopDisplaysGD215C"));
const ShopDisplaysGD238C3 = lazyRetry(() => import("./pages/shop/ShopDisplaysGD238C3"));
const ShopDisplaysGD32C = lazyRetry(() => import("./pages/shop/ShopDisplaysGD32C"));
const ShopDisplaysGD27C = lazyRetry(() => import("./pages/shop/ShopDisplaysGD27C"));
const ShopTouchworkDM080NF = lazyRetry(() => import("./pages/shop/ShopTouchworkDM080NF"));
const ShopTouchworkDM080WG = lazyRetry(() => import("./pages/shop/ShopTouchworkDM080WG"));
const ShopTouchworkDM101G = lazyRetry(() => import("./pages/shop/ShopTouchworkDM101G"));
const ShopTouchworkDM104G = lazyRetry(() => import("./pages/shop/ShopTouchworkDM104G"));
const ShopTouchworkDM121G = lazyRetry(() => import("./pages/shop/ShopTouchworkDM121G"));
const Unsubscribe = lazyRetry(() => import("./pages/Unsubscribe"));
const Login = lazyRetry(() => import("./pages/auth/Login"));
const Register = lazyRetry(() => import("./pages/auth/Register"));
const AcceptInvite = lazyRetry(() => import("./pages/auth/AcceptInvite"));
const AdminDashboard = lazyRetry(() => import("./pages/admin/AdminDashboard"));
const AdminQuotesList = lazyRetry(() => import("./pages/admin/AdminQuotesList"));
const AdminQuoteDetail = lazyRetry(() => import("./pages/admin/AdminQuoteDetail"));
const AdminQuoteCreate = lazyRetry(() => import("./pages/admin/AdminQuoteCreate"));
const AdminPermissions = lazyRetry(() => import("./pages/admin/AdminPermissions"));
const AdminEmployees = lazyRetry(() => import("./pages/admin/AdminEmployees"));
const AdminCustomersList = lazyRetry(() => import("./pages/admin/AdminCustomersList"));
const AdminCustomerDetail = lazyRetry(() => import("./pages/admin/AdminCustomerDetail"));
const AdminEmployeeDetail = lazyRetry(() => import("./pages/admin/AdminEmployeeDetail"));
const AdminEmployeeNew = lazyRetry(() => import("./pages/admin/AdminEmployeeNew"));
const AdminRoles = lazyRetry(() => import("./pages/admin/AdminRoles"));
const AdminAuditLog = lazyRetry(() => import("./pages/admin/AdminAuditLog"));
const AdminSaleOrders = lazyRetry(() => import("./pages/admin/AdminSaleOrders"));
const AdminRequests = lazyRetry(() => import("./pages/admin/AdminRequests"));
const AdminApprovals = lazyRetry(() => import("./pages/admin/AdminApprovals"));
const ProductsList = lazyRetry(() => import("./pages/admin/ProductsList"));
const AdminQuotesTrash = lazyRetry(() => import("./pages/admin/AdminQuotesTrash"));
const AdminTrash = lazyRetry(() => import("./pages/admin/AdminTrash"));
const AdminDocuments = lazyRetry(() => import("./pages/admin/AdminDocuments"));
const MyDocuments = lazyRetry(() => import("./pages/customer/MyDocuments"));
const AdminInvoicesList = lazyRetry(() => import("./pages/admin/AdminInvoicesList"));
const AdminInvoiceDetail = lazyRetry(() => import("./pages/admin/AdminInvoiceDetail"));
const AdminTaxInvoicesList = lazyRetry(() => import("./pages/admin/AdminTaxInvoicesList"));
const AdminTaxInvoiceDetail = lazyRetry(() => import("./pages/admin/AdminTaxInvoiceDetail"));
const AdminCreditNotesList = lazyRetry(() => import("./pages/admin/AdminCreditNotesList"));
const AdminCreditNoteDetail = lazyRetry(() => import("./pages/admin/AdminCreditNoteDetail"));
const AdminReceiptsList = lazyRetry(() => import("./pages/admin/AdminReceiptsList"));
const AdminReceiptDetail = lazyRetry(() => import("./pages/admin/AdminReceiptDetail"));
const AdminContacts = lazyRetry(() => import("./pages/admin/AdminContacts"));
const AdminCompanySettings = lazyRetry(() => import("./pages/admin/AdminCompanySettings"));
const AdminProfile = lazyRetry(() => import("./pages/admin/AdminProfile"));
const ProductDetail = lazyRetry(() => import("./pages/ProductDetail"));
const QuoteRequestForm = lazyRetry(() => import("./pages/customer/QuoteRequestForm"));
const MyQuotes = lazyRetry(() => import("./pages/customer/MyQuotes"));
const MyQuoteDetail = lazyRetry(() => import("./pages/customer/MyQuoteDetail"));
const MyInvoices = lazyRetry(() => import("./pages/customer/MyInvoices"));
const MyInvoiceDetail = lazyRetry(() => import("./pages/customer/MyInvoiceDetail"));
const MyTaxInvoices = lazyRetry(() => import("./pages/customer/MyTaxInvoices"));
const MyTaxInvoiceDetail = lazyRetry(() => import("./pages/customer/MyTaxInvoiceDetail"));
const MyReceipts = lazyRetry(() => import("./pages/customer/MyReceipts"));
const MyReceiptDetail = lazyRetry(() => import("./pages/customer/MyReceiptDetail"));
const Cart = lazyRetry(() => import("./pages/customer/Cart"));
const UserProfile = lazyRetry(() => import("./pages/customer/UserProfile"));
const UserDashboard = lazyRetry(() => import("./pages/customer/UserDashboard"));
const CustomerSODetail = lazyRetry(() => import("./pages/customer/CustomerSODetail"));
const CustomerOrders = lazyRetry(() => import("./pages/customer/CustomerOrders"));
const NotificationsPage = lazyRetry(() => import("./pages/notifications/NotificationsPage"));
const AdminRegisteredProductsList = lazyRetry(() => import("./pages/admin/AdminRegisteredProductsList"));
const AdminRegisteredProductDetail = lazyRetry(() => import("./pages/admin/AdminRegisteredProductDetail"));
const MyProducts = lazyRetry(() => import("./pages/customer/MyProducts"));
const MyProductDetail = lazyRetry(() => import("./pages/customer/MyProductDetail"));
const RegisterProductForm = lazyRetry(() => import("./pages/customer/RegisterProductForm"));
const AdminRepairOrdersList = lazyRetry(() => import("./pages/admin/AdminRepairOrdersList"));
const AdminRepairOrderDetail = lazyRetry(() => import("./pages/admin/AdminRepairOrderDetail"));
const MyRepairs = lazyRetry(() => import("./pages/customer/MyRepairs"));
const MyRepairDetail = lazyRetry(() => import("./pages/customer/MyRepairDetail"));
const RequestRepairForm = lazyRetry(() => import("./pages/customer/RequestRepairForm"));
const AdminInventory = lazyRetry(() => import("./pages/admin/AdminInventory"));
const AdminSupplierManagement = lazyRetry(() => import("./pages/admin/AdminSupplierManagement"));
const AdminSupplierDetail = lazyRetry(() => import("./pages/admin/AdminSupplierDetail"));
const AdminInternationalTransfer = lazyRetry(() => import("./pages/admin/AdminInternationalTransfer"));
const AdminLiveChat = lazyRetry(() => import("./pages/admin/AdminLiveChat"));
const AdminGeneralChat = lazyRetry(() => import("./pages/admin/AdminGeneralChat"));
const AdminReports = lazyRetry(() => import("./pages/admin/AdminReports"));
const AdminSubscribers = lazyRetry(() => import("./pages/admin/AdminSubscribers"));
const AdminEmailTemplates = lazyRetry(() => import("./pages/admin/AdminEmailTemplates"));
const Investors = lazyRetry(() => import("./pages/Investors"));
const InvestorStrategicVision = lazyRetry(() => import("./pages/InvestorStrategicVision"));
const InvestorBrief = lazyRetry(() => import("./pages/InvestorBrief"));
const Affiliate = lazyRetry(() => import("./pages/Affiliate"));
const AffiliateApply = lazyRetry(() => import("./pages/AffiliateApply"));
const AffiliateDashboard = lazyRetry(() => import("./pages/AffiliateDashboard"));
const AffiliateRedirect = lazyRetry(() => import("./pages/AffiliateRedirect"));
const Partner = lazyRetry(() => import("./pages/Partner"));
const PartnerApply = lazyRetry(() => import("./pages/PartnerApply"));
const PartnerPortal = lazyRetry(() => import("./pages/PartnerPortal"));
const Platform = lazyRetry(() => import("./pages/Platform"));
const JetsonEdgeAI = lazyRetry(() => import("./pages/JetsonEdgeAI"));
const JetsonSolutions = lazyRetry(() => import("./pages/JetsonSolutions"));
const JetsonAIReady = lazyRetry(() => import("./pages/JetsonAIReady"));
const JetsonRecommend = lazyRetry(() => import("./pages/JetsonRecommend"));
const JetsonProducts = lazyRetry(() => import("./pages/JetsonProducts"));
const JetsonCaseStudies = lazyRetry(() => import("./pages/JetsonCaseStudies"));
const JetsonGPUServer = lazyRetry(() => import("./pages/JetsonGPUServer"));
const JetsonProfessionalGPU = lazyRetry(() => import("./pages/JetsonProfessionalGPU"));
const ForgotPassword = lazyRetry(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazyRetry(() => import("./pages/auth/ResetPassword"));
const NotificationPreferences = lazyRetry(() => import("./pages/customer/NotificationPreferences"));
const CampaignLanding = lazyRetry(() => import("./pages/CampaignLanding"));
const SharedQuotePage = lazyRetry(() => import("./pages/SharedQuotePage"));
const SharedInvoicePage = lazyRetry(() => import("./pages/SharedInvoicePage"));
const SharedReceiptPage = lazyRetry(() => import("./pages/SharedReceiptPage"));
const SharedTaxInvoicePage = lazyRetry(() => import("./pages/SharedTaxInvoicePage"));
const AdminInvestors = lazyRetry(() => import("./pages/admin/AdminInvestors"));
const AdminAffiliatesList = lazyRetry(() => import("./pages/admin/AdminAffiliatesList"));
const AdminAffiliateDetail = lazyRetry(() => import("./pages/admin/AdminAffiliateDetail"));
const AdminAffiliateHub = lazyRetry(() => import("./pages/admin/AdminAffiliateHub"));
const AdminAffiliateLeads = lazyRetry(() => import("./pages/admin/AdminAffiliateLeads"));
const AdminAffiliatePayouts = lazyRetry(() => import("./pages/admin/AdminAffiliatePayouts"));
const AdminPartnerApplications = lazyRetry(() => import("./pages/admin/AdminPartnerApplications"));
const AdminPartnerApplicationDetail = lazyRetry(() => import("./pages/admin/AdminPartnerApplicationDetail"));
const AdminEmailLog = lazyRetry(() => import("./pages/admin/AdminEmailLog"));
const AdminNotificationCoverage = lazyRetry(() => import("./pages/admin/AdminNotificationCoverage"));
const AdminSupplierTemplates = lazyRetry(() => import("./pages/admin/AdminSupplierTemplates"));

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
  <ErrorBoundary>
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
                <PrintInterceptor />
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/gt-series" element={<GTSeries />} />
                    <Route path="/products/:slug" element={<ProductDetail />} />
                    <Route path="/gb-series" element={<GBSeries />} />
                    <Route path="/epc-box-series" element={<EPCBoxSeries />} />
                    <Route path="/gk-series" element={<GKSeries />} />
                    <Route path="/mini-pc" element={<MiniPC />} />
                    <Route path="/waterproof-pc" element={<WaterproofPC />} />
                    <Route path="/volktek" element={<Volktek />} />
                    <Route path="/epc-series" element={<EPCSeries />} />
                    <Route path="/upc-series" element={<UPCSeries />} />
                    <Route path="/rugged-tablet" element={<RuggedTablet />} />
                    <Route path="/handheld" element={<Handheld />} />
                    <Route path="/panel-pc-gtg" element={<PanelPCGTG />} />
                    <Route path="/smart-display" element={<SmartDisplay />} />
                    <Route path="/interactive-display" element={<InteractiveDisplay />} />
                    <Route path="/accessories" element={<Accessories />} />
                    <Route path="/products/displays-32" element={<Display32Detail groupSize={32} />} />
                    <Route path="/products/displays-32/:model" element={<Display32Detail groupSize={32} />} />
                    <Route path="/products/displays-43" element={<Display32Detail groupSize={43} />} />
                    <Route path="/products/displays-43/:model" element={<Display32Detail groupSize={43} />} />
                    <Route path="/products/displays-23.8" element={<Display32Detail groupSize={238} />} />
                    <Route path="/products/displays-23.8/:model" element={<Display32Detail groupSize={238} />} />
                    <Route path="/products/interactive-display-gd238c" element={<Navigate to="/products/displays-23.8?model=gd238c" replace />} />
                    <Route path="/products/interactive-display-gd238c3" element={<Navigate to="/products/displays-23.8?model=gd238c3" replace />} />
                    <Route path="/products/displays-15.6" element={<Display32Detail groupSize={156} />} />
                    <Route path="/products/displays-15.6/:model" element={<Display32Detail groupSize={156} />} />
                    <Route path="/products/interactive-display-kd156b" element={<Navigate to="/products/displays-15.6?model=kd156b" replace />} />
                    <Route path="/products/displays-21.5" element={<Display32Detail groupSize={215} />} />
                    <Route path="/products/displays-21.5/:model" element={<Display32Detail groupSize={215} />} />
                    <Route path="/products/interactive-display-kd215b" element={<Navigate to="/products/displays-21.5?model=kd215b" replace />} />
                    <Route path="/products/interactive-kiosk-kd215b" element={<Navigate to="/products/displays-21.5?model=kd215b" replace />} />
                    <Route path="/products/interactive-display-gd215c" element={<Navigate to="/products/displays-21.5?model=gd215c" replace />} />
                    <Route path="/products/interactive-kiosk-gd215c" element={<Navigate to="/products/displays-21.5?model=gd215c" replace />} />
                    <Route path="/products/displays-27" element={<Display32Detail groupSize={27} />} />
                    <Route path="/products/displays-27/:model" element={<Display32Detail groupSize={27} />} />
                    <Route path="/products/interactive-display-hd27" element={<Navigate to="/products/displays-27?model=hd27" replace />} />
                    <Route path="/products/interactive-display-gd27c" element={<Navigate to="/products/displays-27?model=gd27c" replace />} />
                    <Route path="/products/interactive-display-hd32" element={<Navigate to="/products/displays-32?model=hd32" replace />} />
                    <Route path="/products/interactive-display-hr32" element={<Navigate to="/products/displays-32?model=hr32" replace />} />
                    <Route path="/products/interactive-display-hr32-android" element={<Navigate to="/products/displays-32?model=hr32-android" replace />} />
                    <Route path="/products/interactive-display-gd32c" element={<Navigate to="/products/displays-32?model=gd32c" replace />} />
                    <Route path="/products/interactive-display-kd32b" element={<Navigate to="/products/displays-32?model=kd32b" replace />} />
                    <Route path="/products/interactive-display-hd43" element={<Navigate to="/products/displays-43?model=hd43" replace />} />
                    <Route path="/products/interactive-display-hr43" element={<Navigate to="/products/displays-43?model=hr43" replace />} />
                    <Route path="/products/displays-49" element={<Display32Detail groupSize={49} />} />
                    <Route path="/products/displays-49/:model" element={<Display32Detail groupSize={49} />} />
                   <Route path="/products/interactive-display-hr49" element={<Navigate to="/products/displays-49?model=hr49" replace />} />
                   <Route path="/products/interactive-display-hd49" element={<Navigate to="/products/displays-49?model=hd49" replace />} />
                    <Route path="/products/displays-55" element={<Display32Detail groupSize={55} />} />
                    <Route path="/products/displays-55/:model" element={<Display32Detail groupSize={55} />} />
                    <Route path="/products/interactive-display-hd55" element={<Navigate to="/products/displays-55?model=hd55" replace />} />
                    <Route path="/products/displays-65" element={<Display32Detail groupSize={65} />} />
                    <Route path="/products/displays-65/:model" element={<Display32Detail groupSize={65} />} />
                    <Route path="/products/interactive-display-hr65" element={<Navigate to="/products/displays-65?model=hr65" replace />} />
                    <Route path="/products/displays-75" element={<Display32Detail groupSize={75} />} />
                    <Route path="/products/displays-75/:model" element={<Display32Detail groupSize={75} />} />
                    <Route path="/products/interactive-kiosk-rz75b" element={<Navigate to="/products/displays-75?model=rz75b" replace />} />
                    <Route path="/products/displays-85" element={<Display32Detail groupSize={85} />} />
                    <Route path="/products/displays-85/:model" element={<Display32Detail groupSize={85} />} />
                    <Route path="/products/interactive-kiosk-rz85b" element={<Navigate to="/products/displays-85?model=rz85b" replace />} />
                    <Route path="/products/displays-86" element={<Display32Detail groupSize={86} />} />
                    <Route path="/products/displays-86/:model" element={<Display32Detail groupSize={86} />} />
                    <Route path="/products/interactive-kiosk-rz86b" element={<Navigate to="/products/displays-86?model=rz86b" replace />} />
                    <Route path="/products/displays-98" element={<Display32Detail groupSize={98} />} />
                    <Route path="/products/displays-98/:model" element={<Display32Detail groupSize={98} />} />
                    <Route path="/products/interactive-kiosk-rz98b" element={<Navigate to="/products/displays-98?model=rz98b" replace />} />
                    <Route path="/fpm-series" element={<FPMSeries />} />
                    <Route path="/fpm-series/:model" element={<FPMSeriesDetail />} />
                    <Route path="/touchwork" element={<TouchWork />} />
                    <Route path="/touchwork/:model" element={<TouchWorkDetail />} />
                    <Route path="/promotions" element={<Promotions />} />
                    <Route path="/utc-series" element={<UTCSeries />} />
                    <Route path="/minipc-firewall" element={<Navigate to="/mini-pc-firewall" replace />} />
                    <Route path="/mini-pc-firewall" element={<MiniPCFirewall />} />
                    <Route path="/vcloudpoint" element={<VCloudPoint />} />
                    <Route path="/about-us" element={<AboutUs />} />
                    <Route path="/about-ent-group" element={<Navigate to="/about-us" replace />} />
                    <Route path="/about" element={<Navigate to="/about-us" replace />} />
                    <Route path="/site-references" element={<Navigate to="/case-studies" replace />} />
                    <Route path="/pricelist" element={<Navigate to="/shop" replace />} />
                    <Route path="/price-list" element={<Navigate to="/shop" replace />} />
                    <Route path="/investors" element={<Investors />} />
                    <Route path="/investors/strategic-vision" element={<InvestorStrategicVision />} />
                    <Route path="/investors/brief/:token" element={<InvestorBrief />} />
                    <Route path="/affiliate" element={<Affiliate />} />
                    <Route path="/affiliate/apply" element={<AffiliateApply />} />
                    <Route path="/affiliate/dashboard" element={<ProtectedRoute><AffiliateDashboard /></ProtectedRoute>} />
                    <Route path="/r/:code" element={<AffiliateRedirect />} />
                    <Route path="/partner" element={<Partner />} />
                    <Route path="/partner/apply" element={<PartnerApply />} />
                    <Route path="/partner/portal" element={<ProtectedRoute><PartnerPortal /></ProtectedRoute>} />
                    <Route path="/platform" element={<Platform />} />
                    {/* NVIDIA Jetson / GPU pages */}
                    <Route path="/nvidia-jetson" element={<JetsonEdgeAI />} />
                    <Route path="/nvidia-jetson/solutions" element={<JetsonSolutions />} />
                    <Route path="/nvidia-jetson/ai-ready" element={<JetsonAIReady />} />
                    <Route path="/nvidia-jetson/recommend" element={<JetsonRecommend />} />
                    <Route path="/nvidia-jetson/products" element={<JetsonProducts />} />
                    <Route path="/nvidia-jetson/case-studies" element={<JetsonCaseStudies />} />
                    <Route path="/gpu-server" element={<JetsonGPUServer />} />
                    <Route path="/professional-gpu" element={<JetsonProfessionalGPU />} />
                    <Route path="/product-advisor" element={<JetsonRecommend />} />
                    {/* Auth extras */}
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    {/* Customer extras */}
                    <Route path="/notification-preferences" element={<ProtectedRoute><NotificationPreferences /></ProtectedRoute>} />
                    {/* Campaigns & shared public docs */}
                    <Route path="/c/:slug" element={<CampaignLanding />} />
                    <Route path="/share/quote/:token" element={<SharedQuotePage />} />
                    <Route path="/share/invoice/:token" element={<SharedInvoicePage />} />
                    <Route path="/share/receipt/:token" element={<SharedReceiptPage />} />
                    <Route path="/share/tax-invoice/:token" element={<SharedTaxInvoicePage />} />
                    {/* Admin extras */}
                    <Route path="/admin/investors" element={<ProtectedRoute requireSuperAdmin><AdminInvestors /></ProtectedRoute>} />
                    <Route path="/admin/affiliates" element={<ProtectedRoute requireAdmin><AdminAffiliatesList /></ProtectedRoute>} />
                    <Route path="/admin/affiliates/:id" element={<ProtectedRoute requireAdmin><AdminAffiliateDetail /></ProtectedRoute>} />
                    <Route path="/admin/affiliate" element={<ProtectedRoute requireAdmin><AdminAffiliateHub /></ProtectedRoute>} />
                    <Route path="/admin/affiliate-leads" element={<ProtectedRoute requireAdmin><AdminAffiliateLeads /></ProtectedRoute>} />
                    <Route path="/admin/affiliate-payouts" element={<ProtectedRoute requireAdmin><AdminAffiliatePayouts /></ProtectedRoute>} />
                    <Route path="/admin/partners" element={<ProtectedRoute requireAdmin><AdminPartnerApplications /></ProtectedRoute>} />
                    <Route path="/admin/partners/:id" element={<ProtectedRoute requireAdmin><AdminPartnerApplicationDetail /></ProtectedRoute>} />
                    <Route path="/admin/email-log" element={<ProtectedRoute requireSuperAdmin><AdminEmailLog /></ProtectedRoute>} />
                    <Route path="/admin/notification-coverage" element={<ProtectedRoute requireSuperAdmin><AdminNotificationCoverage /></ProtectedRoute>} />
                    <Route path="/admin/supplier-templates" element={<ProtectedRoute allowedRoles={['super_admin','admin','accountant']}><AdminSupplierTemplates /></ProtectedRoute>} />
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
                    <Route path="/shop" element={<ShopStorefront />} />
                    <Route path="/shop/compare" element={<ShopCompare />} />
                    <Route path="/shop/displays-15.6" element={<ShopDisplays156 />} />
                    <Route path="/shop/displays-21.5" element={<ShopDisplays215 />} />
                    <Route path="/shop/displays-32" element={<ShopDisplays32 />} />
                    <Route path="/shop/displays-43" element={<ShopDisplays43 />} />
                    <Route path="/shop/gd215c" element={<ShopDisplaysGD215C />} />
                    <Route path="/shop/gd238c3" element={<ShopDisplaysGD238C3 />} />
                    <Route path="/shop/gd32c" element={<ShopDisplaysGD32C />} />
                    <Route path="/shop/gd27c" element={<ShopDisplaysGD27C />} />
                    <Route path="/shop/dm080nf" element={<ShopTouchworkDM080NF />} />
                    <Route path="/shop/dm080wg" element={<ShopTouchworkDM080WG />} />
                    <Route path="/shop/dm101g" element={<ShopTouchworkDM101G />} />
                    <Route path="/shop/dm104g" element={<ShopTouchworkDM104G />} />
                    <Route path="/shop/:slug" element={<ShopProductDetail />} />
                    <Route path="/unsubscribe" element={<Unsubscribe />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/invite/:token" element={<AcceptInvite />} />
                    <Route path="/admin/dashboard" element={<ProtectedRoute requireSales><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/admin/inventory" element={<ProtectedRoute requireSales><AdminInventory /></ProtectedRoute>} />
                    <Route path="/admin/quotes" element={<ProtectedRoute requireSales><AdminQuotesList /></ProtectedRoute>} />
                    <Route path="/admin/quotes/new" element={<ProtectedRoute requireSales><AdminQuoteCreate /></ProtectedRoute>} />
                    <Route path="/admin/quotes/trash" element={<ProtectedRoute requireSales><AdminTrash /></ProtectedRoute>} />
                    <Route path="/admin/trash" element={<ProtectedRoute requireSales><AdminTrash /></ProtectedRoute>} />
                    <Route path="/admin/quotes/:id" element={<ProtectedRoute requireSales><AdminQuoteDetail /></ProtectedRoute>} />
                    <Route path="/admin/contacts" element={<ProtectedRoute requireSales><AdminContacts /></ProtectedRoute>} />
                    <Route path="/admin/documents" element={<ProtectedRoute allowedRoles={['super_admin','admin','sales','accountant','warehouse','viewer']}><AdminDocuments /></ProtectedRoute>} />
                    <Route path="/admin/permissions" element={<ProtectedRoute requireAdmin><AdminPermissions /></ProtectedRoute>} />
                    <Route path="/admin/employees" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminEmployees /></ProtectedRoute>} />
                    <Route path="/admin/employees/new" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminEmployeeNew /></ProtectedRoute>} />
                    <Route path="/admin/employees/roles" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminRoles /></ProtectedRoute>} />
                    <Route path="/admin/employees/:id" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminEmployeeDetail /></ProtectedRoute>} />
                    <Route path="/admin/customers" element={<ProtectedRoute requireSales><AdminCustomersList /></ProtectedRoute>} />
                    <Route path="/admin/customers/:id" element={<ProtectedRoute requireSales><AdminCustomerDetail /></ProtectedRoute>} />
                    <Route path="/admin/audit-log" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminAuditLog /></ProtectedRoute>} />
                    <Route path="/admin/sale-orders" element={<ProtectedRoute requireSales><AdminSaleOrders /></ProtectedRoute>} />
                    <Route path="/admin/sale-orders/:id" element={<ProtectedRoute requireSales><AdminSaleOrders /></ProtectedRoute>} />
                    <Route path="/admin/invoices" element={<ProtectedRoute requireSales><AdminInvoicesList /></ProtectedRoute>} />
                    <Route path="/admin/invoices/:id" element={<ProtectedRoute requireSales><AdminInvoiceDetail /></ProtectedRoute>} />
                    <Route path="/admin/tax-invoices" element={<ProtectedRoute allowedRoles={['super_admin','admin','accountant','viewer']}><AdminTaxInvoicesList /></ProtectedRoute>} />
                    <Route path="/admin/tax-invoices/:id" element={<ProtectedRoute allowedRoles={['super_admin','admin','accountant','viewer']}><AdminTaxInvoiceDetail /></ProtectedRoute>} />
                    <Route path="/admin/credit-notes" element={<ProtectedRoute allowedRoles={['super_admin','admin','accountant','viewer']}><AdminCreditNotesList /></ProtectedRoute>} />
                    <Route path="/admin/credit-notes/:id" element={<ProtectedRoute allowedRoles={['super_admin','admin','accountant','viewer']}><AdminCreditNoteDetail /></ProtectedRoute>} />
                    <Route path="/admin/receipts" element={<ProtectedRoute allowedRoles={['super_admin','admin','accountant','viewer']}><AdminReceiptsList /></ProtectedRoute>} />
                    <Route path="/admin/receipts/:id" element={<ProtectedRoute allowedRoles={['super_admin','admin','accountant','viewer']}><AdminReceiptDetail /></ProtectedRoute>} />
                    <Route path="/admin/registered-products" element={<ProtectedRoute requireSales><AdminRegisteredProductsList /></ProtectedRoute>} />
                    <Route path="/admin/registered-products/:id" element={<ProtectedRoute requireSales><AdminRegisteredProductDetail /></ProtectedRoute>} />
                    <Route path="/admin/repairs" element={<ProtectedRoute requireSales><AdminRepairOrdersList /></ProtectedRoute>} />
                    <Route path="/admin/repairs/:id" element={<ProtectedRoute requireSales><AdminRepairOrderDetail /></ProtectedRoute>} />
                    <Route path="/admin/requests" element={<ProtectedRoute requireAdmin><AdminRequests /></ProtectedRoute>} />
                    <Route path="/admin/approvals" element={<ProtectedRoute requireSuperAdmin><AdminApprovals /></ProtectedRoute>} />
                    <Route path="/admin/products" element={<ProtectedRoute requireSales><ProductsList /></ProtectedRoute>} />
                    <Route path="/admin/settings/company" element={<ProtectedRoute requireSales><AdminCompanySettings /></ProtectedRoute>} />
                    <Route path="/admin/suppliers" element={<ProtectedRoute allowedRoles={['super_admin','admin','accountant']}><AdminSupplierManagement /></ProtectedRoute>} />
                    <Route path="/admin/suppliers/:id" element={<ProtectedRoute allowedRoles={['super_admin','admin','accountant']}><AdminSupplierDetail /></ProtectedRoute>} />
                    <Route path="/admin/international-transfer" element={<ProtectedRoute allowedRoles={['super_admin','admin','accountant']}><AdminInternationalTransfer /></ProtectedRoute>} />
                    <Route path="/admin/live-chat" element={<ProtectedRoute requireSales><AdminLiveChat /></ProtectedRoute>} />
                    <Route path="/admin/general-chat" element={<ProtectedRoute requireSales><AdminGeneralChat /></ProtectedRoute>} />
                    <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['super_admin','admin','sales','accountant']}><AdminReports /></ProtectedRoute>} />
                    <Route path="/admin/subscribers" element={<ProtectedRoute requireSales><AdminSubscribers /></ProtectedRoute>} />
                    <Route path="/admin/email-templates" element={<ProtectedRoute requireSuperAdmin><AdminEmailTemplates /></ProtectedRoute>} />
                   <Route path="/admin/profile" element={<ProtectedRoute requireSales><AdminProfile /></ProtectedRoute>} />
                   <Route path="/admin/settings/profile" element={<ProtectedRoute requireSales><AdminProfile /></ProtectedRoute>} />
                    <Route path="/request-quote" element={<QuoteRequestForm />} />
                    <Route path="/my-quotes" element={<ProtectedRoute><MyQuotes /></ProtectedRoute>} />
                    <Route path="/my-quotes/:id" element={<ProtectedRoute><MyQuoteDetail /></ProtectedRoute>} />
                    <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                    <Route path="/my-orders" element={<ProtectedRoute><CustomerOrders /></ProtectedRoute>} />
                    <Route path="/my-orders/:id" element={<ProtectedRoute><CustomerSODetail /></ProtectedRoute>} />
                    <Route path="/my-invoices" element={<ProtectedRoute><MyInvoices /></ProtectedRoute>} />
                    <Route path="/my-invoices/:id" element={<ProtectedRoute><MyInvoiceDetail /></ProtectedRoute>} />
                    <Route path="/my-tax-invoices" element={<ProtectedRoute><MyTaxInvoices /></ProtectedRoute>} />
                    <Route path="/my-tax-invoices/:id" element={<ProtectedRoute><MyTaxInvoiceDetail /></ProtectedRoute>} />
                    <Route path="/my-receipts" element={<ProtectedRoute><MyReceipts /></ProtectedRoute>} />
                    <Route path="/my-documents" element={<ProtectedRoute><MyDocuments /></ProtectedRoute>} />
                    <Route path="/my/products" element={<ProtectedRoute><MyProducts /></ProtectedRoute>} />
                    <Route path="/my/products/register" element={<ProtectedRoute><RegisterProductForm /></ProtectedRoute>} />
                    <Route path="/my/products/:id" element={<ProtectedRoute><MyProductDetail /></ProtectedRoute>} />
                    <Route path="/my/repairs" element={<ProtectedRoute><MyRepairs /></ProtectedRoute>} />
                    <Route path="/my/repairs/new" element={<ProtectedRoute><RequestRepairForm /></ProtectedRoute>} />
                    <Route path="/my/repairs/:id" element={<ProtectedRoute><MyRepairDetail /></ProtectedRoute>} />
                    <Route path="/my-receipts/:id" element={<ProtectedRoute><MyReceiptDetail /></ProtectedRoute>} />
                    <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
                    <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                <SocialRibbon />
                <GeneralChatWidget />
                </CartProvider>
              </BrowserRouter>
            </TooltipProvider>
          </I18nProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
