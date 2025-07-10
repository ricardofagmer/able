'use client'

import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthModalProvider } from "./context/AuthModalContext";
import { useInitUserStore } from "./store/userStore";
import AuthModal from "./components/auth/AuthModal";

const queryClient = new QueryClient();

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  useInitUserStore();

  return (
    <QueryClientProvider client={queryClient}>
        <AuthModalProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AuthModal />
            {children}
          </TooltipProvider>
        </AuthModalProvider>
    </QueryClientProvider>
  );
}
