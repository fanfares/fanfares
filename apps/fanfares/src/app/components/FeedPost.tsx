import Image from "next/image"
import Link from "next/link"
import Button from "./Button"

interface FeedPostProps {
  user?: string
  userPfp?: string
  content?: string
  userProfile?: string
  onClick?: () => {}
}

export function FeedPost(props: FeedPostProps) {
  const { user, userPfp, content, userProfile, onClick } = props

  return (
    <div
      id="e2e-feed-post-container"
      className="border-buttonAccent w-full rounded-md flex relative border pl-16 pr-4 py-3 flex-col">
      <div className="w-12 h-12 absolute left-2 top-2 group">
        <img
          src={userPfp ?? "http://placebeard.it/640/480.jpg"}
          className="w-full h-full border-2 border-buttonAccent object-cover rounded-full group-hover:border-buttonAccentHover"
          alt="Profile Image"
        />
      </div>
      <div className="flex-grow overflow-hidden space-y-1">
        <p className="text-sm font-bold">
          {user}{" "}
          <Link
            href="#"
            className="text-white/50 font-medium hover:text-buttonAccentHover">
            {userProfile ? userProfile : null}
          </Link>
        </p>
        <h3 className="break-words text-sm font-normal">{content}</h3>
      </div>
      <div className="mt-5 mx-auto flex gap-4">
        <Button
          className="px-2 w-28"
          id="e2e-feed-post-fanfare-button"
          label={"Fanfare 🎪"}
        />
        <Button
          className="px-2 w-28"
          id="e2e-feed-post-zap-button"
          label={"Zap ⚡️"}
        />
      </div>
    </div>
  )
}
