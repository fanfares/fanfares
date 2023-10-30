import {
  Relay,
  relayInit,
  VerifiedEvent,
  generatePrivateKey,
  Event as NostrEvent,
  UnsignedEvent,
  SimplePool,
} from "nostr-tools";
import { NIP07, NostrProfile, eventToNostrProfile, verifyZap } from "utils";
import { WebLNProvider, requestProvider } from "webln";
import { getSince } from "utils";
import {
  ReactNode,
  createContext,
  use,
  useContext,
  useEffect,
  useState,
} from "react";
import { set } from "firebase/database";

const STARTING_LOAD = 1;
const MAX_SHOW = 89;
const MAX_SHOW_FOLLOWING = 20;

const EXCALIBUR_RELAY = process.env.NEXT_PUBLIC_NOSTR_RELAY as string;
const POOL_RELAYS = [
  EXCALIBUR_RELAY,
  "wss://relay.primal.net",
  "wss://relay.damus.io",
  "wss://cache2.primal.net/v1",
  "wss://nostr.kollider.xyz/",
  "wss://nostr.wine/",
  "wss://nos.lol/",
  "wss://welcome.nostr.wine/",
  "wss://nostr-relay.nokotaro.com/",
  "wss://relayable.org/",
];

const TEAM_KEYS = [
  'db625e7637543ca7d7be65025834db318a0c7b75b0e23d4fb9e39229f5ba6fa7', // Simon
  'c291d8d18aea2e879c09017e2f9f603d03d7eb6e787d23520bacf927c8b1323f', // Coach
  '56d57bf11aed78a989a7f042a786e1f09c83b1e8360b0462cbf1377454657d1c', // Wemerson
];

export type ExcaliburContext = {
  events: VerifiedEvent[];
  followingEvents: VerifiedEvent[];
  profiles: NostrProfile[];
  postEvent: (event: NostrEvent<number>) => Promise<void>;
  isLoading: boolean;
  teamKeys: string[];
  relays: string[];
};

const DEFAULT_EVENT: ExcaliburContext = {
  events: [],
  followingEvents: [],
  profiles: [],
  isLoading: false,
  postEvent: () => Promise.resolve(),
  teamKeys: TEAM_KEYS,
  relays: POOL_RELAYS,
};
const ExcaliburContext = createContext<ExcaliburContext>(DEFAULT_EVENT);
export const useExcalibur = () => useContext(ExcaliburContext);

export function ExcaliburProvider(props: { children: ReactNode }) {
  const { children } = props;

  // ---------------- STATES --------------------------

  const [isLoading, setIsLoading] = useState(false);
  const [relay, setRelay] = useState<Relay | null>(null);
  const [nostr, setNostr] = useState<NIP07 | null>(null);
  const [webln, setWebln] = useState<WebLNProvider | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [pool, setPool] = useState<SimplePool | null>(null);
  const [events, setEvents] = useState<VerifiedEvent[]>([]);
  const [followingEvents, setFollowingEvents] = useState<VerifiedEvent[]>([]);
  const [profiles, setProfiles] = useState<NostrProfile[]>([]);
  const [kind3, setKind3] = useState<NostrEvent<3> | null>(null);

  const grabAndAddProfile = async (pubkey: string) => {
    if(!pool) return;

    pool
    .get(POOL_RELAYS, {
      kinds: [0],
      authors: [pubkey],
    })
    .then((kind0) => {
      if(!kind0) return;
      const profile = eventToNostrProfile(pubkey, kind0);
      setProfiles((prevProfiles) => {
        return [profile, ...prevProfiles];
      });
    });
  }

  // ---------------- EFFECTS --------------------------

  useEffect(() => {
    const pool = new SimplePool();
    const sub = pool.sub(POOL_RELAYS, [
      {
        kinds: [1],
        // since: getSince({ days: 30 })
        limit: STARTING_LOAD,
      },
    ]);

    sub.on("event", (event) => {
      setEvents((prevEvents) => {
        if (prevEvents.find((e) => e.id === event.id)) return prevEvents;
        if (!event.content) return prevEvents;

        return [event as any, ...prevEvents.slice(0, MAX_SHOW)];
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
      TEAM_KEYS.forEach(grabAndAddProfile)

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
    if(!publicKey) return;
    if(!pool) return;

    grabAndAddProfile(publicKey);

    pool.get(POOL_RELAYS, {
      kinds: [3],
      authors: [publicKey],
    })
    .then(setKind3)

  }, [publicKey, pool])

  useEffect(() => {
    if (!kind3) return;
    if (!pool) return;

    const following = [];
    const relays = [...POOL_RELAYS]; // Does not work right now
    for (const tag of kind3.tags) {
      if(tag[0] === 'p' && tag[1]) {
        following.push(tag[1]);
      }
    }

    const sub = pool.sub(relays, [
      {
        kinds: [1],
        authors: [kind3.pubkey, ...following],
        limit: MAX_SHOW_FOLLOWING,
      },
    ]);

    sub.on("event", (event) => {
      setFollowingEvents((prevEvents) => {
        if (prevEvents.find((e) => e.id === event.id)) return prevEvents;
        if (!event.content) return prevEvents;

        return [event as any, ...prevEvents.slice(0, MAX_SHOW)];
      });
    });

    return () => {
      sub.unsub();
      pool.close(relays);
    }
  }, [kind3, pool]);

  useEffect(() => {
    if (!pool) return;

    for (const event of events) {
      if (profiles.find((profile) => profile.pubkey === event.pubkey)) continue;
      grabAndAddProfile(event.pubkey)
    }

    for (const event of followingEvents) {
      if (profiles.find((profile) => profile.pubkey === event.pubkey)) continue;
      grabAndAddProfile(event.pubkey)
    }
  }, [events, followingEvents, pool]);

  // ---------------- DATA ----------------------------

  const postEvent = async (event: NostrEvent<number>) => {
    if(!nostr) throw new Error('No nostr');
    if(!pool) throw new Error('No pool');
    if(isLoading) return;

    let errorString: string | undefined = undefined;

    setIsLoading(true);
    try {
      const signedEvent = await nostr.signEvent(event);
      await pool.publish(POOL_RELAYS, signedEvent);
    } catch(e) {
      errorString = `Error signing event: ${e}`;
    } finally {
      setIsLoading(false);
    }

    if(errorString) throw new Error(errorString);
  };

  const excalibur = {
    events,
    profiles,
    isLoading,
    postEvent,
    followingEvents,
    teamKeys: TEAM_KEYS,
    relays: POOL_RELAYS,
  };

  return (
    <ExcaliburContext.Provider value={excalibur}>
      {children}
    </ExcaliburContext.Provider>
  );
}
