import {
  Relay,
  relayInit,
  VerifiedEvent,
  generatePrivateKey,
  SimplePool,
} from "nostr-tools";
import { NIP07 } from "utils";
import { WebLNProvider, requestProvider } from "webln";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const STARTING_LOAD = 30;
const MAX_SHOW = 30;

const EXCALIBUR_RELAY = process.env.NEXT_PUBLIC_NOSTR_RELAY as string
const POOL = [
    EXCALIBUR_RELAY,
    'wss://relay.primal.net',
    'wss://relay.damus.io'
]


export type ExcaliburContext = {
    events: VerifiedEvent[];
};

const DEFAULT_EVENT: ExcaliburContext = {
    events: []
}
const ExcaliburContext = createContext<ExcaliburContext>(DEFAULT_EVENT);
export const useExcalibur = () => useContext(ExcaliburContext);

export function ExcaliburProvider(props: { children: ReactNode }) {
  const { children } = props;

  // ---------------- STATES --------------------------
  const [relay, setRelay] = useState<Relay | null>(null);
  const [nostr, setNostr] = useState<NIP07 | null>(null);
  const [webln, setWebln] = useState<WebLNProvider | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [events, setEvents] = useState<VerifiedEvent[]>([]);
  const [profiles, setProfiles] = useState<VerifiedEvent[]>([]);

  // ---------------- FUNCTIONS --------------------------

  const signin = () => {
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
  };

  // ---------------- EFFECTS --------------------------

  useEffect(signin, []);

  useEffect(() => {
    const pool = new SimplePool();
    const sub = pool.sub(POOL, [{
        kinds: [1],
        limit: STARTING_LOAD
    }]);

    console.log('STARTED');

    sub.on('event', event => {

        setEvents((prevEvents) => {
            if(prevEvents.find(e => e.id === event.id)) return prevEvents;
            return [event as any, ...(prevEvents.slice(0, MAX_SHOW))];
        });
    });

    return () => {
        pool.close(POOL);
    }
    
  }, []);

  // ---------------- DATA ----------------------------
  const excalibur = {
    events
  };

  return (
    <ExcaliburContext.Provider value={excalibur}>
      {children}
    </ExcaliburContext.Provider>
  );
}
