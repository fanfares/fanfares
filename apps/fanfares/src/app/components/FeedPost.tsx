import Image from "next/image"

interface FeedPostProps {
  user?: string
  userPfp?: string
  content?: string
  onClick?: () => {}
}

export function FeedPost({ user, userPfp, content, onClick }: FeedPostProps) {
  return (
    <div className="border-buttonAccent w-full rounded-md flex relative border pl-16 pr-4 py-2 flex-col">
      <div className="w-11 h-11 rounded-full overflow-hidden absolute left-2 top-2">
        <img
          src="http://placebeard.it/640/480.jpg"
          className="w-full h-full border-2 border-buttonAccent"
          alt="Profile Image"
        />
      </div>
      <div className="flex-grow overflow-hidden space-y-1">
        <p className="text-sm font-bold">
          User name <span className="text-white/50 font-medium">@username</span>
        </p>
        <h3 className="break-words text-sm font-normal">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est,
          consectetur unde culpa minus sed sit quam eius nulla odit, ipsa
          architecto praesentium officiis consequuntur? Harum explicabo
          excepturi quis doloribus libero.
        </h3>
      </div>
      <div>
        <button>🎪</button>
      </div>
    </div>
  )
}
