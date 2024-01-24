import { StateCreator, create } from "zustand";
import { CombinedState } from "./use-app-state";
import { Podcast } from "./podcast-slice";
import { SimplePool } from "nostr-tools";
import { NIP_108_KINDS, PREntry, createKeyNoteUnsigned, eventToAnnouncementNote, eventToGatedNote, eventToKeyNote, unlockGatedNote } from "nip108";
import { NIP04, NIP07 } from "utils";
import { WebLNProvider } from "webln";

export interface PlayerPageSlice {
  playerPageGateId: string;
  playerPagePodcast: Podcast | null;
  playerPageIsLoading: boolean;
  playerPageIsUnlocking: boolean;
    playerPageError: string | null;
  actions: {
    playerPageSetGateId: (
        nostrRelays: string[],
        nostrPool: SimplePool,
        id: string
    ) => Promise<void>;
    playerPageUnlockPodcast: (
        nostrRelays: string[],
        nostrPool: SimplePool,
        podcast: Podcast,
        nip04: NIP04,
        publicKey: string,
    ) => Promise<void>;
    playerPageBuyPodcast: (
        nostrRelays: string[],
        nostrPool: SimplePool,
        podcast: Podcast,
        nip04: NIP04,
        nip07: NIP07,
        publicKey: string,
        webln: WebLNProvider,
    ) => Promise<void>;
  };
}

const DEFAULT_STATE: PlayerPageSlice = {
  playerPageGateId: "...",
  playerPageError: null,
  playerPagePodcast: null,
  playerPageIsUnlocking: false,
  playerPageIsLoading: false,
  actions: {
    playerPageSetGateId: async (
      nostrRelays: string[],
      nostrPool: SimplePool,
      id: string
    ) => {},
    playerPageUnlockPodcast: async (
        nostrRelays: string[],
        nostrPool: SimplePool,
        podcast: Podcast,
        nip04: NIP04,
        publicKey: string,
    ) => {},
    playerPageBuyPodcast: async (
        nostrRelays: string[],
        nostrPool: SimplePool,
        podcast: Podcast,
        nip04: NIP04,
        nip07: NIP07,
        publicKey: string,
        webln: WebLNProvider,
    ) => {},
  },
};

export const createPlayerPageSlice: StateCreator<
  PlayerPageSlice,
  [],
  [],
  PlayerPageSlice
