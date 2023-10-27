"use client"

import {
  Relay,
  relayInit,
  VerifiedEvent,
  generatePrivateKey,
} from "nostr-tools"
import {
  FaGithub,
  FaExternalLinkAlt,
  FaCopy,
  FaCheck,
  FaLock,
  FaLockOpen,
  FaHome,
  FaUserAlt,
  FaCompass,
  FaCog,
  FaAt,
  FaSearch,
  FaEnvelope,
} from "react-icons/fa"
import { HiPencilAlt } from "react-icons/hi"
import { AiFillThunderbolt } from "react-icons/ai"
import { ChangeEvent, useEffect, useState } from "react"
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
import { useExcalibur } from "@/components/ExcaliburProvider"
import { getTag, verifyZap } from "utils"

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
  const [editProfileOn, setEditProfileOn] = useState<boolean>(false)

  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA)
  const { events } = useExcalibur();

  const [isChecked, setIsChecked] = useState<boolean>(false)

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
    const newRelay = relayInit("wss://relay.primal.net")
    newRelay.on("connect", () => {
      setRelay(newRelay)
    })
    // newRelay.connect()
    if (newRelay) {
      newRelay.connect()
    }

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
  const renderLogo = () => {
    return (
      <header className="items-center justify-center w-full text-2xl font-bold text-center backdrop-blur-sm">
        ZAPS Back{" "}
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
        <p className="flex gap-2 items-center">
          <FaLockOpen className="" /> {unlockedNote.content}
        </p>
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
          <Button
            onClick={() => {
              handleBuy(gatedNote)
            }}
            icon={
              <>
                <AiFillThunderbolt />
                <FaLockOpen />
              </>
            }
            label={
              gateLoading && gatedNote.note.id === gateLoading
                ? "Unlocking..."
                : `${(gatedNote.cost / 1000).toFixed(0)}`
            }
            className={`border border-white/20`}></Button>
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
        {events.map((event, index) => {
          return (
            <div
              key={event.id}
              className="flex flex-col px-8 py-4 border rounded-md border-white/20">
              {/* This container ensures content wrapping */}
              <div className="flex-grow overflow-hidden">
                <p className="mb-1 text-xs">ID: {event.id}</p>
                <p className="mb-5 text-xs">Author: {event.pubkey} </p>
                <h3 className="break-words">{event.content}</h3>
              </div>
            </div>
          )
        })}
      </div>
    );
    // return (
    //   <div className="w-full space-y-4 md:min-w-[32rem]">
    //     {announcementNotes.map((event, index) => {
    //       return (
    //         <div
    //           key={index}
    //           className="flex flex-col px-8 py-4 border rounded-md border-white/20">
    //           {/* This container ensures content wrapping */}
    //           <div className="flex-grow overflow-hidden">
    //             <p className="mb-1 text-xs">ID: {event.note.id}</p>
    //             <p className="mb-5 text-xs">Author: {event.note.pubkey} </p>

    //             <h3 className="break-words">{event.note.content}</h3>
    //           </div>
    //           {/* Button with a thin white outline */}
    //           {renderGatedContent(event)}
    //         </div>
    //       )
    //     })}
    //   </div>
    // )
  }

  const renderForm = () => {
    // todo make it as a component to be reused both by pressing the Left post button and on Top header.
    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target
      setIsChecked(checked)
    }

    return (
      <div className="flex items-center justify-center w-full bg-black my-4 ">
        <div className="w-full p-5 text-white bg-black border rounded-lg shadow-lg border-white/20">
          <div className="mt-1 mb-2 hidden">
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
          {isChecked ? (
            <>
              {" "}
              <div className="mt-1 mb-2">
                <label className="block mb-2">Post preview</label>
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
            </>
          ) : null}
          <div className="mt-1 mb-2 h-20">
            <label className="mb-2 hidden">Content</label>
            <textarea
              maxLength={MAX_CONTENT_LENGTH}
              placeholder={`What is going on?`}
              onChange={e =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full h-full p-2 text-white bg-black border rounded resize-none border-white/20"></textarea>
          </div>
          <div className="flex justify-between mt-12 items-center">
            <label
              htmlFor="setAsGatedContentCheckbox"
              className="relative inline-flex items-center cursor-pointer px-4 border border-white/20 py-2 rounded-full">
              <input
                checked={isChecked}
                onChange={handleCheckboxChange}
                type="checkbox"
                value=""
                name="setAsGatedContentCheckbox"
                id="setAsGatedContentCheckbox"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-4 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                Paid content?
              </span>
            </label>

            <Button
              className="font-bold border border-white/20"
              onClick={submitForm}
              label="Submit"
            />
          </div>
        </div>
      </div>
    )
  }

  const renderFormModal = () => {
    // todo make it as a component to be reused both by pressing the Left post button and on Top header.
    if (!isPostFormOpen) return null

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
            <Button
              className="font-bold border border-white/20"
              onClick={() => setPostFormOpen(false)}
              label="Close"
            />

            <Button
              className="font-bold border border-white/20"
              onClick={submitForm}
              label="Submit"
            />
          </div>
        </div>
      </div>
    )
  }

  const renderEditProfile = () => {
    if (!editProfileOn) return null

    return (
      <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-60 ">
        <div className="w-1/2  max-w-xl p-5 text-white bg-black border rounded-lg shadow-lg border-white/20">
          <h2 className="mb-4 text-lg">Edit profile</h2>
          <div className="flex flex-col lg:flex-row lg:items-center lg:gap-4 justify-between">
            <label className="flex flex-col gap-2 mb-2 w-full relative">
              <span className="text-white">Username</span>
              <input
                type="text"
                placeholder="Username"
                className="w-full p-2 text-white bg-black border rounded border-white/20 pl-8"
              />
              <FaAt className="absolute top-11 left-3 text-neutral-500" />
            </label>
            <label className="flex flex-col gap-2 mb-2 w-full">
              <span className="text-white">Display Name</span>
              <input
                type="text"
                placeholder="Display Name"
                className="w-full p-2 text-white bg-black border rounded border-white/20"
              />
            </label>
          </div>

          <div className="mt-1 mb-2">
            <label className="block mb-2">Lightning Address</label>
            <input
              type="email"
              placeholder="email@email.com"
              className="w-full p-2 text-white bg-black border rounded border-white/20"
            />
          </div>
          <div className="mt-1 mb-2 h-80">
            <label className="block mb-2">About me</label>
            <textarea
              placeholder={`Say something about you`}
              className="w-full h-full p-2 text-white bg-black border rounded resize-none border-white/20"></textarea>
          </div>
          <div className="flex justify-between mt-12">
            <Button className="font-bold border border-white/20" label="Save" />

            <Button
              className="font-bold border border-white/20"
              onClick={() => setEditProfileOn(false)}
              label="Cancel"
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
      <>
        <nav className="sticky top-0 flex-col items-start hidden gap-8 p-4 text-xl font-bold md:flex">
          {renderLogo()}
          <AnimatedMenuButton label="HOME" icon={<FaHome size={24} />} />
          <AnimatedMenuButton label="EXPLORE" icon={<FaCompass size={24} />} />
          <AnimatedMenuButton label="PROFILE" icon={<FaUserAlt size={24} />} />
          <AnimatedMenuButton
            label="MESSAGES"
            icon={<FaEnvelope size={24} />}
          />
          {/* 
        Div with a bubble absolute
        <AnimatedMenuButton
        label="NOTIFICATIONS"
        icon={<FaEnvelope size={24} />}
      /> */}

          <AnimatedMenuButton
            className="border border-blue-400"
            onClick={() => setPostFormOpen(true)}
            label="POST"
            icon={<HiPencilAlt size={24} />}
          />
          {/* <p className="text-xs mx-auto font-thin text- hidden">Version 0.0.1</p> */}
        </nav>
      </>
    )
  }

  const renderSearchBar = () => {
    return (
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          className="sticky top-0 w-full h-10 p-4 bg-transparent border rounded-full outline-none border-white/20 pl-12"
        />
        <FaSearch className="absolute top-3 left-4 text-white" />
      </div>
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
            <Button
              onClick={() => setEditProfileOn(true)}
              className=""
              label="edit profile"
            />
            <Button label="follow" />
          </div>
          <div className="flex flex-col mt-16 lg:mt-12">
            <div className="flex items-center">
              <p className="font-bold flex gap-2 items-center">
                Nostr{" "}
                <FaCheck
                  className="text-green-500 bg-white rounded-full p-1"
                  size={24}
                />
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
            <p className="font-extralight mt-2 text-sm text-neutral-500 flex gap-2 items-center hover:text-white cursor-pointer">
              npub12m2hhug6a4..05wqku5wx6 <FaCopy />
            </p>
          </div>
        </div>
      )
    }
    return (
      <div className="relative flex flex-col w-full h-40 mt-40 mb-12">
        {profileHeader()}
      </div>
    )
  }

  const renderMobileMenu = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
    return (
      <div className="absolute top-5 right-5">
        <button
          className="bg-neutral-500 w-8 h-8 px-2 py-2 rounded-full flex items-center"
          onClick={() => setMobileMenuOpen(mobileMenuOpen)}>
          +
        </button>
      </div>
    )
  }

  // ------------------- MAIN -------------------------

  return (
    <>
      {renderFormModal()}
      {renderEditProfile()}

      <div className="flex justify-center w-full relative">
        <div className="sticky top">{renderUserMenu()}</div>
        <main className="items-center w-full mt-20 md:min-w-[32rem] max-w-md min-h-screen mb-10 md:max-w-xl">
          {renderForm()}
          {renderMobileMenu()}
          {/* {renderProfile()} */}
          {renderEvents()}
          {renderMockPosts()}
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
