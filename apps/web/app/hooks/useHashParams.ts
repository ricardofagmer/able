'use client';

import { useEffect, useState } from 'react';
import { useClientOnly } from './useClientOnly';

/**
 * Hook to safely extract query parameters from hash fragments
 * Returns empty URLSearchParams during SSR to prevent hydration mismatches
 * Also provides a function to clear hash parameters
 */
export function useHashParams() {
  const isClient = useClientOnly();
  const [params, setParams] = useState<URLSearchParams>(new URLSearchParams());

  useEffect(() => {
    if (!isClient) return;
    
    const parseHashParams = () => {
      const hash = window.location.hash;
      if (!hash) return;

      const queryIndex = hash.indexOf('?');
      if (queryIndex === -1) return;
      
      const queryString = hash.substring(queryIndex);
      setParams(new URLSearchParams(queryString));
    };

    parseHashParams();

    window.addEventListener('hashchange', parseHashParams);
    return () => window.removeEventListener('hashchange', parseHashParams);
  }, [isClient]);

  const clearHashParams = () => {
    if (isClient && window.location.hash) {
      const hash = window.location.hash;
      const queryIndex = hash.indexOf('?');
      
      if (queryIndex !== -1) {
        const hashWithoutQuery = hash.substring(0, queryIndex);
        window.history.replaceState(null, '', window.location.pathname + window.location.search + hashWithoutQuery || '');
      } else {
        return;
      }
      
      setParams(new URLSearchParams());
    }
  };

  return { params, clearHashParams };
}