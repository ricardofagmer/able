import React from 'react';
import { Button } from '../components';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components';

interface CardWithActionProps {
  title: string;
  children: React.ReactNode;
  actionLabel: string;
  onAction: () => void;
}

export function CardWithAction({ title, children, actionLabel, onAction }: CardWithActionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <Button onClick={onAction}>{actionLabel}</Button>
      </CardFooter>
    </Card>
  );
}