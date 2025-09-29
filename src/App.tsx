import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { PropertyProvider } from "@/contexts/PropertyContext";
import { ConstructionProvider } from "@/contexts/ConstructionContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { OrderProvider } from "@/contexts/OrderContext";
import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import AddProperty from "./pages/AddProperty";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import TenantDashboard from "./pages/TenantDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ContractorDashboard from "./pages/ContractorDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import DesignerDashboard from "./pages/DesignerDashboard";
import Construction from "./pages/Construction";
import ConstructionDetails from "./pages/ConstructionDetails";
import ConstructionRentals from "./pages/ConstructionRentals";
import ConstructionSales from "./pages/ConstructionSales";
import Contract from "./pages/Contract";
import Help from "./pages/Help";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <PropertyProvider>
        <ConstructionProvider>
          <WishlistProvider>
            <OrderProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <div className="min-h-screen bg-background">
                  <Navbar />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/properties" element={<Properties />} />
                    <Route path="/property/:id" element={<PropertyDetails />} />
                    <Route path="/add-property" element={<AddProperty />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/orderspage" element={<Orders />} />
                    <Route path="/tenant-dashboard" element={<TenantDashboard />} />
                    <Route path="/seller-dashboard" element={<SellerDashboard />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/contractor-dashboard" element={<ContractorDashboard />} />
                    <Route path="/worker-dashboard" element={<WorkerDashboard />} />
                    <Route path="/designer-dashboard" element={<DesignerDashboard />} />
              <Route path="/construction" element={<Construction />} />
              <Route path="/construction/rentals" element={<ConstructionRentals />} />
              <Route path="/construction/sales" element={<ConstructionSales />} />
              <Route path="/construction/:id" element={<ConstructionDetails />} />
                    <Route path="/contract/:id/:type" element={<Contract />} />
                    <Route path="/help" element={<Help />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  <Chatbot />
                </div>
              </BrowserRouter>
            </TooltipProvider>
            </OrderProvider>
          </WishlistProvider>
        </ConstructionProvider>
      </PropertyProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
