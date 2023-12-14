import { Feed } from "@/app/components/Feed"
import { FeedHeader } from "@/app/components/FeedHeader"
import { PostForm } from "@/app/components/PostForm"

export default function FeedPage() {
  return (
    <section className="flex flex-col space-y-2">
      <FeedHeader />
      <PostForm />
      {/* <Feed /> */}
    </section>
  )
}
