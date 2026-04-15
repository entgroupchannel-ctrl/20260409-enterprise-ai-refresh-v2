import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
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
import SocialRibbon from "./components/SocialRibbon.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";

/* ── Lazy-loaded pages (with auto-retry on chunk errors) ── */
const GTSeries = lazyRetry(() => import("./pages/GTSeries"));
const GBSeries = lazyRetry(() => import("./pages/GBSeries"));
const EPCBoxSeries = lazyRetry(() => import("./pages/EPCBoxSeries"));
const MiniPC = lazyRetry(() => import("./pages/MiniPC"));
const WaterproofPC = lazyRetry(() => import("./pages/WaterproofPC"));
const Volktek = lazyRetry(() => import("./pages/Volktek"));
const EPCSeries = lazyRetry(() => import("./pages/EPCSeries"));
const RuggedTablet = lazyRetry(() => import("./pages/RuggedTablet"));
const Handheld = lazyRetry(() => import("./pages/Handheld"));
const GKSeries = lazyRetry(() => import("./pages/GKSeries"));
const PanelPCGTG = lazyRetry(() => import("./pages/PanelPCGTG"));
const SmartDisplay = lazyRetry(() => import("./pages/SmartDisplay"));
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
const Login = lazyRetry(() => import("./pages/auth/Login"));
const Register = lazyRetry(() => import("./pages/auth/Register"));
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
const AdminAuditLog = lazyRetry(() => import("./pages/admin/AdminAuditLog"));
const AdminSaleOrders = lazyRetry(() => import("./pages/admin/AdminSaleOrders"));
const AdminRequests = lazyRetry(() => import("./pages/admin/AdminRequests"));
const AdminApprovals = lazyRetry(() => import("./pages/admin/AdminApprovals"));
const ProductsList = lazyRetry(() => import("./pages/admin/ProductsList"));
const ProductImport = lazyRetry(() => import("./pages/admin/ProductImport"));
const GTImagesImport = lazyRetry(() => import("./pages/admin/GTImagesImport"));
const ProductMigrationReview = lazyRetry(() => import("./pages/admin/ProductMigrationReview"));
const MigrateDatasheets = lazyRetry(() => import("./pages/admin/MigrateDatasheets"));
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
                    <Route path="/shop" element={<ShopStorefront />} />
                    <Route path="/shop/compare" element={<ShopCompare />} />
                    <Route path="/shop/:slug" element={<ShopProductDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/admin/dashboard" element={<ProtectedRoute requireSales><AdminDashboard /></ProtectedRoute>} />
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
                    <Route path="/admin/employees/:id" element={<ProtectedRoute allowedRoles={['super_admin', 'admin']}><AdminEmployeeDetail /></ProtectedRoute>} />
                    <Route path="/admin/customers" element={<ProtectedRoute requireSales><AdminCustomersList /></ProtectedRoute>} />
                    <Route path="/admin/customers/:id" element={<ProtectedRoute requireSales><AdminCustomerDetail /></ProtectedRoute>} />
                    <Route path="/admin/audit-log" element={<ProtectedRoute allowedRoles={['super_admin']}><AdminAuditLog /></ProtectedRoute>} />
                    <Route path="/admin/sale-orders" element={<ProtectedRoute requireSales><AdminSaleOrders /></ProtectedRoute>} />
                    <Route path="/admin/sale-orders/:id" element={<ProtectedRoute requireSales><AdminSaleOrders /></ProtectedRoute>} />
                    <Route path="/admin/invoices" element={<ProtectedRoute requireSales><AdminInvoicesList /></ProtectedRoute>} />
                    <Route path="/admin/invoices/:id" element={<ProtectedRoute requireSales><AdminInvoiceDetail /></ProtectedRoute>} />
                    <Route path="/admin/tax-invoices" element={<ProtectedRoute requireSales><AdminTaxInvoicesList /></ProtectedRoute>} />
                    <Route path="/admin/tax-invoices/:id" element={<ProtectedRoute requireSales><AdminTaxInvoiceDetail /></ProtectedRoute>} />
                    <Route path="/admin/credit-notes" element={<ProtectedRoute requireSales><AdminCreditNotesList /></ProtectedRoute>} />
                    <Route path="/admin/credit-notes/:id" element={<ProtectedRoute requireSales><AdminCreditNoteDetail /></ProtectedRoute>} />
                    <Route path="/admin/receipts" element={<ProtectedRoute requireSales><AdminReceiptsList /></ProtectedRoute>} />
                    <Route path="/admin/receipts/:id" element={<ProtectedRoute requireSales><AdminReceiptDetail /></ProtectedRoute>} />
                    <Route path="/admin/registered-products" element={<ProtectedRoute requireSales><AdminRegisteredProductsList /></ProtectedRoute>} />
                    <Route path="/admin/registered-products/:id" element={<ProtectedRoute requireSales><AdminRegisteredProductDetail /></ProtectedRoute>} />
                    <Route path="/admin/requests" element={<ProtectedRoute requireAdmin><AdminRequests /></ProtectedRoute>} />
                    <Route path="/admin/approvals" element={<ProtectedRoute requireSuperAdmin><AdminApprovals /></ProtectedRoute>} />
                    <Route path="/admin/products" element={<ProtectedRoute requireSales><ProductsList /></ProtectedRoute>} />
                    <Route path="/admin/products/import" element={<ProtectedRoute requireSales><ProductImport /></ProtectedRoute>} />
                    <Route path="/admin/gt-images-import" element={<ProtectedRoute requireSales><GTImagesImport /></ProtectedRoute>} />
                    <Route path="/admin/product-migration" element={<ProtectedRoute requireSuperAdmin><ProductMigrationReview /></ProtectedRoute>} />
                    <Route path="/admin/migrate-datasheets" element={<ProtectedRoute requireSuperAdmin><MigrateDatasheets /></ProtectedRoute>} />
                    <Route path="/admin/settings/company" element={<ProtectedRoute requireSales><AdminCompanySettings /></ProtectedRoute>} />
                   <Route path="/admin/profile" element={<ProtectedRoute requireSales><AdminProfile /></ProtectedRoute>} />
                   <Route path="/admin/settings/profile" element={<ProtectedRoute requireSales><AdminProfile /></ProtectedRoute>} />
                    <Route path="/request-quote" element={<QuoteRequestForm />} />
                    <Route path="/my-quotes" element={<ProtectedRoute><MyQuotes /></ProtectedRoute>} />
                    <Route path="/my-quotes/:id" element={<ProtectedRoute><MyQuoteDetail /></ProtectedRoute>} />
                    <Route path="/cart" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
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
                    <Route path="/my-receipts/:id" element={<ProtectedRoute><MyReceiptDetail /></ProtectedRoute>} />
                    <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
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
  </ErrorBoundary>
);

export default App;
