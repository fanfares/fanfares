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
  FaPlus,
  FaMinus,
  FaSearch,
  FaEnvelope,
  FaHamburger,
} from "react-icons/fa"
import { GiHamburgerMenu } from "react-icons/gi"
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
import ButtonDefault from "@/components/Button"
import { useExcalibur } from "@/components/ExcaliburProvider"
import {
  getDefaultNostrProfile,
  getDisplayName,
  getTag,
  verifyZap,
} from "utils"
import Image from "next/image"

const GATE_SERVER = "https://api.nostrplayground.com"

const MIN_PREVIEW_LENGTH = 1
const MAX_PREVIEW_LENGTH = 240

const MIN_CONTENT_LENGTH = 1
const MAX_CONTENT_LENGTH = 3400

const MIN_SAT_COST = 1
const MAX_SAT_COST = 50_000

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

enum FeedType {
  Live = "Live",
  Following = "Following",
}

export default function Home() {
  // ------------------- STATES -------------------------

  const [gateLoading, setGateLoading] = useState<string | null>()

  const [submittingForm, setSubmittingForm] = useState<boolean>(false)
  const [isPostFormOpen, setPostFormOpen] = useState<boolean>(false)
  const [editProfileOn, setEditProfileOn] = useState<boolean>(false)

  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA)
  const {
    events,
    profiles,
    postEvent,
    teamKeys,
    followingEvents,
    gatedNotes,
    keyNotes,
    setKeyNotes,
    pool,
    relays,
    publicKey,
    nostr,
    webln,
  } = useExcalibur()

  const [isChecked, setIsChecked] = useState<boolean>(false)
  const [feedType, setFeedType] = useState<FeedType>(FeedType.Live)

  // ------------------- EFFECTS -------------------------

  const handleBuy = async (gatedNote: GatedNote) => {
    if (gateLoading) return

    setGateLoading(gatedNote.note.id)

    try {
      if (!webln) throw new Error("No webln provider")
      if (!nostr) throw new Error("No nostr provider")
      if (!publicKey) throw new Error("No Public Key")
      if (!pool) throw new Error("No pool")
      if (!relays) throw new Error("No relays")

      const uri = `${gatedNote.endpoint}/${gatedNote.note.id}`
      const invoiceResponse = await fetch(uri)
      const invoiceResponseJson = (await invoiceResponse.json()) as PREntry

      await webln.sendPayment(invoiceResponseJson.pr)

      const resultResponse = await fetch(invoiceResponseJson.successAction.url)
      const resultResponseJson = await resultResponse.json()
      const secret = resultResponseJson.secret

      const content = await (nostr as any).nip04.encrypt(
        gatedNote.note.pubkey,
        secret
      )

      const keyEvent = {
        kind: NIP_108_KINDS.key,
        pubkey: publicKey,
        created_at: Math.floor(Date.now() / 1000),
        tags: [["e", gatedNote.note.id]],
        content: content,
      }

      const keyEventVerified = await (nostr as any).signEvent(keyEvent)

      await pool.publish(relays, keyEventVerified)

      const keyNoteUnlocked = {
        ...eventToKeyNote(keyEventVerified),
        unlockedSecret: secret,
      } as KeyNote
      setKeyNotes([...keyNotes, keyNoteUnlocked])
    } catch (e) {
      console.log(e)
      alert(e)
    }

    setGateLoading(null)
  }

  const formatGatedContent = (content: string) => {
    return content.substring(0, 500) + "..."
  }

  const submitSimpleForm = async () => {
    const { content } = formData

    if (!content) return
    if (!publicKey) return

    const event = {
      kind: 1,
      pubkey: publicKey,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: content,
    }

    postEvent(event as any)
  }

  const submitForm = async () => {
    if (submittingForm) return

    setSubmittingForm(true)

    try {
      if (!webln) throw new Error("No webln provider")
      if (!nostr) throw new Error("No nostr provider")
      if (!publicKey) throw new Error("No Public Key")
      if (!pool) throw new Error("No pool")

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

      const lockedContentVerified = await (nostr as any).signEvent(
        lockedContent
      )

      const secret = generatePrivateKey()
      const gatedNote = createGatedNoteUnsigned(
        publicKey,
        secret,
        unlockCost,
        GATE_SERVER,
        lockedContentVerified
      )

      const gatedNoteVerified = await (nostr as any).signEvent(gatedNote)

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

      await pool.publish(relays, gatedNoteVerified)

      // ------------------- CREATE ANNOUNCEMENT NOTE -------------------------

      const announcementNote = createAnnouncementNoteUnsigned(
        publicKey,
        preview,
        gatedNoteVerified
      )

      const announcementNoteVerified = await (nostr as any).signEvent(
        announcementNote
      )
      await pool.publish(relays, announcementNoteVerified)

      // ------------------- ADD NOTE TO EVENTS -------------------------
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
      <div className="relative flex flex-col items-center w-full h-20">
        <div className="relative w-32 h-20">
          <img
            src="https://shdw-drive.genesysgo.net/DYTesEgJE5YAHBZxRFMe9xENR1xEVuczhD4HqvWf2yfo/ZapsLogo.png"
            alt="Zaps⚡️Back"
          />
        </div>
        <p className="mt-auto text-sm font-normal">( Alpha )</p>
      </div>
    )
  }

  const renderSwitch = () => {
    return (
      <div className="w-full space-y-4 md:min-w-[32rem] mb-5">
        <div className="flex flex-row justify-center gap-8 lg:items-center lg:gap-4">
          <button
            onClick={() => setFeedType(FeedType.Live)}
            className={`${
              feedType === FeedType.Live ? "font-bold bg-neutral-500 px-4 " : ""
            }px-4 py-1 rounded-full`}>
            {FeedType.Live}
          </button>
          <button
            onClick={() => setFeedType(FeedType.Following)}
            className={`${
              feedType === FeedType.Following ? "font-bold bg-neutral-500 " : ""
            } px-4 py-1 rounded-full`}>
            {FeedType.Following}
          </button>
        </div>
      </div>
    )
  }

  const renderUnlockedContent = (
    announcementNote: AnnouncementNote,
    gatedNote: GatedNote,
    keyNote: KeyNote
  ) => {
    const unlockedNote = unlockGatedNote(
      gatedNote.note,
      keyNote.unlockedSecret as string
    )

    const profileIndex = profiles.findIndex(
      profile => profile.pubkey === gatedNote.note.pubkey
    )

    const profile =
      profileIndex === -1
        ? getDefaultNostrProfile(gatedNote.note.pubkey)
        : profiles[profileIndex]
    const name = getDisplayName(profile)

    return (
      <div
        key={gatedNote.note.id}
        className="flex flex-col p-4 border rounded-md border-white/20">
        {/* This container ensures content wrapping */}
        <div className="flex w-full overflow-hidden">
          <img
            src={profile.picture}
            alt={profile.display_name}
            className="object-cover w-12 h-12 mr-4 rounded-full" // Adjust width (w-12) and height (h-12) as needed
          />
          <div className="flex flex-col w-full">
            <p className="mb-5 text-xs font-bold">{name}</p>
            <h3 className="pr-8 mb-3 break-words">
              🔓{announcementNote.note.content}🔓
            </h3>
            <h3 className="pr-8 break-words ">{unlockedNote.content}</h3>
          </div>
        </div>
      </div>
    )
  }

  const renderLockedContent = (
    announcementNote: AnnouncementNote,
    gatedNote: GatedNote
  ) => {
    const profileIndex = profiles.findIndex(
      profile => profile.pubkey === gatedNote.note.pubkey
    )

    const profile =
      profileIndex === -1
        ? getDefaultNostrProfile(gatedNote.note.pubkey)
        : profiles[profileIndex]
    const name = getDisplayName(profile)

    return (
      <div
        key={gatedNote.note.id}
        className="flex flex-col p-4 border rounded-md border-white/20">
        {/* This container ensures content wrapping */}
        <div className="flex w-full overflow-hidden">
          <img
            src={profile.picture}
            alt={profile.display_name}
            className="object-cover w-12 h-12 mr-4 rounded-full" // Adjust width (w-12) and height (h-12) as needed
          />
          <div className="flex flex-col w-full">
            <p className="mb-5 text-xs font-bold">{name}</p>
            <h3 className="pr-8 mb-3 break-words">
              🔓{announcementNote.note.content}🔓
            </h3>
            <p className="break-words select-none blur-sm">
              {formatGatedContent(gatedNote.note.content)}
            </p>
          </div>
        </div>
        <div className="flex mx-auto mt-4">
          <ButtonDefault
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
            className={`border border-white/20`}></ButtonDefault>
        </div>
      </div>
    )
  }

  const renderGatedContent = (announcementEvent: VerifiedEvent) => {
    const event = eventToAnnouncementNote(announcementEvent)
    const gatedNote = gatedNotes.find(
      gatedNote => gatedNote.note.id === event.gate
    )
    const keyNote = keyNotes.find(
      keyNote => keyNote.gate === event.gate && keyNote.unlockedSecret
    )

    if (!gatedNote) return null

    if (keyNote) return renderUnlockedContent(event, gatedNote, keyNote)

    return renderLockedContent(event, gatedNote)
  }

  const renderNote = (event: VerifiedEvent) => {
    const profileIndex = profiles.findIndex(
      profile => profile.pubkey === event.pubkey
    )

    const profile =
      profileIndex === -1
        ? getDefaultNostrProfile(event.pubkey)
        : profiles[profileIndex]
    const name = getDisplayName(profile)

    return (
      <div
        key={event.id}
        className="flex flex-col p-4 border rounded-md border-white/20">
        {/* This container ensures content wrapping */}
        <div className="flex w-full overflow-hidden">
          <img
            src={profile.picture}
            alt={profile.display_name}
            className="object-cover w-12 h-12 mr-4 rounded-full" // Adjust width (w-12) and height (h-12) as needed
          />
          <div className="flex flex-col w-full">
            <p className="mb-5 text-xs font-bold">{name}</p>
            <h3 className="pr-8 break-words ">{event.content}</h3>
          </div>
        </div>
      </div>
    )
  }

  const renderEvents = () => {
    return (
      <div className="w-full space-y-4 md:min-w-[32rem]">
        {(feedType === FeedType.Live ? events : followingEvents).map(
          (event, index) => {
            if (event.kind === NIP_108_KINDS.announcement) {
              return renderGatedContent(event)
            }

            return renderNote(event)
          }
        )}
      </div>
    )
  }

  const renderForm = () => {
    // todo make it as a component to be reused both by pressing the Left post button and on Top header.
    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target
      setIsChecked(checked)
    }

    return (
      <div className="flex items-center justify-center w-full my-4 bg-black ">
        <div className="w-full p-5 text-white bg-black border rounded-lg shadow-lg border-white/20">
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
          <div className="h-20 mt-1 mb-2">
            <label className="hidden mb-2">Content</label>
            <textarea
              maxLength={MAX_CONTENT_LENGTH}
              placeholder={`What is going on?`}
              onChange={e =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full h-full p-2 text-white bg-black border rounded resize-none border-white/20"></textarea>
          </div>
          <div className="flex items-center justify-between mt-12">
            <label
              htmlFor="setAsGatedContentCheckbox"
              className="relative inline-flex items-center px-4 py-2 border rounded-full cursor-pointer border-white/20">
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

            <ButtonDefault
              className="font-bold border border-white/20"
              onClick={isChecked ? submitForm : submitSimpleForm}
              label="Submit"
            />
          </div>
        </div>
      </div>
    )
  }

  const renderFormModal = () => {
    // todo make it as a component to be reused both by pressing the Left post button and on Top header.
    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target
      setIsChecked(checked)
    }

    if (!isPostFormOpen) return null

    return (
      <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-black/20 backdrop-blur-md md:border-white ">
        <div className="md:w-1/2 md:min-w-[36rem] absolute md:h-fit md:inset-x-0 md:inset-y-0 md:translate-x-1/2 md:translate-y-1/2 p-5 md:border md:rounded-md text-white bg-black border rounded-lg shadow-lg border-white/20">
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
          <div className="h-20 mt-1 mb-2">
            <label className="hidden mb-2">Content</label>
            <textarea
              maxLength={MAX_CONTENT_LENGTH}
              placeholder={`What is going on?`}
              onChange={e =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full h-full p-2 text-white bg-black border rounded resize-none border-white/20"></textarea>
          </div>
          <div className="flex items-center justify-between mt-12">
            <label
              htmlFor="setAsGatedContentCheckbox"
              className="relative inline-flex items-center px-4 py-2 border rounded-full cursor-pointer border-white/20">
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

            <ButtonDefault
              className="font-bold border border-white/20"
              onClick={() => setPostFormOpen(false)}
              label="Cancel"
            />
            <ButtonDefault
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
        <div className="w-1/2 max-w-xl p-5 text-white bg-black border rounded-lg shadow-lg border-white/20">
          <h2 className="mb-4 text-lg">Edit profile</h2>
          <div className="flex flex-col justify-between lg:flex-row lg:items-center lg:gap-4">
            <label className="relative flex flex-col w-full gap-2 mb-2">
              <span className="text-white">Username</span>
              <input
                type="text"
                placeholder="Username"
                className="w-full p-2 pl-8 text-white bg-black border rounded border-white/20"
              />
              <FaAt className="absolute top-11 left-3 text-neutral-500" />
            </label>
            <label className="flex flex-col w-full gap-2 mb-2">
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
            <ButtonDefault
              className="font-bold border border-white/20"
              label="Save"
            />

            <ButtonDefault
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
          {/* <p className="hidden mx-auto text-xs font-thin text-">Version 0.0.1</p> */}
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
          className="sticky top-0 w-full h-10 p-4 pl-12 bg-transparent border rounded-full outline-none border-white/20"
        />
        <FaSearch className="absolute text-white top-3 left-4" />
      </div>
    )
  }

  const mockTrendingPosts = () => {
    return (
      <div>
        {teamKeys.map((pubkey, index) => {
          const profileIndex = profiles.findIndex(profile => {
            return profile.pubkey === pubkey
          })

          if (profileIndex === -1) return null
          const profile = profiles[profileIndex]
          const name = getDisplayName(profile)

          return (
            <div
              key={pubkey}
              className="flex h-16 gap-2 p-1 mt-4 duration-300 rounded hover:bg-neutral-900">
              <img
                src={profile.picture}
                className="object-cover w-8 h-8 rounded-full"
                alt={name}
              />
              <div className="flex flex-col ">
                <p className="text-sm font-bold">
                  {name}
                  <span className="font-thin"> | 1h ago</span>
                </p>
                <p className="text-xs font-thin line-clamp-2">
                  {profile.about.substring(0, 50)}...
                </p>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  const renderTrending = () => {
    return (
      <div className="sticky top-0 flex flex-col">
        <p className="mt-10 sticky-top-0">TRENDING</p>
        <div
          id="trendingPosts"
          className="overflow-scroll h-[400px] mt-4 cursor-pointer">
          {mockTrendingPosts()}
        </div>
      </div>
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
            <ButtonDefault
              onClick={() => setEditProfileOn(true)}
              className=""
              label="edit profile"
            />
            <ButtonDefault label="follow" />
          </div>
          <div className="flex flex-col mt-16 lg:mt-12">
            <div className="flex items-center">
              <p className="flex items-center gap-2 font-bold">
                Nostr{" "}
                <FaCheck
                  className="p-1 text-green-500 bg-white rounded-full"
                  size={24}
                />
                <span className="px-2 py-1 ml-4 text-xs font-thin rounded-full text-neutral-500 bg-neutral-900">
                  follows you
                </span>
              </p>
              <p className="ml-auto text-xs text-neutral-500">
                Joined Nostr on Jan 1, 2023
              </p>
            </div>
            <p className="mt-2 text-xs font-extralight text-neutral-500">
              nostr@nostrsomething.com
            </p>
            <p className="flex items-center gap-2 mt-2 text-sm cursor-pointer font-extralight text-neutral-500 hover:text-white">
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
      <div className="fixed top-0 z-10 flex items-center justify-center w-full pb-2 bg-black md:hidden">
        <div className="relative w-32 h-20">
          <img
            src="https://shdw-drive.genesysgo.net/DYTesEgJE5YAHBZxRFMe9xENR1xEVuczhD4HqvWf2yfo/ZapsLogo.png"
            alt="Zaps⚡️Back"
          />
        </div>
        <button
          className="fixed z-20 right-5 top-4"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <GiHamburgerMenu size={32} />
        </button>
        {mobileMenuOpen ? (
          <div className="fixed top-0 left-0 flex flex-col items-center justify-center w-screen h-screen bg-black/60 backdrop-blur-sm">
            <div className="flex flex-col gap-4 mt-10">
              <AnimatedMenuButton
                mobile
                className="text-4xl"
                label="HOME"
                icon={<FaHome size={32} />}
              />
              <AnimatedMenuButton
                mobile
                className="text-4xl"
                label="EXPLORE"
                icon={<FaCompass size={32} />}
              />
              <AnimatedMenuButton
                mobile
                className="text-4xl"
                label="PROFILE"
                icon={<FaUserAlt size={32} />}
              />
              <AnimatedMenuButton
                mobile
                className="text-4xl"
                label="MESSAGES"
                icon={<FaEnvelope size={32} />}
              />
              <AnimatedMenuButton
                mobile
                onClick={() => setPostFormOpen(true)}
                className="text-4xl"
                label="POST"
                icon={<HiPencilAlt size={32} />}
              />
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  const renderZapModal = () => {
    return (
      <>
        <div></div>
      </>
    )
  }

  // ------------------- MAIN -------------------------

  return (
    <>
      {renderFormModal()}
      {renderEditProfile()}
      {renderMobileMenu()}

      <div className="relative flex justify-center w-full mt-16 md:mt-0">
        <div className="sticky top">{renderUserMenu()}</div>
        <main className="items-center w-full md:min-w-[32rem] max-w-md min-h-screen mb-10 md:max-w-xl">
          {renderForm()}
          {/* {renderProfile()} */}
          {renderSwitch()}
          {renderEvents()}
        </main>

        <div>
          <aside className="sticky top-0 hidden py-4 ml-8 w-80 lg:flex lg:flex-col ">
            {renderSearchBar()}
            {/* TO DO OUR PROFILES INSTEAD TRENDING */}
            {renderTrending()}
          </aside>
        </div>
      </div>
    </>
  )
}
