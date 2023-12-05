"use client";

import { useAppState } from "@/controllers/state/use-app-state";
import { useEffect } from "react";

export interface AppControllerProps {
  children: React.ReactNode;
}

export function AppController(props: AppControllerProps) {
  const { children } = props;
  const {nostrDisconnect} = useAppState();

  useEffect(() => {
    // Fixes the Local storage rehydration issue
    useAppState.persist.rehydrate();

    return () => {
        // Cleans up connections at the end of the app
        nostrDisconnect();
    };
  }, []);

  return children;
}
