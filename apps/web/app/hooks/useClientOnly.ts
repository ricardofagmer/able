'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to safely use client-only code
 * Returns true when running on client, false during SSR
 */
export function useClientOnly() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
}