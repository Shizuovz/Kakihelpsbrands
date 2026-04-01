import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Departments from "./pages/Departments";
import Studio from "./pages/departments/Studio";
import Marketing from "./pages/departments/Marketing";
import Design from "./pages/departments/Design";
import Tech from "./pages/departments/Tech";
import Works from "./pages/Works";
import Contact from "./pages/Contact";
import Team from "./pages/Team";
import LifeAtKaki from "./pages/LifeAtKaki";
import NotFound from "./pages/NotFound";
import Navigation from "./components/Navigation";
import Preloader from "./components/Preloader";
import ScrollToTop from "./components/ScrollToTop";
import CaseStudyDetail from "./pages/CaseStudyDetail";
import BillboardAd from "./components/BillboardAd";
import Hoardings from "./pages/Hoardings";
import HoardingDetail from "./pages/HoardingDetail";
import Login from "./pages/Login";
import UserDashboard from "./pages/UserDashboard";

import AdminContent from "./pages/AdminContent";
import AdminLogin from "./pages/AdminLogin";
import { Navigate, useLocation } from "react-router-dom";

const queryClient = new QueryClient();

const NavigationWrapper = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  return !isAdminPath ? <Navigation /> : null;
};

const App = () => {
  useEffect(() => {
    // Set dark mode by default
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen bg-kaki-black text-kaki-white">
              <Preloader />
              <BillboardAd />
              <NavigationWrapper />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/departments" element={<Departments />} />
                <Route path="/departments/studio" element={<Studio />} />
                <Route path="/departments/marketing" element={<Marketing />} />
                <Route path="/departments/design" element={<Design />} />
                <Route path="/departments/tech" element={<Tech />} />
                <Route path="/works" element={<Works />} />
                <Route path="/case-studies/:id" element={<CaseStudyDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/team" element={<Team />} />
                <Route path="/life-at-kaki" element={<LifeAtKaki />} />
                <Route path="/hoardings" element={<Hoardings />} />
                <Route path="/hoardings/:id" element={<HoardingDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<UserDashboard />} />
                
                {/* Completely separate Admin CMS Routes */}
                <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/content" element={<AdminContent />} />
                
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
