"use client"

import { useRouter } from "next/navigation"
import { useAccountProfile } from "../controllers/state/account-slice"
import { useAppState } from "../controllers/state/old/use-app-state"

export function ProfileBuble() {
  const router = useRouter()
  const accountProfile = useAccountProfile()

  if (!accountProfile) return null

  const goToProfilePage = () => {
    router.push(`/p/${accountProfile.pubkey}`)
  }


  return (
    <div
      onClick={goToProfilePage}
      className="cursor-pointer flex bg-skin-fill rounded-full items-center w-36 mx-auto p-1 h-10 hover:bg-skin-fill/70 transition-colors ease-linear mb-4 gap-1">
      <div className="w-8 rounded-full flex items-center justify-center">
        {accountProfile?.picture ? (
          <img
            src={accountProfile?.picture}
            alt=""
            className="w-full rounded-full object-cover object-center"
          />
        ) : (
          "🎪"
        )}
        {/* <img
          src={
            "https://shdw-drive.genesysgo.net/FR9UETvWqw4YrxnrjrxJDGpjrpYmcg1UTDiKF99XSAsS/debug_clayno.png"
          }
          className="w-full rounded-full object-cover object-center"
        /> */}
      </div>
      <div className="flex flex-col items-start w-[100px] font-thin">
        <p className="text-[0.7rem] truncate">{accountProfile.name}</p>
        <p className="text-[0.6rem] font-thin  text-skin-muted truncate w-4/5 line-clamp-2">
          {accountProfile.nip05}
        </p>
      </div>
    </div>
  )
}
