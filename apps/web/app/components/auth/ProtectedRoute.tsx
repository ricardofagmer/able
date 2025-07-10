'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePermissions } from '@/hooks/usePermissions';
import { useUserStore } from '@/store/userStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoute: string;
    fallbackPath?: string;
}

export function ProtectedRoute({ 
    children, 
    requiredRoute, 
    fallbackPath = '/' 
}: ProtectedRouteProps) {
    const { hasRouteAccess, isAuthenticated, loading } = usePermissions();
    const { account } = useUserStore();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const checkPermission = async () => {
            // Wait for authentication state to be determined
            if (loading) return;

            setIsChecking(false);

            // If user is not authenticated, allow access (they can see the page but won't see protected nav items)
            if (!isAuthenticated || !account) {
                return;
            }

            // If user is authenticated but doesn't have permission, redirect
            if (!hasRouteAccess(requiredRoute)) {
                router.push(fallbackPath);
                return;
            }
        };

        checkPermission();
    }, [hasRouteAccess, isAuthenticated, loading, account, requiredRoute, fallbackPath, router]);

    // Show loading state while checking permissions
    if (isChecking || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // If user is authenticated and doesn't have permission, show access denied
    if (isAuthenticated && account && !hasRouteAccess(requiredRoute)) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Acesso Negado</h1>
                    <p className="text-gray-600 mb-6">Você não tem permissão para acessar esta página.</p>
                    <button 
                        onClick={() => router.push(fallbackPath)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        Voltar ao Início
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}