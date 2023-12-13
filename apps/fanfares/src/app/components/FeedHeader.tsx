"use client"
import clsx from "clsx"
import { useState } from "react"

export function FeedHeader() {
  const [live, setLive] = useState(false)
  const [following, setFollowing] = useState(false)

  return (
    <div
      id="e2e-feed-header-container"
      className="border border-buttonAccent rounded-md space-y-5">
      <div className="pl-16 pr-4 py-2 rounded-md flex flex-col relative w-full">
        <div className="w-8 h-8 rounded-full overflow-hidden absolute left-2 top-2">
          <img
            src="http://placebeard.it/640/480.jpg"
            className="w-full h-full border-2 border-buttonAccent"
            alt="Profile Image"
          />
        </div>
        <div className="flex justify-between items-center">
          <p className="font-bold hidden md:block">Home</p>
          <button className="text-2xl ml-auto md:ml-0">⛭</button>
        </div>
        <p className="absolute top-1 left-1/2 -translate-x-1/2 text-2xl cursor-default">
          🎪
        </p>
      </div>
      <div className="mx-auto flex justify-between w-full">
        <button
          id="e2e-feed-header-live-button"
          onClick={() => setLive(!live)}
          className={clsx(
            "relative hover:bg-skin-fill w-1/2 p-4 rounded-bl-md",
            {
              "content-[''] after:w-10 after:border-2 after:absolute after:-bottom-0 after:border-buttonAccentHover after:rounded-full after:left-1/2 after:-translate-x-1/2 font-bold":
                live,
            }
          )}>
          Live
        </button>
        <button
          id="e2e-feed-header-following-button"
          onClick={() => setFollowing(!following)}
          className={clsx(
            "relative hover:bg-skin-fill w-1/2 p-4 rounded-br-md",
            {
              "content-[''] after:w-20 after:border-2 after:absolute after:-bottom-0 after:border-buttonAccentHover after:rounded-full after:left-1/2 after:-translate-x-1/2 font-bold":
                following,
            }
          )}>
          Following
        </button>
      </div>
    </div>
  )
}
