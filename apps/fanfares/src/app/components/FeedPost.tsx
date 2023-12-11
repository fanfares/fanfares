import Image from "next/image"
import Link from "next/link"
import Button from "./Button"

interface FeedPostProps {
  user?: string
  userPfp?: string
  content?: string
  onClick?: () => {}
}

export function FeedPost({ user, userPfp, content, onClick }: FeedPostProps) {
  return (
    <div
      id="e2e-feed-post-container"
      className="border-buttonAccent w-full rounded-md flex relative border pl-16 pr-4 py-2 flex-col">
      <div className="w-11 h-11 rounded-full overflow-hidden absolute left-2 top-2">
        <img
          src="http://placebeard.it/640/480.jpg"
          className="w-full h-full border-2 border-buttonAccent"
          alt="Profile Image"
        />
      </div>
      <div className="flex-grow overflow-hidden space-y-1">
        <p className="text-sm font-bold">
          User name{" "}
          <Link
            href="#"
            className="text-white/50 font-medium hover:text-buttonAccentHover">
            @username
          </Link>
        </p>
        <h3 className="break-words text-sm font-normal">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est,
          consectetur unde culpa minus sed sit quam eius nulla odit, ipsa
          architecto praesentium officiis consequuntur? Harum explicabo
          excepturi quis doloribus libero.
        </h3>
      </div>
      <div className="mt-2 mx-auto">
        <Button
          className="px-2"
          id="e2e-feed-post-fanfare-button"
          label={"Fanfare 🎪"}
        />
      </div>
    </div>
  )
}
