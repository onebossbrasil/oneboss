import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Store from "./pages/Store";
import Admin from "./pages/Admin";
import ProductDetail from "./pages/ProductDetail";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AccountDeletion from "./pages/AccountDeletion";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import MobileLogin from "./pages/MobileLogin";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import { CategoryProvider } from "./contexts/CategoryContext";
import { LeadProvider } from "./contexts/LeadContext";
import { NewsletterProvider } from "./contexts/NewsletterContext";
import { AuthProvider } from "./contexts/AuthContext";
import BottomNav from "./components/mobile/BottomNav";
import { useIsMobile } from "./hooks/use-is-mobile";
import { useIsNativeApp } from "./hooks/use-platform";
import { AppInitializer } from "./components/auth/AppInitializer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

const AppContent = () => {
  const isMobile = useIsMobile();
  const isNativeApp = useIsNativeApp();

  return (
    <AppInitializer>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/loja" element={<Store />} />
        <Route path="/loja/:categorySlug" element={<Store />} />
        <Route path="/produto/:productId" element={<ProductDetail />} />
        <Route path="/privacidade" element={<PrivacyPolicy />} />
        <Route path="/cancelar" element={<AccountDeletion />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/login" element={<MobileLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {isMobile && <BottomNav />}
    </AppInitializer>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <CategoryProvider>
          <LeadProvider>
            <NewsletterProvider>
              {/* Remover os toasts globais aqui, vão apenas pro Admin */}
              <BrowserRouter>
                <AppContent />
              </BrowserRouter>
            </NewsletterProvider>
          </LeadProvider>
        </CategoryProvider>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
