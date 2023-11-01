import {
  Relay,
  VerifiedEvent,
  Event as NostrEvent,
  SimplePool,
} from "nostr-tools";
import { NIP07, NostrProfile, eventToNostrProfile } from "utils";
import { WebLNProvider, requestProvider } from "webln";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  GatedNote,
  KeyNote,
  NIP_108_KINDS,
  eventToAnnouncementNote,
  eventToGatedNote,
  eventToKeyNote,
} from "nip108";

const STARTING_LOAD = 1;
const MAX_SHOW = 89;
const MAX_SHOW_FOLLOWING = 20;

const POOL_RELAYS = [
  "wss://relay.primal.net",
  "wss://relay.damus.io",
  "wss://dev.nostrplayground.com",
  // "wss://cache2.primal.net/v1",
  // "wss://nostr.kollider.xyz/",
  // "wss://nostr.wine/",
  // "wss://nos.lol/",
  // "wss://welcome.nostr.wine/",
  // "wss://nostr-relay.nokotaro.com/",
  // "wss://relayable.org/",
];

const TEAM_KEYS = [
  "db625e7637543ca7d7be65025834db318a0c7b75b0e23d4fb9e39229f5ba6fa7", // Simon
  "c291d8d18aea2e879c09017e2f9f603d03d7eb6e787d23520bacf927c8b1323f", // Coach
  "56d57bf11aed78a989a7f042a786e1f09c83b1e8360b0462cbf1377454657d1c", // Wemerson
];

export type ExcaliburContext = {
  events: VerifiedEvent[];
  followingEvents: VerifiedEvent[];
  profiles: NostrProfile[];
  gatedNotes: GatedNote[];
  keyNotes: KeyNote[];
  setKeyNotes: (keyNotes: KeyNote[]) => void;
  isLoading: boolean;
  teamKeys: string[];
  relays: string[];
  pool: SimplePool | null;
  publicKey: string | null,
  webln: WebLNProvider | null,
  nostr: NIP07 | null,

  postEvent: (event: NostrEvent<number>) => Promise<void>;
};

const DEFAULT_EVENT: ExcaliburContext = {
  events: [],
  followingEvents: [],
  profiles: [],
  gatedNotes: [],
  keyNotes: [],
  isLoading: false,
  postEvent: () => Promise.resolve(),
  setKeyNotes: () => {},
  teamKeys: TEAM_KEYS,
  relays: POOL_RELAYS,
  pool: null,
  publicKey: null,
  webln: null,
  nostr: null,
};
const ExcaliburContext = createContext<ExcaliburContext>(DEFAULT_EVENT);
export const useExcalibur = () => useContext(ExcaliburContext);

