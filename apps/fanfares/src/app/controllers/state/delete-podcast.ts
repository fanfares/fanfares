import { Event as NostrEvent, SimplePool } from "nostr-tools"
import { StateCreator, create } from "zustand"
import { PostGatedNoteIds, PostGatedNoteState, postGatedNote } from "nip108"
import { GATE_SERVER } from "../nostr/nostr-defines"
import { uploadToShdwDrive } from "../shdw/upload"
import { NIP07 } from "utils"
import { formatFilePrefixedName } from "../shdw/utils"

export type DeletePodcastState = "IDLE" | "DELETING"

export interface DeletePodcastCallbacks {
  onDelete?: () => void
  onError?: (error: string) => void
}

export interface DeletePodcast {
  deletePodcast: (
    nostrPool: SimplePool,
    nostrRelays: string[],
    accountNIP07: NIP07,
    gatedNoteId: string,
    announcementId: string,
    callbacks: DeletePodcastCallbacks
  ) => void
  deletePodcastState: DeletePodcastState
  deletePodcastPublicKey?: string | undefined
  deletePodcastSignedGatedNote?: NostrEvent
  deletePodcastSignedAnnouncement?: NostrEvent
  deletePodcastIsRunning: boolean
}

export const createDeletePodcast: StateCreator<
  DeletePodcast,
  [],
  []
> = (set, get) => {

  const deletePodcast = async (
    nostrPool: SimplePool,
    nostrRelays: string[],
    accountNIP07: NIP07,
    gatedNoteId : string,
    announcementId : string,
    callbacks: DeletePodcastCallbacks
  ) => {
    const {
      deletePodcastPublicKey,
    } = get()

    const { onDelete, onError } = callbacks
    const runOnDelete = onDelete ? onDelete : () => {}
    const runOnError = onError ? onError : () => {}

    try {
      if (!accountNIP07) throw new Error("Missing NIP07")
      if (!nostrPool) throw new Error("Missing pool")
      if (!nostrRelays) throw new Error("Missing relays")
      if (!gatedNoteId) throw new Error("Missing gated node to delete")
      if (!announcementId) throw new Error("Missing announcement node to delete")

      //if (!postPodcastLud16.includes("getalby.com")) throw new Error("Currently only Alby addresses are supported")

      set({ deletePodcastIsRunning: true })

      set({ deletePodcastState: "DELETING" })

      // Creating delete note
      const deleteNoteTags = [
        ["e", gatedNoteId],
        ["e", announcementId],
      ]
      const deleteNoteContent = "deleted by creator"
      const deleteNote = {
        kind: 5, // per NIP-09
        pubkey: deletePodcastPublicKey,
        created_at: Math.floor(Date.now() / 1000),
        tags: [
          ...(deleteNoteTags ?? []),
          ...(true ? [["debug", "true"]] : [])
        ],
        content: deleteNoteContent,
      }
      const deleteNoteSigned = await accountNIP07.signEvent(deleteNote)
      await nostrPool.publish(nostrRelays, deleteNoteSigned)

      // Run the success callback
      runOnDelete()
    } catch (error) {
      runOnError(`${error}`)

      // So sentry can catch the error
      throw new Error(`Failed to post podcast - ${error}`)
    } finally {
      set({ deletePodcastIsRunning: false })
    }
  }

  return {
    deletePodcastState: "IDLE",
    deletePodcastIsRunning: false,
    deletePodcast,
  }
}

export const useDeletePodcast = create<DeletePodcast>()(createDeletePodcast)
