'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requiredRoute: string;
    fallbackPath?: string;
}

interface AccountData {
    id: number;
    email: string;
    permissions: string[];
}

export function ProtectedRoute({
    children,
    requiredRoute,
    fallbackPath = '/'
}: ProtectedRouteProps) {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const [endpoints, setEndpoints] = useState([]);
    const { account, isAuthenticated } = useUserStore();
    const [loading, setLoading] = useState(false);
    const [allow, setAllow] = useState(false);

    useEffect(() => {
        const loadPermissionsFromStorage = () => {
            if (!isAuthenticated() || !account) {
                setEndpoints([]);
                setIsChecking(false);
                return;
            }

            try {
                setLoading(true);
                const accountData = JSON.parse(account);
                setEndpoints(accountData.permissions || []);
            } catch (error) {
                console.error('Error parsing account data:', error);
                setEndpoints([]);
            } finally {
                setLoading(false);
            }
        };

        loadPermissionsFromStorage();
    }, [account, isAuthenticated]);

    useEffect(() => {
        const checkPermission = () => {
            if (loading) return;

            setIsChecking(false);

            if (!isAuthenticated() || !account) {
                return;
            }

            const hasAccess = endpoints.find(e => e === requiredRoute)

            setAllow(hasAccess);

            if (hasAccess) {
                router.push(requiredRoute)
            }
        };

        checkPermission();
    }, [endpoints, loading, isAuthenticated, account, requiredRoute, router, fallbackPath]);


    if (isChecking || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated || !account || !allow) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
                    <p className="text-gray-600 mb-6">You do not have permission to access this page.</p>
                    <button
                        onClick={() => router.push(fallbackPath)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );

    }

    return <>{children}</>;
}
