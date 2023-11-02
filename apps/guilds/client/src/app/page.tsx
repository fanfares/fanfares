"use client";

import { Event as NostrEvent } from "nostr-tools";
import {
  FaCopy,
  FaCheck,
  FaLockOpen,
  FaHome,
  FaUserAlt,
  FaCompass,
  FaAt,
  FaSearch,
  FaEnvelope,
} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiPencilAlt } from "react-icons/hi";
import { AiFillThunderbolt } from "react-icons/ai";
import { ChangeEvent, useState } from "react";
import {
  AnnouncementNote,
  GatedNote,
  KeyNote,
  NIP_108_KINDS,
  eventToAnnouncementNote,
  unlockGatedNote,
} from "nip108";
import AnimatedMenuButton from "@/components/AnimatedButton";
import ButtonDefault from "@/components/Button";
import { useExcalibur } from "@/components/ExcaliburProvider";
import { getDefaultNostrProfile, getDisplayName } from "utils";
import { RenderContent } from "@/components/RenderContent";

const GATE_SERVER = "https://api.nostrplayground.com";

const MIN_PREVIEW_LENGTH = 1;
const MAX_PREVIEW_LENGTH = 240;

const MIN_CONTENT_LENGTH = 1;
const MAX_CONTENT_LENGTH = 3400;

const MIN_SAT_COST = 1;
const MAX_SAT_COST = 50_000;

interface FormData {
  cost: string;
  preview: string;
  content: string;
}

const DEFAULT_FORM_DATA: FormData = {
  cost: "1",
  preview: "",
  content: "",
};

enum FeedType {
  Live = "Live",
  Following = "Following",
}

