import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface SpacingProps {
  children: ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function Stack({ children, className, size = 'md' }: SpacingProps) {
  const sizeMap = {
    xs: 'space-y-1',
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6',
    xl: 'space-y-8',
    '2xl': 'space-y-12',
  };

  return (
    <div className={cn(sizeMap[size], className)}>{children}</div>
  );
}

export function HStack({ children, className, size = 'md' }: SpacingProps) {
  const sizeMap = {
    xs: 'space-x-1',
    sm: 'space-x-2',
    md: 'space-x-4',
    lg: 'space-x-6',
    xl: 'space-x-8',
    '2xl': 'space-x-12',
  };

  return (
    <div className={cn('flex items-center', sizeMap[size], className)}>{children}</div>
  );
}