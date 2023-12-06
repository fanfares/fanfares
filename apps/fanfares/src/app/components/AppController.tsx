"use client";

import { useEffect } from "react";
import { useAppState } from "../controllers/state/use-app-state";

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
