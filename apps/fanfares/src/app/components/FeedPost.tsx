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
import { NostrProfile } from "utils";
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
        <Button
          className="px-2 w-28"
          id="e2e-feed-post-zap-button"
          label={"Zap ⚡️"}
          onClick={() => setFutureFeatureModalOn(!futureFeatureModalOn)}

          // onClick={() => setZapModalOn(!zapModalOn)}
        />
      </div>
    </div>
  );
}
