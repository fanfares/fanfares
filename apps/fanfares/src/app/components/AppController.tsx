"use client"

import { useEffect, useState } from "react"
import { useAppState } from "../controllers/state/old/use-app-state"
import { requestProvider } from "webln"
import { NIP04, NIP07 } from "utils"
import { usePrimalActions } from "../controllers/state/primal-slice"
import {
  useAccountActions,
  useAccountNostr,
} from "../controllers/state/account-slice"
import { useNostr } from "../controllers/state/nostr-slice"
import {
  usePodcastActions,
  usePodcastEpisodes,
  usePodcastFetching,
  usePodcastsUnlocked,
} from "../controllers/state/podcast-slice"
import { toast } from "react-toastify"

export interface AppControllerProps {
  children: React.ReactNode
}

/**
 * Controls the main lifecycle of the app. Will start connections with Nostr, Primal, and Webln.
 * At the end of the app, will disconnect from all of them.
 *
 * @param props
 * @returns
 */
export function AppController(props: AppControllerProps) {
  const { children } = props
  const { primalConnect, primalDisconnect } = usePrimalActions()
  const { accountSetWebln, accountFetchProfile, accountSetNostr } =
    useAccountActions()
  const { nostrDisconnect, nostrPool, nostrRelays } = useNostr()
  const { podcastFetch } = usePodcastActions()

  // const podcastEpisodes = usePodcastEpisodes();
  // const podcastFetching = usePodcastFetching();
  // const podcastUnlocked = usePodcastsUnlocked();
  // const accountNostr = useAccountNostr();

  // absolutely bizarre hack needed because nostr-login references 'document' and that breaks server-side rendering
  useEffect(() => {
    import("nostr-login")
      .then(async ({ init }) => {
        init({
          bunkers: "nsec.app,login.fanfares.io",
        })
      })
      .catch(error => console.log("Failed to load nostr-login", error))
  }, [])

  useEffect(() => {
    // Fixes the Local storage rehydration issue
    useAppState.persist.rehydrate()

    if (typeof window !== "undefined") {
      document.addEventListener("nlAuth", (e: any) => {
        // type is login, signup or logout
        if (e.detail.type === "login" || e.detail.type === "signup") {
          // TODO make this in nostrSlice
          // Nostr Account
          console.log("save profile to store")
          saveProfileToStore() // get pubkey with window.nostr and show user profile
        } else {
          // TODO - clear nostr store
          // onLogout ()  // clear local user data, hide profile info
        }
      })
    }

    // PRIMAL .
    primalConnect()

    // PODCASTS
    podcastFetch(nostrPool, nostrRelays)

    return () => {
      // // Cleans up connections at the end of the app
      nostrDisconnect()
      primalDisconnect()
    }

    function saveProfileToStore() {
      if ((window as any).nostr) {
        try {
          const nip07: NIP07 = (window as any).nostr
          if (!nip07 || !nip07.nip04 || !nip07.getPublicKey)
            throw new Error("Bad NIP07")

          nip07
            .getPublicKey()
            .then((publicKey: string) => {
              accountSetNostr({
                accountPublicKey: publicKey,
                accountNIP07: nip07,
                accountNIP04: nip07.nip04 as NIP04,
              })

              accountFetchProfile(publicKey, nostrPool, nostrRelays)

              // gateFetch();
            })
            .catch(e => {
              toast.error("Nostr not found - error getting public key")
            })
        } catch (e) {
          toast.error("Nostr not found - error getting public key")
        }
      } else {
        toast.error("Nostr not found")
      }
    }
  }, [])

  //TODO - this is a hacky way to unlock podcasts
  // useEffect(() => {
  //   if (
  //     !podcastUnlocked &&
  //     accountNostr &&
  //     accountNostr.accountPublicKey &&
  //     accountNostr.accountNIP04 &&
  //     !podcastFetching &&
  //     Object.keys(podcastEpisodes).length > 0
  //   ) {
  //     console.log("\n\nUnlocking Podcasts\n\n");
  //     podcastUnlockAll(
  //       nostrPool,
  //       nostrRelays,
  //       accountNostr.accountPublicKey,
  //       accountNostr.accountNIP04
  //     );
  //   }
  // }, [podcastEpisodes, podcastFetching, accountNostr, podcastUnlocked]);

  return children
}