export function ExcaliburProvider(props: { children: ReactNode }) {
  const { children } = props;

  // ---------------- STATES --------------------------

  const [isLoading, setIsLoading] = useState(false);
  const [nostr, setNostr] = useState<NIP07 | null>(null);
  const [webln, setWebln] = useState<WebLNProvider | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [pool, setPool] = useState<SimplePool | null>(null);
  const [gatedNotes, setGatedNotes] = useState<GatedNote[]>([]);
  const [keyNotes, setKeyNotes] = useState<KeyNote[]>([]);
  const [unlockedKeyNotes, setUnlockedKeyNotes] = useState<KeyNote[]>([]);
  const [events, setEvents] = useState<VerifiedEvent[]>([]);
  const [badEvents, setBadEvents] = useState<string[]>([]);
  const [followingEvents, setFollowingEvents] = useState<VerifiedEvent[]>([]);
  const [profiles, setProfiles] = useState<NostrProfile[]>([]);
  const [kind3, setKind3] = useState<NostrEvent<3> | null>(null);

  const grabAndAddProfile = async (pubkey: string, relays: string [] = POOL_RELAYS) => {
    if (!pool) return;

    pool
      .get(relays, {
        kinds: [0],
        authors: [pubkey],
      })
      .then((kind0) => {
        if (!kind0) return;
        const profile = eventToNostrProfile(pubkey, kind0);
        setProfiles((prevProfiles) => {
          return [profile, ...prevProfiles];
        });
      });
  };

  const grabAndAddGate = async (event: VerifiedEvent, relays: string[] = POOL_RELAYS) => {
    if (!pool) return;

    const announcement = eventToAnnouncementNote(event);
    if (!announcement.gate) return;

    if (gatedNotes.find((g) => g.note.id === announcement.gate)) return;
    if (badEvents.find((e) => e === announcement.gate)) return;

    pool
      .get(relays, {
        ids: [announcement.gate],
      })
      .then((gatedNoteRaw) => {
        if (!gatedNoteRaw){
          setBadEvents((prev) => {
            return [announcement.gate, ...prev];
          })
          return;
        }
        const gatedNote = eventToGatedNote(gatedNoteRaw as any);
        setGatedNotes((prev) => {
          return [gatedNote, ...prev];
        });
      });
  };

  // ---------------- EFFECTS --------------------------

  useEffect(() => {
    const pool = new SimplePool();
    const sub = pool.sub(POOL_RELAYS, [
      {
        kinds: [1, NIP_108_KINDS.announcement],
        limit: STARTING_LOAD,
      },
    ]);

    sub.on("event", (event) => {
      setEvents((prevEvents) => {
        if (prevEvents.find((e) => e.id === event.id)) return prevEvents;
        if (!event.content) return prevEvents;
        return [event as any, ...prevEvents.slice(0, MAX_SHOW)].sort((a, b) => b.created_at - a.created_at);
        // return [event as any, ...prevEvents.slice(0, MAX_SHOW)];
      });
    });

    setPool(pool);

    return () => {
      sub.unsub();
      pool.close(POOL_RELAYS);
    };
  }, []);

  useEffect(() => {
    if (pool) {
      // Team
      TEAM_KEYS.forEach((key) => {
        grabAndAddProfile(key);
      });

      // WebLN
      requestProvider()
        .then(setWebln)
        .catch((e) => {
          alert("Please download Alby or ZBD to use this app.");
        });

      // Nostr
      if ((window as any).nostr) {
        const nip07: NIP07 = (window as any).nostr;
        nip07.getPublicKey().then(setPublicKey);
        setNostr(nip07);
      } else {
        alert("Nostr not found");
      }
    }
  }, [pool]);

  useEffect(() => {
    if (!publicKey) return;
    if (!pool) return;

    grabAndAddProfile(publicKey, POOL_RELAYS);

    pool
      .get(POOL_RELAYS, {
        kinds: [3],
        authors: [publicKey],
      })
      .then(setKind3);
  }, [publicKey, pool]);

  useEffect(() => {
    if (!kind3) return;
    if (!pool) return;

    const following = [];
    const relays = [...POOL_RELAYS]; // Does not work right now
    for (const tag of kind3.tags) {
      if (tag[0] === "p" && tag[1]) {
        following.push(tag[1]);
      }
    }

    const noteSub = pool.sub(relays, [
      {
        kinds: [1, NIP_108_KINDS.announcement],
        // authors: [kind3.pubkey],
        authors: [kind3.pubkey, ...following],
        limit: MAX_SHOW_FOLLOWING,
      },
    ]);

    noteSub.on("event", (event) => {
      setFollowingEvents((prevEvents) => {
        if (prevEvents.find((e) => e.id === event.id)) return prevEvents;
        if (!event.content) return prevEvents;

        return [event as any, ...prevEvents.slice(0, MAX_SHOW)].sort((a, b) => b.created_at - a.created_at);
        // return [event as any, ...prevEvents.slice(0, MAX_SHOW), ];
      });
    });

    const keySub = pool.sub(relays, [
      {
        kinds: [NIP_108_KINDS.key],
        authors: [kind3.pubkey],
      },
    ]);

    keySub.on("event", (event) => {
      setKeyNotes((prevEvents) => {
        if (prevEvents.find((k) => k.note.id === event.id)) return prevEvents;

        console.log("key event", event.id);
        return [eventToKeyNote(event as any), ...prevEvents];
      });
    });

    return () => {
      noteSub.unsub();
      keySub.unsub();
      pool.close(relays);
    };
  }, [kind3, pool]);

  useEffect(() => {
    if (!pool) return;

    const allEvents = [...events, ...followingEvents];

    for (const event of allEvents) {
      if (!profiles.find((profile) => profile.pubkey === event.pubkey)) {
        grabAndAddProfile(event.pubkey);
      }

      if (event.kind === NIP_108_KINDS.announcement) {
        grabAndAddGate(event, POOL_RELAYS);
      }
    }
  }, [events, followingEvents, pool]);

  useEffect(() => {
    if(!nostr) return;

    const unlockNotes = async () => {
      for (const keyNote of keyNotes) {
        if(unlockedKeyNotes.find((k) => k.note.id === keyNote.note.id)) continue;
        const gatedNote = gatedNotes.find((g) => g.note.id === keyNote.gate);
        if(!gatedNote) continue;

        const unlockedSecret = await (nostr as any).nip04.decrypt(
          gatedNote.note.pubkey,
          keyNote.note.content
        );

        setUnlockedKeyNotes((prev) => {
          return [
            {
              ...keyNote,
              unlockedSecret,
            },
            ...prev
          ]
        });
      }
    };
    unlockNotes();
  }, [nostr, keyNotes, gatedNotes])

  // ---------------- DATA ----------------------------

  const postEvent = async (event: NostrEvent<number>) => {
    if (!nostr) throw new Error("No nostr");
    if (!pool) throw new Error("No pool");
    if (isLoading) return;

    let errorString: string | undefined = undefined;

    setIsLoading(true);
    try {
      const signedEvent = await nostr.signEvent(event);
      await pool.publish(POOL_RELAYS, signedEvent);
    } catch (e) {
      errorString = `Error signing event: ${e}`;
    } finally {
      setIsLoading(false);
    }

    if (errorString) throw new Error(errorString);
  };

  const excalibur = {
    events,
    profiles,
    isLoading,
    postEvent,
    gatedNotes,
    keyNotes: unlockedKeyNotes,
    setKeyNotes,
    followingEvents,
    teamKeys: TEAM_KEYS,
    relays: POOL_RELAYS,
    pool,
    publicKey,
    webln,
    nostr,
  };

  return (
    <ExcaliburContext.Provider value={excalibur}>
      {children}
    </ExcaliburContext.Provider>
  );
}
