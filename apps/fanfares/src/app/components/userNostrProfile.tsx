"use client" // Ensure this is a client-side hook

import { useEffect, useState, useCallback } from "react"
import NDK from "@nostr-dev-kit/ndk"
import type { NDKUser } from "@nostr-dev-kit/ndk"

interface NostrProfile {
  banner?: string
  lud06?: string
  lud16?: string
  website?: string
  picture?: string
  display_name?: string
  name?: string
  about?: string
  username?: string
  displayName?: string
  nip05?: string
  nip05valid?: boolean
  followingCount?: number
  followersCount?: number
  zapService?: string
}

const relays = ["wss://relay.damus.io"] // Add your preferred relays

function useNostrProfile(pubkey: string): NostrProfile | null {
  const [profile, setProfile] = useState<NostrProfile | null>(null)

  const fetchProfile = useCallback(async () => {
    try {
      const ndk = new NDK({
        explicitRelayUrls: relays,
        autoConnectUserRelays: true,
      })

      await ndk.connect()

      const user = ndk.getUser({ pubkey })

      const profile = await user.fetchProfile()

      setProfile(profile as NostrProfile)
    } catch (err) {
      console.error("Error fetching Nostr profile:", err)
    }
  }, [pubkey])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  return profile
}

export default useNostrProfile
