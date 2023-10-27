import {
  Relay,
  relayInit,
  VerifiedEvent,
  generatePrivateKey,
  SimplePool,
} from "nostr-tools";
import { NIP07, verifyZap } from "utils";
import { WebLNProvider, requestProvider } from "webln";
import { getSince } from "utils";
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
    'wss://relay.damus.io',
    'wss://cache2.primal.net/v1',
    'wss://nostr.kollider.xyz/',
    'wss://nostr.wine/',
    'wss://nos.lol/',
    'wss://welcome.nostr.wine/',
    'wss://nostr-relay.nokotaro.com/',
    'wss://relayable.org/',
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
        // since: getSince({ days: 30 })
        limit: STARTING_LOAD
    }]);

    sub.on('event', event => {
        setEvents((prevEvents) => {
            if(prevEvents.find(e => e.id === event.id)) return prevEvents;
            if(!event.content) return prevEvents;

            // const amount = verifyZap(event as any);
            // if(!amount) return prevEvents;
            // return [event as any, ...prevEvents];

            return [event as any, ...(prevEvents.slice(0, MAX_SHOW))];
        });
    });

    return () => {
        pool.close(POOL);
    }
    
  }, []);

  useEffect(() => {
    let postedEvents: {[key: string]: {amount: number, count: number}} = {};

    for (const event of events) {
      const amount = verifyZap(event);
      if(!amount) return;
      if (postedEvents[event.id]) {
        postedEvents[event.id] = { 
          amount: postedEvents[event.id].amount + amount, 
          count: postedEvents[event.id].count + 1
      };
      } else {
        postedEvents[event.id] = { amount, count: 1 };
      }
    }

  }, [events]);

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