export default function Home() {
  // ------------------- STATES -------------------------
  const [isPostFormOpen, setPostFormOpen] = useState<boolean>(false);
  const [editProfileOn, setEditProfileOn] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>(DEFAULT_FORM_DATA);

  const {
    events,
    followingEvents,

    profiles,
    gatedNotes,
    unlockedKeyNotes,

    isPosting,
    isBuying,

    postNote,
    postGatedNote,
    buyKey,

    redactTeamKeys,
  } = useExcalibur();

  const [isPostingGatedContent, setIsPostingGatedContent] =
    useState<boolean>(false);
  const [feedType, setFeedType] = useState<FeedType>(FeedType.Live);

  // ------------------- FUNCTIONS -------------------------

  const formatGatedContent = (content: string) => {
    return content.substring(0, 500) + "...";
  };

  const handlePost = async () => {
    if (isPosting) return;

    try {
      if (isPostingGatedContent) await submitGatedForm();
      else await submitNoteForm();

      setFormData(DEFAULT_FORM_DATA);
    } catch (error) {
      console.log(error);
    } finally {
      setPostFormOpen(false);
    }
  };

  const submitNoteForm = async () => {
    const { content } = formData;

    if (!content) {
      alert("Please set some content");
      return;
    }

    postNote(content);
  };

  const submitGatedForm = async () => {
    const { cost, preview, content } = formData;

    const sats = Number(cost);
    if (!cost || !sats) {
      alert("Please set a cost");
      return;
    }
    if (!preview) {
      alert("Please set a preview");
      return;
    }
    if (!content) {
      alert("Please set some content");
      return;
    }

    //TODO validate form data

    postGatedNote(sats, preview, content);
  };

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setIsPostingGatedContent(checked);
  };

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
    );
  };

  const renderSwitch = () => {
    return (
      <div className="w-full space-y-4 md:min-w-[32rem] mb-5">
        <div className="flex flex-row justify-center gap-8 lg:items-center lg:gap-4">
          <button
            onClick={() => setFeedType(FeedType.Live)}
            className={`${
              feedType === FeedType.Live ? "font-bold bg-neutral-500 px-4 " : ""
            }px-4 py-1 rounded-full`}
          >
            {FeedType.Live}
          </button>
          <button
            onClick={() => setFeedType(FeedType.Following)}
            className={`${
              feedType === FeedType.Following ? "font-bold bg-neutral-500 " : ""
            } px-4 py-1 rounded-full`}
          >
            {FeedType.Following}
          </button>
        </div>
      </div>
    );
  };

  const renderUnlockedContent = (
    announcementNote: AnnouncementNote,
    gatedNote: GatedNote,
    keyNote: KeyNote
  ) => {
    const unlockedNote = unlockGatedNote(
      gatedNote.note,
      keyNote.unlockedSecret as string
    );

    const profile =
      profiles[gatedNote.note.pubkey] ??
      getDefaultNostrProfile(gatedNote.note.pubkey);
    const name = getDisplayName(profile);

    return (
      <div
        key={gatedNote.note.id}
        className="flex flex-col border rounded-md border-white/20 p-4"
      >
        {/* This container ensures content wrapping */}
        <div className="flex gap-2">
          <img
            src={profile.picture}
            alt={profile.display_name}
            className="object-fill rounded-full min-w-[48px] w-12 h-12"
          />
          <div className="flex flex-col max-w-sm md:max-w-md ">
            {" "}
            <p className="mb-5 text-xs font-bold">{name}</p>
            <h3 className="pr-8 mb-3 break-words">
              🔓{announcementNote.note.content}🔓
            </h3>
            <h3 className="pr-8 break-words ">{unlockedNote.content}</h3>
          </div>
        </div>
      </div>
    );
  };

  const renderLockedContent = (
    announcementNote: AnnouncementNote,
    gatedNote: GatedNote
  ) => {
    const profile =
      profiles[gatedNote.note.pubkey] ??
      getDefaultNostrProfile(gatedNote.note.pubkey);
    const name = getDisplayName(profile);

    return (
      <div
        key={gatedNote.note.id}
        className="flex flex-col border rounded-md border-white/20 p-4"
      >
        {/* This container ensures content wrapping */}
        <div className="flex gap-2">
          <img
            src={profile.picture}
            alt={profile.display_name}
            className="object-fill rounded-full min-w-[48px] w-12 h-12"
          />
          <div className="flex flex-col max-w-sm md:max-w-md">
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
            onClick={() => buyKey(gatedNote.note.id)}
            icon={
              <>
                <AiFillThunderbolt />
                <FaLockOpen />
              </>
            }
            label={
              isBuying && isBuying === gatedNote.note.id
                ? "Unlocking..."
                : `${(gatedNote.cost / 1000).toFixed(0)}`
            }
            className={`border border-white/20`}
          ></ButtonDefault>
        </div>
      </div>
    );
  };

  const renderGatedContent = (announcementEvent: NostrEvent) => {
    const event = eventToAnnouncementNote(announcementEvent);
    const gatedNote = gatedNotes[event.gate];
    const keyNote = unlockedKeyNotes[event.gate];
    if (!gatedNote) return null;

    if (keyNote) return renderUnlockedContent(event, gatedNote, keyNote);

    return renderLockedContent(event, gatedNote);
  };

  const renderNote = (event: NostrEvent) => {
    const profile =
      profiles[event.pubkey] ?? getDefaultNostrProfile(event.pubkey);
    const name = getDisplayName(profile);

    return (
      <div
        key={event.id}
        className="flex flex-col p-4 border rounded-md border-white/20"
      >
        {/* This container ensures content wrapping */}
        <div className="flex gap-2">
          <img
            src={profile.picture}
            alt={profile.display_name}
            className="object-fill rounded-full min-w-[48px] w-12 h-12"
          />

          <div className="flex flex-col max-w-sm md:max-w-md lg:max-w-lg">
            <p className="mb-5 text-xs font-bold">{name}</p>
            <RenderContent rawContent={event.content} />
            {/* <h3 className="pr-8 break-words ">{event.content}</h3> */}
          </div>
        </div>
      </div>
    );
  };

  const renderEvents = () => {
    return (
      <div className="w-full space-y-4 md:min-w-[32rem]">
        {(feedType === FeedType.Live ? events : followingEvents).map(
          (event) => {
            if (event.kind === NIP_108_KINDS.announcement) {
              return renderGatedContent(event);
            }

            return renderNote(event);
          }
        )}
      </div>
    );
  };

  const renderForm = () => {
    // todo make it as a component to be reused both by pressing the Left post button and on Top header.

    return (
      <div className="flex items-center justify-center w-full my-4 bg-black ">
        <div className="w-full p-5 text-white bg-black border rounded-lg shadow-lg border-white/20">
          {isPostingGatedContent ? (
            <>
              {" "}
              <div className="mt-1 mb-2">
                <label className="block mb-2">Post preview</label>
                <input
                  type="text"
                  placeholder={`Hey unlock my post for ${formData.cost} sats!`}
                  maxLength={MAX_PREVIEW_LENGTH}
                  value={formData.preview}
                  onChange={(e) =>
                    setFormData({ ...formData, preview: e.target.value })
                  }
                  className="w-full p-2 text-white bg-black border rounded border-white/20"
                />
              </div>
              <div className="mt-1 mb-2">
                <label className="block mb-2">Unlock Cost ( sats )</label>
                <input
                  type="text" // change to text input
                  inputMode="numeric" // enables number keyboard on mobile devices
                  pattern="[0-9]*" // allows only numbers as input
                  value={formData.cost}
                  onChange={(e) => {
                    const newCost = e.target.value;

                    // Allow only empty string or numbers
                    if (newCost === "" || !isNaN(+newCost)) {
                      setFormData({ ...formData, cost: newCost });
                    }
                  }}
                  className="w-full p-2 text-white bg-black border rounded border-white/20"
                />
              </div>
            </>
          ) : null}
          <div className="h-20 mt-1 mb-2">
            <label className="hidden mb-2">Content</label>
            <textarea
              maxLength={MAX_CONTENT_LENGTH}
              placeholder={isPostingGatedContent ? `This is the content that will be unlocked!` : `What is going on?`}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full h-full p-2 text-white bg-black border rounded resize-none border-white/20"
            ></textarea>
          </div>
          <div className="flex items-center justify-between mt-12">
            <label
              htmlFor="setAsGatedContentCheckbox"
              className="relative inline-flex items-center px-4 py-2 border rounded-full cursor-pointer border-white/20"
            >
              <input
                checked={isPostingGatedContent}
                onChange={handleCheckboxChange}
                type="checkbox"
                value=""
                name="setAsGatedContentCheckbox"
                id="setAsGatedContentCheckbox"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-4 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              <span className="ml-3 text-sm font-medium dark:text-gray-300">
                Paid content?
              </span>
            </label>

            <ButtonDefault
              className="font-bold border border-white/20"
              onClick={handlePost}
              label={isPosting ? "Working" : "Submit"}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderFormModal = () => {
    // todo make it as a component to be reused both by pressing the Left post button and on Top header.
    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target;
      setIsPostingGatedContent(checked);
    };

    if (!isPostFormOpen) return null;

    return (
      <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-screen h-screen bg-black/20 backdrop-blur-md md:border-white ">
        <div className="md:w-1/2 md:min-w-[36rem] absolute md:h-fit md:inset-x-0 md:inset-y-0 md:translate-x-1/2 md:translate-y-1/2 p-5 md:border md:rounded-md text-white bg-black border rounded-lg shadow-lg border-white/20">
          {isPostingGatedContent ? (
            <>
              {" "}
              <div className="mt-1 mb-2">
                <label className="block mb-2">Post preview</label>
                <input
                  type="text"
                  placeholder={`Hey unlock my post for ${formData.cost} sats!`}
                  maxLength={MAX_PREVIEW_LENGTH}
                  value={formData.preview}
                  onChange={(e) =>
                    setFormData({ ...formData, preview: e.target.value })
                  }
                  className="w-full p-2 text-white bg-black border rounded border-white/20"
                />
              </div>
              <div className="mt-1 mb-2">
                <label className="block mb-2">Unlock Cost ( sats )</label>
                <input
                  type="text" // change to text input
                  inputMode="numeric" // enables number keyboard on mobile devices
                  pattern="[0-9]*" // allows only numbers as input
                  value={formData.cost}
                  onChange={(e) => {
                    const newCost = e.target.value;

                    // Allow only empty string or numbers
                    if (newCost === "" || !isNaN(+newCost)) {
                      setFormData({ ...formData, cost: newCost });
                    }
                  }}
                  className="w-full p-2 text-white bg-black border rounded border-white/20"
                />
              </div>
            </>
          ) : null}
          <div className="h-20 mt-1 mb-2">
            <label className="hidden mb-2">Content</label>
            <textarea
              maxLength={MAX_CONTENT_LENGTH}
              placeholder={isPostingGatedContent ? `This is the content that will be unlocked!` : `What is going on?`}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="w-full h-full p-2 text-white bg-black border rounded resize-none border-white/20"
            ></textarea>
          </div>
          <div className="flex items-center justify-between mt-12">
            <label
              htmlFor="setAsGatedContentCheckbox"
              className="relative inline-flex items-center px-4 py-2 border rounded-full cursor-pointer border-white/20"
            >
              <input
                checked={isPostingGatedContent}
                onChange={handleCheckboxChange}
                type="checkbox"
                value=""
                name="setAsGatedContentCheckbox"
                id="setAsGatedContentCheckbox"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-4 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
              <span className="ml-3 text-sm font-medium dark:text-gray-300">
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
              onClick={handlePost}
              label={isPosting ? "Working" : "Submit"}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderEditProfile = () => {
    if (!editProfileOn) return null;

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
              className="w-full h-full p-2 text-white bg-black border rounded resize-none border-white/20"
            ></textarea>
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
    );
  };

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

          <AnimatedMenuButton
            className="border border-blue-400"
            onClick={() => setPostFormOpen(true)}
            label="POST"
            icon={<HiPencilAlt size={24} />}
          />
        </nav>
      </>
    );
  };

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
    );
  };

  const mockTrendingPosts = () => {
    return (
      <div>
        {redactTeamKeys.map((pubkey) => {
          const profile = profiles[pubkey] ?? getDefaultNostrProfile(pubkey);
          const name = getDisplayName(profile);

          return (
            <div
              key={pubkey}
              className="flex h-16 gap-2 p-1 mt-4 duration-300 rounded hover:bg-neutral-900"
            >
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
          );
        })}
      </div>
    );
  };

  const renderTrending = () => {
    return (
      <div className="sticky top-0 flex flex-col">
        <p className="mt-10 sticky-top-0">TRENDING</p>
        <div
          id="trendingPosts"
          className="overflow-scroll h-[400px] mt-4 cursor-pointer"
        >
          {mockTrendingPosts()}
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    return (
      <div className="relative flex flex-col w-full h-40 mt-40 mb-12">
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
      </div>
    );
  };

  const renderMobileMenu = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
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
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
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
    );
  };

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
  );
}
