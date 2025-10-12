import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/components/ui/toast";

import { AuthProvider } from "@/contexts/AuthContext";
import { PropertyProvider } from "@/contexts/PropertyContext";
import { ConstructionProvider } from "@/contexts/ConstructionContext";
import { JobProvider } from "@/contexts/JobContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { PaymentProvider } from "@/contexts/PaymentContext";
import { InvestProvider } from "@/contexts/InvestContext";
import { WalletProvider } from "@/contexts/WalletContext"; // 👈 add this import


import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import LandlordDashboard from './pages/LandlordDashboard';
import ContractorDashboard from "./pages/ContractorDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import DesignerDashboard from "./pages/DesignerDashboard";
import NotFound from "./pages/NotFound";
import Properties from "./pages/Properties";
import PropertyDetails from "./pages/PropertyDetails";
import AddProperty from "./pages/AddProperty";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import TenantDashboard from "./pages/TenantDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Construction from "./pages/Construction";
import ConstructionDetails from "./pages/ConstructionDetails";
import ConstructionRentals from "./pages/ConstructionRentals";
import ConstructionSales from "./pages/ConstructionSales";
import Contract from "./pages/Contract";
import Help from "./pages/Help";
import SellerDashboard from "./pages/SellerDashboard";
import Invest from "./pages/Invest";
import Chat from "./pages/Chat";
import EditProperty from './pages/EditProperty';
import AddConstruction from "./pages/AddConstruction";
import { ConstructionPage } from "./pages/ConstructionPage";
import { ConstructionChart } from "./pages/ConstructionChart";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <PropertyProvider>
        <PaymentProvider>
          <ConstructionProvider>
            <JobProvider>
              <WishlistProvider>
                <OrderProvider>
                  <InvestProvider>
                    <WalletProvider>  
                      <TooltipProvider>
                        <ToastProvider>
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
                                <Route path="/constructionpage" element={<ConstructionPage />} />
                                <Route path="/add-construction" element={<AddConstruction />} />
                                <Route path="/construction/chart" element={<ConstructionChart />} />
                                <Route path="/tenant-dashboard" element={<TenantDashboard />} />
                                <Route path="/landlord-dashboard" element={<LandlordDashboard />} />
                                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                                <Route path="/contractor-dashboard" element={<ContractorDashboard />} />
                                <Route path="/worker-dashboard" element={<WorkerDashboard />} />
                                <Route path="/designer-dashboard" element={<DesignerDashboard />} />
                                <Route path="/construction" element={<Construction />} />
                                <Route path="/construction/rentals" element={<ConstructionRentals />} />
                                <Route path="/construction/sales" element={<ConstructionSales />} />
                                <Route path="/construction/:id" element={<ConstructionDetails />} />
                                <Route path="/contract/:id/:type" element={<Contract />} />
                                <Route path="/edit-property/:id" element={<EditProperty />} />
                                <Route path="/invest" element={<Invest />} />
                                <Route path="/chat" element={<Chat />} />
                                <Route path="/help" element={<Help />} />
                                {/* Catch-all route */}
                                <Route path="*" element={<NotFound />} />
                              </Routes>
                              <Chatbot />
                              <Toaster />
                              <Sonner />
                            </div>
                          </BrowserRouter>
                        </ToastProvider>
                      </TooltipProvider>
                    </WalletProvider>
                  </InvestProvider>
                </OrderProvider>
              </WishlistProvider>
            </JobProvider>
          </ConstructionProvider>
        </PaymentProvider>
      </PropertyProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;