'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';

interface AccountData {
    id: number;
    email: string;
    name: string;
    permissions: string[];
}

export function usePermissions() {
    const { account, isAuthenticated } = useUserStore();
    const [permissions, setPermissions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadPermissionsFromStorage = () => {
            if (!isAuthenticated() || !account) {
                setPermissions([]);
                return;
            }

            try {
                setLoading(true);
                const accountData: AccountData = JSON.parse(account);
                setPermissions(accountData.permissions || []);
            } catch (error) {
                console.error('Error parsing account data:', error);
                setPermissions([]);
            } finally {
                setLoading(false);
            }
        };

        loadPermissionsFromStorage();
    }, [account, isAuthenticated]);

    const hasPermission = (permissionName: string): boolean => {
        if (!isAuthenticated()) return false;
        
        // Check if user has MASTER permission - if so, allow access to everything
        const hasMasterPermission = permissions.includes('MASTER');
        
        if (hasMasterPermission) {
            return true;
        }
        
        // Check if any permission route contains the permission name
        return permissions.some(permission => 
            permission.toLowerCase().includes(permissionName.toLowerCase())
        );
    };

    const hasAnyPermission = (permissionNames: string[]): boolean => {
        return permissionNames.some(name => hasPermission(name));
    };

    const hasRouteAccess = (route: string): boolean => {
        if (!isAuthenticated()) return false;
        
        // Temporary debug log
        console.log('Route check:', route, 'Permissions:', permissions);
        
        // Check if user has MASTER permission - if so, allow access to all routes
        const hasMasterPermission = permissions.includes('MASTER');
        
        if (hasMasterPermission) {
            return true;
        }
        
        // Check if the route is in the permissions array
        const hasAccess = permissions.some(permission => {
            // Normalize both routes by removing trailing slashes
            const normalizedRoute = route.replace(/\/$/, '') || '/';
            const normalizedPermission = permission.replace(/\/$/, '') || '/';
            
            // Check for exact match
            if (normalizedPermission === normalizedRoute) {
                console.log('Exact match:', normalizedPermission, '===', normalizedRoute);
                return true;
            }
            
            // Handle sub-routes (e.g., /dashboard permission allows /dashboard/analytics)
            if (normalizedRoute.startsWith(normalizedPermission + '/')) {
                console.log('Sub-route match:', normalizedRoute, 'starts with', normalizedPermission + '/');
                return true;
            }
            
            return false;
        });
        
        console.log('Final access result:', hasAccess);
        return hasAccess;
    };

    return {
        permissions,
        loading,
        hasPermission,
        hasAnyPermission,
        hasRouteAccess,
        isAuthenticated: isAuthenticated()
    };
}