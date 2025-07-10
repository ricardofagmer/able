'use client';

import {useEffect, useState} from 'react';
import {useUserStore} from '@/store/userStore';

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



    return {
        permissions,
        loading,
        isAuthenticated: isAuthenticated()
    };
}
