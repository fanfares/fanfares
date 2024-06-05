import React from "react"
import { useRouter } from "next/router"
import EpisodeCard from "./EpisodeCard"
import useNostrProfile from "./UserNostrProfile"

interface EpisodeCardProps {
  podcast: any // Replace 'any' with the appropriate type
  episodeTestingTitlesFilter: string[]
}

const EpisodeCardComponent: React.FC<EpisodeCardProps> = ({
  podcast,
  episodeTestingTitlesFilter,
}) => {
  const router = useRouter()
  const creatorProfile = useNostrProfile(podcast.gate.note.pubkey.toString())

  if (!creatorProfile) return null

  const toHide = episodeTestingTitlesFilter.includes(podcast.title)
  if (toHide) return null

  return (
    <EpisodeCard
      key={podcast.gate.note.id}
      onClick={() => {
        router.push(`/player/${podcast.gate.note.id}`)
      }}
      imgUrl={podcast.imageFilepath}
      title={podcast.title}
      description={podcast.description}
      audioUrl={podcast.audioFilepath}
      creatorName={creatorProfile.displayName || "Unknown"}
      creatorProfilePicture={creatorProfile.picture}
    />
  )
}

export default EpisodeCardComponent
