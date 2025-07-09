'use client'

import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthModalProvider } from "./context/AuthModalContext";
import I18nProvider from "./i18n/I18nProvider";
import { useInitUserStore } from "./store/userStore";

const queryClient = new QueryClient();

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  useInitUserStore();

  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <AuthModalProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            {children}
          </TooltipProvider>
        </AuthModalProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}
