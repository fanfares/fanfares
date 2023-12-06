'use client';

import { AppController } from "./AppController";


export interface ThemeProviderProps {
    children: React.ReactNode;
}

export function Providers(props: ThemeProviderProps) {
  const { children } = props;
  return (
    <AppController>
      {children}
    </AppController>
  );
}