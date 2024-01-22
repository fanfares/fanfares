"use client"

import { useAppState } from "../controllers/state/use-app-state"

export function ProfileBuble() {
  const { accountProfile } = useAppState()

  // if (!accountProfile) return null

  return (
    <div className="flex bg-skin-fill rounded-full items-center w-36 mx-auto p-1 h-10 gap-1 hover:bg-skin-fill/70 transition-colors ease-linear mb-4">
      <div className="w-12 rounded-full flex items-center justify-center">
        {/* {accountProfile?.picture ? (
          <img
            src={accountProfile?.picture}
            alt=""
            className="w-full object-cover"
          />
        ) : (
          "🎪"
        )} */}
        <img
          src={accountProfile?.picture}
          className="w-full rounded-full object-cover object-center"
        />
      </div>
      <div className="flex flex-col items-start w-40">
        <p className="text-xs truncate">
          {accountProfile?.name || "Nostr User"}
        </p>
        <p className="text-xs text-skin-muted truncate w-4/5">
          {accountProfile?.lud16 || "Nostr Lud16"}
        </p>
      </div>
    </div>
  )
}
