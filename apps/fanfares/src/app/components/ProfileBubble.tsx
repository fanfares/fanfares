"use client"

import { useAppState } from "../controllers/state/use-app-state";

export function ProfileBuble() {
  const { accountProfile } = useAppState();

  if(!accountProfile) return null;

  return (
    <div className="flex bg-skin-fill rounded-full items-center w-36 mx-auto p-1 h-10 gap-1 hover:bg-skin-fill/70 transition-colors ease-linear cursor-pointer">
      <div className="w-8 bg-red-500 h-8 rounded-full">
        <img src={accountProfile.picture} alt="" />
      </div>
      <div className="flex flex-col items-start">
        <p className="text-sm">{accountProfile.name}</p>
        <p className="text-xs text-skin-muted">{accountProfile.lud16}</p>
      </div>
    </div>
  )
}
