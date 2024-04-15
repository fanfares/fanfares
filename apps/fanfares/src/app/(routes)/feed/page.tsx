"use client"
import { Feed } from "@/app/components/Feed"
import { FeedHeader } from "@/app/components/FeedHeader"
import { PostForm } from "@/app/components/PostForm"
import {
  usePrimalActions,
} from "../../controllers/state/primal-slice"
import {
  useAccountNostr,
} from "../../controllers/state/account-slice"

export default function FeedPage() {
  const nostrAccount = useAccountNostr()
  const primalActions = usePrimalActions()
  primalActions.primalGet(nostrAccount?.accountPublicKey || "", 'global')
  return (
    <section className="flex flex-col space-y-2">
      {/* <FeedHeader /> */}
      {/* <PostForm /> */}
      <Feed />
    </section>
  )
}
