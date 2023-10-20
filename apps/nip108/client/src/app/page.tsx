"use client"

import {
  Relay,
  relayInit,
  VerifiedEvent,
  generatePrivateKey,
} from "nostr-tools"
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa"
import { useEffect, useState } from "react"
import { WebLNProvider, requestProvider } from "webln"
import {
  AnnouncementNote,
  CreateNotePostBody,
  GatedNote,
  KeyNote,
  NIP_108_KINDS,
  createAnnouncementNoteUnsigned,
  createGatedNoteUnsigned,
  eventToAnnouncementNote,
  eventToGatedNote,
  eventToKeyNote,
  unlockGatedNote,
  PREntry,
} from "nip108"
import AnimatedMenuButton from "@/components/AnimatedButton"
import NavigationMenu from "@/components/NavigationMenu"
import Button from "@/components/Button"

const RELAY = process.env.NEXT_PUBLIC_NOSTR_RELAY as string
const GATE_SERVER = process.env.NEXT_PUBLIC_GATE_SERVER as string

const MIN_PREVIEW_LENGTH = Number(process.env.NEXT_PUBLIC_MIN_PREVIEW_LENGTH)
const MAX_PREVIEW_LENGTH = Number(process.env.NEXT_PUBLIC_MAX_PREVIEW_LENGTH)

const MIN_CONTENT_LENGTH = Number(process.env.NEXT_PUBLIC_MIN_CONTENT_LENGTH)
const MAX_CONTENT_LENGTH = Number(process.env.NEXT_PUBLIC_MAX_CONTENT_LENGTH)

const MIN_SAT_COST = Number(process.env.NEXT_PUBLIC_MIN_SAT_COST)
const MAX_SAT_COST = Number(process.env.NEXT_PUBLIC_MAX_SAT_COST)

const NOSTR_FETCH_LIMIT = Number(process.env.NEXT_PUBLIC_NOSTR_FETCH_LIMIT)

interface FormData {
  lud16: string
  cost?: number
  preview: string
  content: string
}

const DEFAULT_FORM_DATA: FormData = {
  lud16: "coachchuckff@getalby.com",
  cost: 1,
  preview: "Hey unlock my post for 1 sat!",
  content: "This is the content that will be unlocked!",
}