> = (set, get) => {
  const setPlayerPageGateId = async (
    nostrRelays: string[],
    nostrPool: SimplePool,
    id: string
  ) => {
    set({ playerPageGateId: id, playerPageIsLoading: true, playerPageError: null });

    try {
        // Fetch Announcement
        const rawAnnouncement = await nostrPool.get(nostrRelays, {
            "#t": ["podcast"],
            "#e": [id],
            kinds: [NIP_108_KINDS.announcement],
        })

        if(!rawAnnouncement) throw new Error('Announcement not found');
        const announcement = eventToAnnouncementNote(rawAnnouncement);

        const rawGate = await nostrPool.get(nostrRelays, {
            ids: [id],
        });

        if(!rawGate) throw new Error('Gate not found');
        const gate = eventToGatedNote(rawGate);

        const contentSplit = announcement.note.content.split("\n");
        const title = contentSplit[0];
        const description = contentSplit[1];

        let imageFilepath = "https://placehold.co/400";
        const imageTag = announcement.note.tags?.find((tag) => tag[0] === "r");
        if(imageTag && imageTag[1]) {
            imageFilepath = imageTag[1];
        }

        const podcast: Podcast = {
            title,
            description,
            imageFilepath,
            gate,
            announcement,
        }

        set({ playerPagePodcast: podcast });

    } catch (e) {
        set({ playerPageError: `${e}` });
    } finally {
        set({ playerPageIsLoading: false });
    }

  };

  const unlockPlayerPageGate = async (
        nostrRelays: string[],
        nostrPool: SimplePool,
        podcast: Podcast,
        nip04: any,
        publicKey: string,
  ) => {

    if(podcast.audioFilepath) return;

    set({ playerPageIsUnlocking: true });

    try {
        const rawKey = await nostrPool.get(nostrRelays, {
            "#e": [podcast.gate.note.id],
            authors: [publicKey],
            kinds: [NIP_108_KINDS.key],
        });
    
        if(!rawKey) throw new Error('Key not found');
        const key = eventToKeyNote(rawKey);
    
        const decryptedSecret = await nip04.decrypt(podcast.gate.note.pubkey, key.note.content);
        const content = unlockGatedNote(podcast.gate.note, decryptedSecret);
        const audioFilepath = content.tags?.find((tag) => tag[0] === "r")?.[1];

        if(!audioFilepath) throw new Error('Audio filepath not found');

        const newPodcast = {
            ...podcast,
            content,
            audioFilepath,
        }
        set({ playerPagePodcast: newPodcast });
    } catch (error) {
        console.error(error);
    } finally {
        set({ playerPageIsUnlocking: false });
    }

  }

  const buyPodcast = async (
        nostrRelays: string[],
        nostrPool: SimplePool,
        podcast: Podcast,
        nip04: NIP04,
        nip07: NIP07,
        publicKey: string,
        webln: WebLNProvider,
  ) => {

    console.log('buyPodcast');
    try {

        if(!nostrRelays) throw new Error("No relays");
        if(!nostrPool) throw new Error("No pool");
        if(!podcast) throw new Error("No podcast");
        if(!webln) throw new Error("No webln provider");
        if(!publicKey) throw new Error("No public key");
        if(!nip04) throw new Error("No NIP-04");
        if(!nip07) throw new Error("No NIP-07");

    console.log('test');

        set({ playerPageIsUnlocking: true });


        const uri = `${podcast.gate.endpoint}/${podcast.gate.note.id}`;
    console.log(uri);

        const invoiceResponse = await fetch(uri);
    console.log('test');

        const invoiceResponseJson = (await invoiceResponse.json()) as PREntry;

    console.log('payment');

        await webln.sendPayment(invoiceResponseJson.pr);

    console.log('done payment');

        const resultResponse = await fetch(invoiceResponseJson.successAction.url);
    console.log('fetch');

        const resultResponseJson = await resultResponse.json();
    console.log('result');

        const secret = resultResponseJson.secret;

    console.log('encrypt');

        const encryptedKey = await nip04.encrypt(podcast.gate.note.pubkey, secret);

        const key = createKeyNoteUnsigned(
            publicKey, 
            encryptedKey,
            podcast.gate.note,
            podcast.announcement.note,
            true
        );

    console.log('sign');

        const keySigned = await nip07.signEvent(key);
    console.log('publish');

        await nostrPool.publish(nostrRelays, keySigned);

        const content = unlockGatedNote(podcast.gate.note, secret);
        const audioFilepath = content.tags?.find((tag) => tag[0] === "r")?.[1];

        if(!audioFilepath) throw new Error('Audio filepath not found');
        
        const newPodcast = {
            ...podcast,
            content,
            audioFilepath,
        }
        set({ playerPagePodcast: newPodcast });

    } catch (error) {
        console.log('error');
        console.error(error);
        console.log(error);
    } finally {
        set({ playerPageIsUnlocking: false });
    }



    }

  return {
    ...DEFAULT_STATE,
    actions: {
      playerPageSetGateId: setPlayerPageGateId,
      playerPageUnlockPodcast: unlockPlayerPageGate,
        playerPageBuyPodcast: buyPodcast,
    },
  };
};

const usePlayerPage = create<PlayerPageSlice>()(createPlayerPageSlice);

export const usePlayerPagePodcast = () =>
  usePlayerPage((state) => state.playerPagePodcast);
export const usePlayerPageGateId = () =>
  usePlayerPage((state) => state.playerPageGateId);
export const usePlayerPageActions = () =>
  usePlayerPage((state) => state.actions);
export const usePlayerPageIsUnlocking = () =>
    usePlayerPage((state) => state.playerPageIsUnlocking);
export const usePlayerPageIsLoading = () =>
    usePlayerPage((state) => state.playerPageIsLoading);
export const usePlayerPageError = () =>
    usePlayerPage((state) => state.playerPageError);
