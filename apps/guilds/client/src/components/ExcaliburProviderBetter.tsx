import {
  Event as NostrEvent,
  SimplePool,
} from "nostr-tools";
import { NIP07, NostrProfile, eventToNostrProfile } from "utils";
import { WebLNProvider, requestProvider } from "webln";
import {
  ReactNode,
  createContext,
  useCallback,
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
  events: NostrEvent[];
  followingEvents: NostrEvent[];
  profiles: {
    [pubkey: string]: NostrProfile;
  };
  gatedNotes: {
    [id: string]: GatedNote;
  };
  keyNotes: {
    [gateId: string]: KeyNote;
  };

  postNote: (event: NostrEvent<number>) => Promise<void>;
  postGatedNote: (event: NostrEvent<number>) => Promise<void>;
  buyKey: (gateId: string) => Promise<void>;

  redactTeamKeys: string[];
};

const DEFAULT_EVENT: ExcaliburContext = {
  events: [],
  followingEvents: [],
  profiles: {},
  gatedNotes: {},
  keyNotes: {},

  postNote: (event: NostrEvent<number>) => Promise.resolve(),
  postGatedNote: (event: NostrEvent<number>) => Promise.resolve(),
  buyKey: (gateId: string) => Promise.resolve(),

  redactTeamKeys: TEAM_KEYS,
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
  const [kind3, setKind3] = useState<NostrEvent<3> | null>(null);

  const [pool, setPool] = useState<SimplePool | null>(null);

  const [events, setEvents] = useState<NostrEvent[]>([]);
  const [followingEvents, setFollowingEvents] = useState<NostrEvent[]>([]);

  const [profiles, setProfiles] = useState<{ [pubkey: string]: NostrProfile }>(
    {}
  );
  const [gatedNotes, setGatedNotes] = useState<{ [gateId: string]: GatedNote }>(
    {}
  );
  const [keyNotes, setKeyNotes] = useState<{ [gateId: string]: KeyNote }>({});
  const [unlockedKeyNotes, setUnlockedKeyNotes] = useState<{
    [gateId: string]: KeyNote;
  }>({});

  const [badEvents, setBadEvents] = useState<{ [id: string]: boolean }>({});


  // ---------------- FUNCTIONS -----------------------

  const grabAndAddProfile = useCallback(
    async (pubkey: string, relays: string[] = POOL_RELAYS) => {
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
            return {
              ...prevProfiles,
              [pubkey]: profile,
            };
          });
        });
    },
    [pool]
  );

  const grabAndAddGate = useCallback((
    announcementEvent: NostrEvent,
    relays: string[] = POOL_RELAYS
  )=>{
    if (!pool) return;

    const announcement = eventToAnnouncementNote(announcementEvent);
    if (!announcement.gate) return;

    const gatedNote = gatedNotes[announcement.gate];
    if (gatedNote) return;

    if(badEvents[announcement.gate]) return;

    pool
      .get(relays, {
        ids: [announcement.gate],
      })
      .then((gatedNoteRaw) => {
        if (!gatedNoteRaw) {
          setBadEvents((prev) => {
            return {
              ...prev,
              [announcement.gate]: true,
            };
          });
          return;
        }

        const gatedNote = eventToGatedNote(gatedNoteRaw);
        setGatedNotes((prev) => {
          return {
            ...prev,
            [announcement.gate]: gatedNote,
          };
        });
      });

  }, [pool])

  const insertAndSortNotes = useCallback((newNote: NostrEvent, notes: NostrEvent[], sliceAmount: number = MAX_SHOW): NostrEvent[] => {
    if (notes.find((e) => e.id === newNote.id)) return notes;
    if (!newNote.content) return notes;

    const newNotes = [newNote as any, ...notes.slice(0, sliceAmount)];
    const sortedNotes = newNotes.sort((a, b) => b.created_at - a.created_at);
    return sortedNotes;
  }, []);

  const unlockAll = useCallback(async (keysToUnlock: {[gateId: string]: KeyNote}, unlockedKeys: {[gateId: string]: KeyNote}, gatedNotes: {[gateId: string]: GatedNote}) => {
    if(!nostr) return;

    const keyNotes = Object.values(keysToUnlock);

    for(const keyNote of keyNotes){
      if(unlockedKeys[keyNote.gate]) continue;

      const gatedNote = gatedNotes[keyNote.gate];
      if(!gatedNote) continue;

      const unlockedSecret = await (nostr as any).nip04.decrypt(
        gatedNote.note.pubkey,
        keyNote.note.content
      );

      keyNote.unlockedSecret = unlockedSecret;

      setUnlockedKeyNotes((prev) => {
        return {
          ...prev,
          [keyNote.gate]: {
            ...keyNote,
          }
        }
      });
    }
  },[nostr])

  // ---------------- EFFECTS --------------------------

  // SETUP POOL AND LOAD INITIAL EVENTS
  useEffect(() => {
    const pool = new SimplePool();
    const sub = pool.sub(POOL_RELAYS, [
      {
        kinds: [1, NIP_108_KINDS.announcement],
        limit: STARTING_LOAD,
      },
    ]);

    sub.on("event", (event) => {
      setEvents((prevEvents) => {return insertAndSortNotes(event, prevEvents)});
    });

    setPool(pool);

    return () => {
      try {
        sub.unsub();
        pool.close(POOL_RELAYS);
      } catch (e) {
        console.error(e);
      }
    };
  }, []);

  // Initial Loads
  useEffect(() => {
    if(!pool) return;
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
  }, [pool]);

  // Load User Information
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

  // Load Following Notes and Key Notes
  useEffect(() => {
    if (!kind3) return;
    if (!pool) return;

    const following = [];
    for (const tag of kind3.tags) {
      if (tag[0] === "p" && tag[1]) {
        following.push(tag[1]);
      }
    }

    const followingNoteSub = pool.sub(POOL_RELAYS, [
      {
        kinds: [1, NIP_108_KINDS.announcement],
        authors: [kind3.pubkey, ...following],
        limit: MAX_SHOW_FOLLOWING,
      },
    ]);

    followingNoteSub.on("event", (event) => {
      setFollowingEvents((prevEvents) => {
        return insertAndSortNotes(event, prevEvents, MAX_SHOW_FOLLOWING);
      });
    });

    const keySub = pool.sub(POOL_RELAYS, [
      {
        kinds: [NIP_108_KINDS.key],
        authors: [kind3.pubkey],
      },
    ]);

    keySub.on("event", (event) => {
      setKeyNotes((prevEvents) => {
        const keyNote = eventToKeyNote(event);
        if(!keyNote.gate) return prevEvents;
        if(keyNotes[keyNote.gate]) return prevEvents;

        return {
          ...prevEvents,
          [keyNote.gate]: keyNote,
        };
      });
    });

    return () => {
      try {
        followingNoteSub.unsub();
        keySub.unsub();
        pool.close(POOL_RELAYS);
      } catch (e) {
        console.error(e);
      }
    };
  }, [kind3, pool]);

  // UPDATES ON EVENTS
  useEffect(() => {
    if (!pool) return;

    for (const event of events) {
      if(profiles[event.pubkey]) continue;
      grabAndAddProfile(event.pubkey);

      if (event.kind === NIP_108_KINDS.announcement) {
        grabAndAddGate(event, POOL_RELAYS);
      }
    }
  }, [events, pool]);

  // UPDATES ON FOLLOWER EVENTS
  useEffect(() => {
    if (!pool) return;

    for (const event of followingEvents) {
      if(profiles[event.pubkey]) continue;
      grabAndAddProfile(event.pubkey);

      if (event.kind === NIP_108_KINDS.announcement) {
        grabAndAddGate(event, POOL_RELAYS);
      }
    }
  }, [followingEvents, pool]);

  useEffect(() => {
    if (!nostr) return;

    unlockAll(keyNotes, unlockedKeyNotes, gatedNotes);

  }, [nostr, keyNotes, gatedNotes]);

  // ---------------- DATA ----------------------------

  const postNote = useCallback(async (event: NostrEvent<number>)=>{
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
  },[nostr, pool, isLoading]);

  const excalibur = {
    events,
    followingEvents,

    profiles,
    gatedNotes,
    keyNotes,

    postNote,
    postGatedNote: (event: NostrEvent<number>) => Promise.resolve(),
    buyKey: (gateId: string) => Promise.resolve(),

    redactTeamKeys: TEAM_KEYS,
  };

  return (
    <ExcaliburContext.Provider value={excalibur}>
      {children}
    </ExcaliburContext.Provider>
  );
}
