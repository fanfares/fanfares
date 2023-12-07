"use client";

import { useEffect } from "react";
import { useAppState } from "../controllers/state/use-app-state";
import { requestProvider } from "webln";
import { NIP07 } from "utils";

export interface AppControllerProps {
  children: React.ReactNode;
}

export function AppController(props: AppControllerProps) {
  const { children } = props;
  const {nostrDisconnect, accountSetNostr, accountSetWebln, accountFetchProfile} = useAppState();

  useEffect(() => {
    // Fixes the Local storage rehydration issue
    useAppState.persist.rehydrate();


    // WEBLN 
    requestProvider()
    .then(accountSetWebln)
    .catch((e) => {
      alert("Please download Alby or ZBD to use this app.");
    });

    // NOSTR ACCOUNT
    if ((window as any).nostr) {
      const nip07: NIP07 = (window as any).nostr;
      nip07.getPublicKey().then((publicKey: string)=>{
        accountSetNostr(nip07, publicKey);
        accountFetchProfile();
      }).catch((e: any) => {
        alert("Nostr not found - error getting public key");
      })
    } else {
      alert("Nostr not found");
    }

    return () => {
        // Cleans up connections at the end of the app
        nostrDisconnect();
    };
  }, []);

  return children;
}
