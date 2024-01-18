"use client";

import { useEffect } from "react";
import { useAppState } from "../controllers/state/use-app-state";
import { requestProvider } from "webln";
import { NIP07 } from "utils";
import { usePrimalActions } from "../controllers/state/primal-slice";

export interface AppControllerProps {
  children: React.ReactNode;
}

/**
 * Controls the main lifecycle of the app. Will start connections with Nostr, Primal, and Webln.
 * At the end of the app, will disconnect from all of them.
 * 
 * @param props 
 * @returns 
 */
export function AppController(props: AppControllerProps) {
  const { children } = props;
  const { primalConnect, primalDisconnect, primalGet } = usePrimalActions();
  const {nostrDisconnect, accountSetNostr, accountSetWebln, accountFetchProfile, gateFetch, podcastFetch, podcastFetching, podcastEpisodes, podcastUnlockAll} = useAppState();

  useEffect(() => {
    // Fixes the Local storage rehydration issue
    useAppState.persist.rehydrate();


    // WEBLN 
    requestProvider()
    .then(accountSetWebln)
    .catch((e) => {
      alert("Please download Alby or ZBD to use this app.");
    });

    // // NOSTR ACCOUNT
    if ((window as any).nostr) {
      const nip07: NIP07 = (window as any).nostr;
      nip07.getPublicKey().then((publicKey: string)=>{
        accountSetNostr(nip07, publicKey);
        accountFetchProfile();
        // gateFetch();
      }).catch((e: any) => {
        alert("Nostr not found - error getting public key");
      })
    } else {
      alert("Nostr not found");
    }

    // PRIMAL
    primalConnect();

    // PODCASTS
    //TODO ReRender Problem
    // podcastFetch();

    return () => {
        // // Cleans up connections at the end of the app
        // nostrDisconnect();
        primalDisconnect();
    };
  }, []);

  useEffect(() => {
    if (!podcastFetching && Object.keys(podcastEpisodes).length > 0) {
      podcastUnlockAll();
    }
  }, [podcastEpisodes, podcastFetching]);

  return children;
}
