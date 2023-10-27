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
  useContext,
  useEffect,
  useState,
} from "react";
import { set } from "firebase/database";

const STARTING_LOAD = 1;
const MAX_SHOW = 89;

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

export type ExcaliburContext = {
  events: VerifiedEvent[];
  profiles: NostrProfile[];
  postEvent: (event: NostrEvent<number>) => Promise<void>;
  isLoading: boolean;
};

const DEFAULT_EVENT: ExcaliburContext = {
  events: [],
  profiles: [],
  isLoading: false,
  postEvent: () => Promise.resolve(),
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
  const [profiles, setProfiles] = useState<NostrProfile[]>([]);

  const grabAndAddProfile = async (pubkey: string) => {
    if(!pool) return;

    pool
    .get(POOL_RELAYS, {
      kinds: [0],
      authors: [pubkey],
    })
    .then((kind0: any) => {
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
      pool.close(POOL_RELAYS);
    };
  }, []);

  useEffect(() => {
    if (pool) {
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

    grabAndAddProfile(publicKey);
  }, [publicKey])

  useEffect(() => {
    if (!pool) return;

    for (const event of events) {
      if (profiles.find((profile) => profile.pubkey === event.pubkey)) continue;
      grabAndAddProfile(event.pubkey)
    }
  }, [events, pool]);

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
  };

  return (
    <ExcaliburContext.Provider value={excalibur}>
      {children}
    </ExcaliburContext.Provider>
  );
}