export default function Home() {
  // ------------------- STATES -------------------------

  const [gateLoading, setGateLoading] = useState<string | null>()
  const [relay, setRelay] = useState<Relay | null>(null)
  const [nostr, setNostr] = useState<any | null>(null)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [webln, setWebln] = useState<null | WebLNProvider>(null)
  const [announcementNotes, setAnnouncementNotes] = useState<
    AnnouncementNote[]
  >([])
  const [gatedNotes, setGatedNotes] = useState<GatedNote[]>([])
  const [keyNotes, setKeyNotes] = useState<KeyNote[]>([])

  const [submittingForm, setSubmittingForm] = useState<boolean>(false)
  const [isPostFormOpen, setPostFormOpen] = useState<boolean>(false)
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA)

  // ------------------- EFFECTS -------------------------

  useEffect(() => {
    requestProvider()
      .then(setWebln)
      .catch(e => {
        alert("Please download Alby or ZBD to use this app.")
      })
  }, [])

  useEffect(() => {
    if ((window as any).nostr) {
      setNostr((window as any).nostr)
      ;(window as any).nostr.getPublicKey().then(setPublicKey)
    } else {
      alert("Nostr not found")
    }
  }, [])

  useEffect(() => {
    const newRelay = relayInit(RELAY)
    newRelay.on("connect", () => {
      setRelay(newRelay)
    })
    newRelay.connect()

    return () => {
      newRelay.close()
    }
  }, [])

  useEffect(() => {
    if (relay && nostr && publicKey) {
      relay
        .list([
          {
            kinds: [NIP_108_KINDS.announcement],
            limit: NOSTR_FETCH_LIMIT,
          },
          {
            kinds: [NIP_108_KINDS.key],
            limit: NOSTR_FETCH_LIMIT,
            authors: [publicKey as string],
          },
        ])
        .then(notes => {
          const newAnnouncementNotes: AnnouncementNote[] = []
          const newKeyNotes: KeyNote[] = []

          for (const note of notes) {
            if (
              note.kind === NIP_108_KINDS.announcement &&
              note.tags.find(tag => tag[0] === "g")
            ) {
              newAnnouncementNotes.push(
                eventToAnnouncementNote(note as VerifiedEvent)
              )
            } else if (note.kind === NIP_108_KINDS.key) {
              newKeyNotes.push(eventToKeyNote(note as VerifiedEvent))
            }
          }

          setAnnouncementNotes(newAnnouncementNotes)
          setKeyNotes(newKeyNotes)

          relay
            .list([
              {
                ids: [
                  ...newAnnouncementNotes.map(
                    announcementNote => announcementNote.gate
                  ),
                  ...newKeyNotes.map(keyNote => keyNote.gate),
                ],
              },
            ])
            .then(gatedEvents => {
              console.log(gatedEvents)
              setGatedNotes(
                gatedEvents.map(gatedNote =>
                  eventToGatedNote(gatedNote as VerifiedEvent)
                )
              )
            })
        })
    }
  }, [relay, nostr, publicKey])

  useEffect(() => {
    if (gatedNotes.length > 0) {
      unlockAll()
    }
  }, [gatedNotes])

  // ------------------- FUNCTIONS -------------------------

  const unlockAll = async () => {
    const newKeyNotes: KeyNote[] = []
    for (const keyNote of keyNotes) {
      const gatedNote = gatedNotes.find(
        gatedNote => gatedNote.note.id === keyNote.gate
      )

      if (!gatedNote) {
        newKeyNotes.push(keyNote)
        continue
      }

      const unlockedSecret = await nostr.nip04.decrypt(
        gatedNote.note.pubkey,
        keyNote.note.content
      )

      newKeyNotes.push({
        ...keyNote,
        unlockedSecret,
      })
    }

    setKeyNotes(newKeyNotes)
  }

  const handleBuy = async (gatedNote: GatedNote) => {
    if (gateLoading) return

    setGateLoading(gatedNote.note.id)

    try {
      if (!webln) throw new Error("No webln provider")
      if (!nostr) throw new Error("No nostr provider")
      if (!publicKey) throw new Error("No Public Key")
      if (!relay) throw new Error("No relay")

      const uri = `${gatedNote.endpoint}/${gatedNote.note.id}`
      const invoiceResponse = await fetch(uri)
      const invoiceResponseJson = (await invoiceResponse.json()) as PREntry

      await webln.sendPayment(invoiceResponseJson.pr)

      const resultResponse = await fetch(invoiceResponseJson.successAction.url)
      const resultResponseJson = await resultResponse.json()
      const secret = resultResponseJson.secret

      const content = await nostr.nip04.encrypt(gatedNote.note.pubkey, secret)

      const keyEvent = {
        kind: NIP_108_KINDS.key,
        pubkey: publicKey,
        created_at: Math.floor(Date.now() / 1000),
        tags: [["g", gatedNote.note.id]],
        content: content,
      }

      const keyEventVerified = await nostr.signEvent(keyEvent)

      await relay.publish(keyEventVerified)

      const keyNoteUnlocked = {
        ...eventToKeyNote(keyEventVerified),
        unlockedSecret: secret,
      } as KeyNote
      setKeyNotes([...keyNotes, keyNoteUnlocked])
    } catch (e) {
      alert(e)
    }

    setGateLoading(null)
  }

  const formatGatedContent = (content: string) => {
    return content.substring(0, 500) + "..."
  }

  const submitForm = async () => {
    if (submittingForm) return

    setSubmittingForm(true)

    try {
      if (!webln) throw new Error("No webln provider")
      if (!nostr) throw new Error("No nostr provider")
      if (!publicKey) throw new Error("No Public Key")
      if (!relay) throw new Error("No relay")

      // ------------------- VALIDATE FORM -------------------------
      const { lud16, cost, preview, content } = formData

      // 1. Check if lud16 is valid (looks like an email)
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
      if (!emailRegex.test(lud16)) throw new Error("Invalid lud16 format")

      // 2. Check if price is valid
      if (!cost || cost < MIN_SAT_COST || cost > MAX_SAT_COST)
        throw new Error(
          `Price should be >= ${MIN_SAT_COST} and <= ${MAX_SAT_COST} sats`
        )
      const unlockCost = cost * 1000

      // 3. Check if preview is valid
      if (
        preview.length > MAX_PREVIEW_LENGTH ||
        preview.length < MIN_PREVIEW_LENGTH
      )
        throw new Error(
          `Preview should be <= 260 chars and >= ${MIN_PREVIEW_LENGTH} chars`
        )

      // 4. Check if content is valid
      if (
        content.length > MAX_CONTENT_LENGTH ||
        content.length < MIN_CONTENT_LENGTH
      )
        throw new Error(
          `Content should be <= ${MAX_CONTENT_LENGTH} chars and >= ${MIN_CONTENT_LENGTH} chars`
        )

      // ------------------- CREATE LOCKED CONTENT -------------------------

      const lockedContent = {
        kind: 1,
        pubkey: publicKey,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content: content,
      }
      const lockedContentVerified = await nostr.signEvent(lockedContent)

      const secret = generatePrivateKey()
      const gatedNote = createGatedNoteUnsigned(
        publicKey,
        secret,
        unlockCost,
        GATE_SERVER,
        lockedContentVerified
      )

      const gatedNoteVerified = await nostr.signEvent(gatedNote)

      const postBody: CreateNotePostBody = {
        gateEvent: gatedNoteVerified,
        lud16: lud16,
        secret: secret,
        cost: unlockCost,
      }

      const response = await fetch(GATE_SERVER + "/create", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(postBody),
      })

      const responseJson = await response.json()
      console.log(responseJson)

      console.log("Publishing Gated Note...")
      await relay.publish(gatedNoteVerified)

      // ------------------- CREATE ANNOUNCEMENT NOTE -------------------------

      const announcementNote = createAnnouncementNoteUnsigned(
        publicKey,
        preview,
        gatedNoteVerified
      )

      console.log("Publishing Announcement Note...")
      const announcementNoteVerified = await nostr.signEvent(announcementNote)
      await relay.publish(announcementNoteVerified)

      // ------------------- ADD NOTE TO EVENTS -------------------------

      console.log("Adding Notes to Events...")
      setAnnouncementNotes([
        eventToAnnouncementNote(announcementNoteVerified),
        ...announcementNotes,
      ])
      setGatedNotes([eventToGatedNote(gatedNoteVerified), ...gatedNotes])
    } catch (e) {
      alert(e)
      console.log(e)
    }

    setSubmittingForm(false)
    setFormData(DEFAULT_FORM_DATA)
    setPostFormOpen(false)
  }

  // ------------------- RENDERERS -------------------------
  const renderHeader = () => {
    return (
      <header className="sticky top-0 z-40 items-center justify-center w-full h-40 text-2xl font-bold text-center backdrop-blur-sm">
        ZAPZ Life
      </header>
    )
  }

  const renderUnlockedContent = (gatedNote: GatedNote, keyNote: KeyNote) => {
    const unlockedNote = unlockGatedNote(
      gatedNote.note,
      keyNote.unlockedSecret as string
    )

    return (
      <div className="mt-5">
        <p>🔓 {unlockedNote.content}</p>
      </div>
    )
  }

  const renderLockedContent = (gatedNote: GatedNote) => {
    return (
      <div className="mt-5">
        <p className="break-words select-none blur-sm">
          {formatGatedContent(gatedNote.note.content)}
        </p>
        <div className="flex justify-center mt-4">
          <AnimatedMenuButton
            onClick={() => {
              handleBuy(gatedNote)
            }}
            label={
              gateLoading && gatedNote.note.id === gateLoading
                ? "Unlocking..."
                : `${(gatedNote.cost / 1000).toFixed(0)} ⚡🔓`
            }
            className={`border border-white/20`}></AnimatedMenuButton>
        </div>
      </div>
    )
  }

  const renderGatedContent = (event: AnnouncementNote) => {
    const gatedNote = gatedNotes.find(
      gatedNote => gatedNote.note.id === event.gate
    )
    const keyNote = keyNotes.find(
      keyNote => keyNote.gate === event.gate && keyNote.unlockedSecret
    )

    if (!gatedNote) return null

    if (keyNote) return renderUnlockedContent(gatedNote, keyNote)

    return renderLockedContent(gatedNote)
  }

  const renderEvents = () => {
    return (
      <div className="w-full space-y-4 md:min-w-[32rem]">
        {announcementNotes.map((event, index) => {
          return (
            <div
              key={index}
              className="flex flex-col px-8 py-4 border rounded-md border-white/20 hover:bg-neutral-900">
              {/* This container ensures content wrapping */}
              <div className="flex-grow overflow-hidden">
                <p className="mb-1 text-xs">ID: {event.note.id}</p>
                <p className="mb-5 text-xs">Author: {event.note.pubkey} </p>

                <h3 className="break-words">{event.note.content}</h3>
              </div>
              {/* Button with a thin white outline */}
              {renderGatedContent(event)}
            </div>
          )
        })}
      </div>
    )
  }

  const renderForm = () => {
    if (!isPostFormOpen) return null

    // const [contentHeight, setContentHeight] = useState("auto")

    return (
      <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-60">
        <div className="w-1/2 p-5 text-white bg-black border rounded-lg shadow-lg border-white/20">
          <h2 className="mb-4 text-lg">Create Gated Post</h2>
          <div className="mt-1 mb-2">
            <label className="block mb-2">Lud16</label>
            <input
              type="email"
              placeholder="coachchuckff@getalby.com"
              value={formData.lud16}
              onChange={e =>
                setFormData({ ...formData, lud16: e.target.value })
              }
              className="w-full p-2 text-white bg-black border rounded border-white/20"
            />
          </div>
          <div className="mt-1 mb-2">
            <label className="block mb-2">Unlock Cost ( sats )</label>
            <input
              type="number"
              min={`${MIN_SAT_COST}`}
              max={`${MAX_SAT_COST}`}
              value={formData.cost}
              onChange={e =>
                setFormData({ ...formData, cost: +e.target.value })
              }
              className="w-full p-2 text-white bg-black border rounded border-white/20"
            />
          </div>
          <div className="mt-1 mb-2">
            <label className="block mb-2">Preview</label>
            <input
              type="text"
              placeholder={`Hey unlock my post for ${formData.cost} sats!`}
              maxLength={MAX_PREVIEW_LENGTH}
              value={formData.preview}
              onChange={e =>
                setFormData({ ...formData, preview: e.target.value })
              }
              className="w-full p-2 text-white bg-black border rounded border-white/20"
            />
          </div>
          <div className="mt-1 mb-2 h-80">
            <label className="block mb-2">Content</label>
            <textarea
              maxLength={MAX_CONTENT_LENGTH}
              placeholder={`This is the content that will be unlocked!`}
              value={formData.content}
              onChange={e =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full h-full p-2 text-white bg-black border rounded resize-none border-white/20"></textarea>
          </div>
          <div className="flex justify-between mt-12">
            <AnimatedMenuButton
              className="font-bold border border-white/20"
              onClick={() => setPostFormOpen(false)}
              label="Close"
            />

            <AnimatedMenuButton
              className="font-bold border border-white/20"
              onClick={submitForm}
              label="Submit"
            />
          </div>
        </div>
      </div>
    )
  }

  const renderPostButton = () => {
    return (
      <div
        className="fixed font-bold text-white border rounded-full shadow-lg bottom-8 right-8 border-white/20 "
        style={{ zIndex: 1000 }}>
        <AnimatedMenuButton
          onClick={() => setPostFormOpen(true)}
          label="POST"
        />
      </div>
    )
  }

  const renderSocials = () => {
    return (
      <div className="fixed z-50 flex flex-col items-center justify-center gap-2 text-center bottom-5 left-5">
        <a
          href="https://github.com/project-excalibur/NIP-108"
          target="_blank"
          rel="noopener noreferrer">
          <FaGithub className="text-white hover:text-gray-400" size={24} />
        </a>
        <a
          href="https://nostrplayground.com"
          target="_blank"
          rel="noopener noreferrer">
          <FaExternalLinkAlt
            className="text-white hover:text-gray-400"
            size={24}
          />
        </a>
      </div>
    )
  }

  const renderUserMenu = () => {
    return (
      <nav className="sticky top-0 flex-col items-start hidden gap-8 p-4 text-xl font-bold md:flex">
        <AnimatedMenuButton label="HOME" />
        <AnimatedMenuButton label="PROFILE" />
        <AnimatedMenuButton label="EXPLORE" />
        <AnimatedMenuButton label="SETTINGS" />
        <AnimatedMenuButton
          className="border border-blue-400"
          onClick={() => setPostFormOpen(true)}
          label="POST"
        />
      </nav>
    )
  }

  const renderSearchBar = () => {
    return (
      <input
        type="text"
        placeholder="search"
        className="sticky top-0 w-full h-4 p-4 bg-transparent border rounded-full outline-none border-white/20"
      />
    )
  }

  const mockTrendingPosts = () => {
    let i = 0
    const elements = []

    while (i < 30) {
      elements.push(
        <div
          key={i}
          className="flex h-16 gap-2 mt-4 p-1 hover:bg-neutral-900 duration-300 rounded">
          <img
            src="https://placebeard.it/640x360"
            className="object-cover w-8 h-8 rounded-full"
            alt=""
          />
          <div className="flex flex-col ">
            <p className="text-sm font-bold">
              User<span className="font-thin"> | 1h ago</span>
            </p>
            <p className="text-xs font-thin line-clamp-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </div>
        </div>
      )

      i++
    }

    return <div>{elements}</div>
  }

  const renderTrending = () => {
    return (
      <div className="flex flex-col sticky top-0">
        <p className="mt-10 sticky-top-0">TRENDING</p>
        <div
          id="trendingPosts"
          className="overflow-scroll h-[400px] mt-4 cursor-pointer">
          {mockTrendingPosts()}
        </div>
      </div>
    )
  }

  const renderMockPosts = () => {
    return (
      <>
        {/* MOCK POSTs */}
        <div className="space-y-4">
          <article className="flex flex-col px-8 py-4 border rounded-md border-white/20">
            {/* This container ensures content wrapping */}
            <div className="flex-grow overflow-hidden">
              <p className="mb-1 text-xs">ID: 123123123</p>
              <p className="mb-5 text-xs">Author: 123123123 </p>

              <h3 className="break-words">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Corrupti, aperiam rem. Molestias, hic recusandae repudiandae
                nisi quisquam ad quod voluptates, fugiat sed, id consequuntur.
                Cum sint maiores fugit aliquid cumque.
              </h3>
            </div>
            {/* Button with a thin white outline */}
          </article>
          <div className="flex flex-col px-8 py-4 border rounded-md border-white/20">
            {/* This container ensures content wrapping */}
            <div className="flex-grow overflow-hidden">
              <p className="mb-1 text-xs">ID: 123123123</p>
              <p className="mb-5 text-xs">Author: 123123123 </p>

              <h3 className="break-words">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Corrupti, aperiam rem. Molestias, hic recusandae repudiandae
                nisi quisquam ad quod voluptates, fugiat sed, id consequuntur.
                Cum sint maiores fugit aliquid cumque.Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Corrupti, aperiam rem. Molestias,
                hic recusandae repudiandae nisi quisquam ad quod voluptates,
                fugiat sed, id consequuntur. Cum sint maiores fugit aliquid
                cumque.Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Corrupti, aperiam rem. Molestias, hic recusandae repudiandae
                nisi quisquam ad quod voluptates, fugiat sed, id consequuntur.
                Cum sint maiores fugit aliquid cumque.Lorem ipsum dolor sit amet
                consectetur adipisicing elit. Corrupti, aperiam rem. Molestias,
                hic recusandae repudiandae nisi quisquam ad quod voluptates,
                fugiat sed, id consequuntur. Cum sint maiores fugit aliquid
                cumque.
              </h3>
            </div>
            {/* Button with a thin white outline */}
          </div>
          <div className="flex flex-col px-8 py-4 border rounded-md border-white/20">
            {/* This container ensures content wrapping */}
            <div className="flex-grow overflow-hidden">
              <p className="mb-1 text-xs">ID: 123123123</p>
              <p className="mb-5 text-xs">Author: 123123123 </p>

              <h3 className="break-words">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Corrupti, aperiam rem. Molestias, hic recusandae repudiandae
                nisi quisquam ad quod voluptates, fugiat sed, id consequuntur.
                Cum sint maiores fugit aliquid cumque. Lorem ipsum dolor sit
                amet consectetur adipisicing elit. Corrupti, aperiam rem.
                Molestias, hic recusandae repudiandae nisi quisquam ad quod
                voluptates, fugiat sed, id consequuntur. Cum sint maiores fugit
                aliquid cumque.Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Corrupti, aperiam rem. Molestias, hic
                recusandae repudiandae nisi quisquam ad quod voluptates, fugiat
                sed, id consequuntur. Cum sint maiores fugit aliquid
                cumque.Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Corrupti, aperiam rem. Molestias, hic recusandae repudiandae
                nisi quisquam ad quod voluptates, fugiat sed, id consequuntur.
                Cum sint maiores fugit aliquid cumque.
              </h3>
            </div>
            {/* Button with a thin white outline */}
          </div>
          <div className="flex flex-col px-8 py-4 border rounded-md border-white/20">
            {/* This container ensures content wrapping */}
            <div className="flex-grow overflow-hidden">
              <p className="mb-1 text-xs">ID: 123123123</p>
              <p className="mb-5 text-xs">Author: 123123123 </p>

              <h3 className="break-words">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Corrupti, aperiam rem. Molestias, hic recusandae repudiandae
                nisi quisquam ad quod voluptates, fugiat sed, id consequuntur.
                Cum sint maiores fugit aliquid cumque.
              </h3>
            </div>
            {/* Button with a thin white outline */}
          </div>
          <div className="flex flex-col px-8 py-4 border rounded-md border-white/20">
            {/* This container ensures content wrapping */}
            <div className="flex-grow overflow-hidden">
              <p className="mb-1 text-xs">ID: 123123123</p>
              <p className="mb-5 text-xs">Author: 123123123 </p>

              <h3 className="break-words">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Corrupti, aperiam rem. Molestias, hic recusandae repudiandae
                nisi quisquam ad quod voluptates, fugiat sed, id consequuntur.
                Cum sint maiores fugit aliquid cumque.
              </h3>
            </div>
            {/* Button with a thin white outline */}
          </div>
        </div>
        {/* MOCK POSTs */}
      </>
    )
  }

  const renderProfile = () => {
    const profileHeader = () => {
      return (
        <div className="p-2">
          <img
            className="absolute z-40 object-cover w-40 h-40 border rounded-full border-white/20 -top-1/2"
            src="https://placebeard.it/640x360"
            alt=""
          />
          <div className="flex justify-end w-full gap-2 mt-2">
            <AnimatedMenuButton className="" label="edit profile" />
            <AnimatedMenuButton label="follow" />
          </div>
          <div className="flex flex-col mt-10">
            <div className="flex items-center">
              <p className="font-bold">
                Nostr ✅
                <span className="ml-4 text-xs font-thin text-neutral-500 py-1 px-2 bg-neutral-900 rounded-full">
                  follows you
                </span>
              </p>
              <p className="ml-auto text-xs text-neutral-500">
                Joined Nostr on Jan 1, 2023
              </p>
            </div>
            <p className="font-extralight mt-2 text-xs text-neutral-500">
              nostr@nostrsomething.com
            </p>
            <p className="font-extralight mt-2 text-sm text-neutral-500">
              npub12m2hhug6a4..05wqku5wx6
            </p>
          </div>
        </div>
      )
    }
    return (
      <div className="relative flex flex-col w-full h-40 mt-40 mb-8">
        {profileHeader()}
      </div>
    )
  }

  // ------------------- MAIN -------------------------

  return (
    <>
      {renderForm()}

      <div className="flex justify-center w-full relative">
        <div className="sticky top">{renderUserMenu()}</div>
        <main className="items-center w-full md:min-w-[32rem] max-w-md min-h-screen mb-10 md:max-w-xl">
          {/* {renderHeader()} */}
          {renderProfile()}
          {renderEvents()}
          {/* {renderMockPosts()} */}
        </main>

        <div>
          <aside className="sticky py-4 top-0 hidden ml-8 w-80 lg:flex lg:flex-col ">
            {renderSearchBar()}
            {renderTrending()}
          </aside>
        </div>
      </div>
    </>
  )
}
