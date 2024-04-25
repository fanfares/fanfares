import Image from "next/image";
import Link from "next/link";
import { Event as NostrEvent } from "nostr-tools";
import Button from "./Button";
import { useState } from "react";
import { Modal } from "./Modal";
import { RenderContent } from "./RenderContent";
import ModalZap from "./ModalZap";
import ModalFutureFeature from "./ModalFutureFeature";
import { useRouter } from "next/navigation";
import { NostrProfile, getInvoice, getLud16Url } from "utils";
import { bech32 } from "bech32";
import { NostrPostStats } from "../controllers/primal/primalHelpers";

interface FeedPostProps {
  note: NostrEvent<1>;
  profile: NostrProfile;
  stats?: NostrPostStats;
}

export function FeedPost(props: FeedPostProps) {
  const { note, profile, stats } = props;
  const router = useRouter();
  // const [fanfaresButtonMessage, setFanfaresButtonMessage] = useState(false)
  // const [zapButtonMessage, setZapButtonMessage] = useState(false)
  const [futureFeatureModalOn, setFutureFeatureModalOn] = useState(false);

  const goToProfilePage = () => {
    router.push(`/p/${note.pubkey}`);
  };

  const goToNotePage = () => {
    router.push(`/e/${note.id}`);
  };

  const zap = async () => {
    // examining note's props/tags
    console.log('zap: note', note);
    // HOW TO ZAP
    // check for zap tag
    // if no zap tag, use lud16
    if (!profile.lud16) {
      return;
    }

    const zapTag = note.tags.find((tag) => tag[0] === "zap");
    const lud16 = zapTag && typeof zapTag === 'object' && zapTag.length >= 2 ? zapTag[1] : profile.lud16
    let lud16Url = null

    try {
      lud16Url = getLud16Url(lud16)
    } catch (e) {
      console.warn(e)
    }

    if (!lud16Url) {
      return;
    }

    // send GET to lud16Url
    const response = await fetch(lud16Url, {
      method: "GET",
    });

    if (!response.ok) {
      console.error('zap: error', await response.json())
      return;
    }

    const sendDetails = await response.json()
    console.log('zap: response', sendDetails)

    // check allowNostr key for true
    if (!sendDetails.allowNostr) {
      return;
    }
    // check that nostrPubkey exists and is a valid BIP 340 pubkey in hex
    if (!sendDetails.nostrPubkey || !/^[0-9a-fA-F]{64}$/.test(sendDetails.nostrPubkey)) {
      return;
    }

    // create 9734 zap requset event (step 3 https://github.com/nostr-protocol/nips/blob/master/57.md#protocol-flow)
import { bech32 } from 'bech32';

const words = bech32.toWords(Buffer.from('hello world', 'utf8'));
const encoded = bech32.encode('bech32', words);

console.log(encoded); // Outputs: bech321qpz4nc4pe
    const lnurl = bech32(sendDetails.callback)
    const zapRequest = {
      kind: 9734,
      content: "",
      tags: [
        ["relays", /* TODO grab relays from zustand */ 'wss://relay.primal.net'],
        ["amount", "55000"],
        ["lnurl", sendDetails.callback],
        ["p", sendDetails.nostrPubkey],
        ["e", note.id],
      ],
      pubkey: /* current user's pubkey */null,
      created_at: Math.floor((+new Date()) / 1000),
    }

    // get the event id

    // sign it

    // send via GET to callback URL

  }

  return (
    <div
      id="e2e-feed-post-container"
      className="border-buttonAccent w-full max-w-lg lg:max-w-2xl rounded-md flex relative border pl-16 pr-4 py-3 flex-col mx-auto md:mx-0"
    >
      <div className="w-12 h-12 absolute left-2 top-2 group">
        <img
          onClick={goToProfilePage}
          src={profile?.picture ?? "http://placebeard.it/640/480.jpg"}
          className="w-full h-full border-2 border-buttonAccent object-cover rounded-full group-hover:border-buttonAccentHover"
          alt="Profile Image"
        />
      </div>
      <div className="flex-grow overflow-hidden space-y-1">
        <p onClick={goToProfilePage} className="text-sm font-bold">
          {profile?.name}{" "}
          <Link
            href="#"
            className="text-white/50 font-medium hover:text-buttonAccentHover"
          >
            {profile?.lud16}
          </Link>
        </p>
        <RenderContent rawContent={note.content ?? ""} />
        {/* <h3 className="break-words text-sm font-normal">{parseContent(content ?? '')}</h3> */}
        {/* <h3 className="break-words text-sm font-normal">{JSON.stringify(note)}</h3> */}
      </div>
      <ModalFutureFeature
        isOpen={futureFeatureModalOn}
        onClick={() => setFutureFeatureModalOn(!futureFeatureModalOn)}
      />
      {/* <ModalFanfare
        isOpen={fanfaresButtonMessage}
        onClick={() => setFanfaresButtonMessage(!fanfaresButtonMessage)}
      />

      <ModalZap
        isOpen={zapButtonMessage}
        onClick={() => setZapButtonMessage(false)}
      /> */}

      <div className="mt-5 mx-auto flex gap-4">
        <Button
          className="px-2 w-28"
          id="e2e-feed-post-fanfare-button"
          label={"Fanfare 🎪"}
          onClick={() => setFutureFeatureModalOn(!futureFeatureModalOn)}
        />
        { profile.lud16 ? 
          <Button
            className="px-2 w-28"
            id="e2e-feed-post-zap-button"
            label={"Zap ⚡️"}
            onClick={() => zap()}
            // onClick={() => setZapModalOn(!zapModalOn)}
          />
          : <Button disabled={true} label={"Can't zap!"}></Button> }
      </div>
    </div>
  );
}
