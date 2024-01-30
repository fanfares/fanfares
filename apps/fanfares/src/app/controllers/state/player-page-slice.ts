import { StateCreator, create } from "zustand";
import { Podcast } from "./podcast-slice";
import { SimplePool } from "nostr-tools";
import {
  NIP_108_KINDS,
  PREntry,
  createKeyNoteUnsigned,
  eventToAnnouncementNote,
  eventToGatedNote,
  eventToKeyNote,
  unlockGatedNote,
} from "nip108";
import { NIP04, NIP07, NostrProfile, eventToNostrProfile } from "utils";
import { WebLNProvider } from "webln";

export interface PlayerPageSlice {
  playerPageIsPlaying: boolean;
  playerPageDuration: number;
  playerPageCurrentTime: number;
  playerPageVolume: number;
  playerPageIsPlayerShowing: boolean;
  playerPageGateId: string;
  playerPagePodcastCreator: NostrProfile | null;
  playerPagePodcast: Podcast | null;
  playerPageIsLoading: boolean;
  playerPageIsUnlocking: boolean;
  playerPageError: string | null;
  actions: {
    playerPageSetDuration: (duration: number) => void;
    playerPageSetCurrentTime: (currentTime: number) => void;
    playerPageSetVolume: (volume: number) => void;
    playerPageSetPlayerShowing: (isShowing: boolean) => void;
    playerPageSetPlaying: (isPlaying: boolean) => void;
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
      publicKey: string
    ) => Promise<void>;
    playerPageBuyPodcast: (
      nostrRelays: string[],
      nostrPool: SimplePool,
      podcast: Podcast,
      nip04: NIP04,
      nip07: NIP07,
      publicKey: string,
      webln: WebLNProvider
    ) => Promise<void>;
  };
}

const DEFAULT_STATE: PlayerPageSlice = {
  playerPageGateId: "...",
  playerPageDuration: 0,
  playerPageCurrentTime: 0,
  playerPageVolume: 80,
  playerPagePodcastCreator: null,
  playerPageIsPlayerShowing: true,
  playerPageError: null,
  playerPagePodcast: null,
  playerPageIsPlaying: false,
  playerPageIsUnlocking: false,
  playerPageIsLoading: false,
  actions: {
    playerPageSetDuration: (duration: number) => {},
    playerPageSetCurrentTime: (currentTime: number) => {},
    playerPageSetVolume: (volume: number) => {},
    playerPageSetPlayerShowing: (isShowing: boolean) => {},
    playerPageSetPlaying: (isPlaying: boolean) => {},
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
      publicKey: string
    ) => {},
    playerPageBuyPodcast: async (
      nostrRelays: string[],
      nostrPool: SimplePool,
      podcast: Podcast,
      nip04: NIP04,
      nip07: NIP07,
      publicKey: string,
      webln: WebLNProvider
    ) => {},
  },
};

export const createPlayerPageSlice: StateCreator<
  PlayerPageSlice,
  [],
  [],
  PlayerPageSlice
> = (set, get) => {


  const playerPageSetDuration = (duration: number) => {
    set({ playerPageDuration: duration });
  };

  const playerPageSetCurrentTime = (currentTime: number) => {
    set({ playerPageCurrentTime: currentTime });
  };

  const playerPageSetVolume = (volume: number) => {
    set({ playerPageVolume: volume });
  };

  const playerPageSetPlayerShowing = (isShowing: boolean) => {
    set({ playerPageIsPlayerShowing: isShowing });
  };

  const playerPageSetPlaying = (isPlaying: boolean) => {
    set({ playerPageIsPlaying: isPlaying });
  };

  const clearWith = (state: Partial<PlayerPageSlice>) => {
    set({
      playerPageGateId: "",
      playerPageDuration: 0,
      playerPageCurrentTime: 0,
      playerPageIsPlayerShowing: true,
      playerPageError: null,
      playerPagePodcast: null,
      playerPageIsPlaying: false,
      playerPageIsUnlocking: false,
      playerPageIsLoading: false,
      playerPagePodcastCreator: null,
      ...state
    });
  }

  const playerPageSetGateId = async (
    nostrRelays: string[],
    nostrPool: SimplePool,
    id: string
  ) => {

    if(id === get().playerPageGateId) return;

    clearWith(
      {
        playerPageGateId: id,
        playerPageIsLoading: true,
      }
    );

    try {
      // Fetch Announcement
      const rawAnnouncement = await nostrPool.get(nostrRelays, {
        "#t": ["podcast"],
        "#e": [id],
        kinds: [NIP_108_KINDS.announcement],
      });

      if (!rawAnnouncement) throw new Error("Announcement not found");
      const announcement = eventToAnnouncementNote(rawAnnouncement);

      const rawGate = await nostrPool.get(nostrRelays, {
        ids: [id],
      });

      if (!rawGate) throw new Error("Gate not found");
      const gate = eventToGatedNote(rawGate);

      const contentSplit = announcement.note.content.split("\n");
      const title = contentSplit[0];
      const description = contentSplit[1];

      let imageFilepath = "https://placehold.co/400";
      const imageTag = announcement.note.tags?.find((tag) => tag[0] === "r");
      if (imageTag && imageTag[1]) {
        imageFilepath = imageTag[1];
      }

      const podcast: Podcast = {
        title,
        description,
        imageFilepath,
        gate,
        announcement,
      };

      set({ playerPagePodcast: podcast });

      // Fetch Creator
      const rawProfile = await nostrPool.get(nostrRelays, {
        authors: [gate.note.pubkey],
        kinds: [0],
        limit: 1,
      });
      const profile = eventToNostrProfile(gate.note.pubkey, rawProfile);
      if(rawProfile){
        const profile = eventToNostrProfile(gate.note.pubkey, rawProfile);
        set({ playerPagePodcastCreator: profile });
      }

    } catch (e) {
      set({ playerPageError: `${e}` });
      throw new Error(`Error setting player page: ${e}`);
    } finally {
      set({ playerPageIsLoading: false });
    }
  };

  const playerPageUnlockPodcast = async (
    nostrRelays: string[],
    nostrPool: SimplePool,
    podcast: Podcast,
    nip04: any,
    publicKey: string
  ) => {

    // already unlocked
    if (podcast.audioFilepath) return;

    let noKey = false;
    set({ playerPageIsUnlocking: true });

    try {
      const rawKey = await nostrPool.get(nostrRelays, {
        "#e": [podcast.gate.note.id],
        authors: [publicKey],
        kinds: [NIP_108_KINDS.key],
      });

      if (!rawKey){
        noKey = true;
        throw new Error("Key not found");
      }
      const key = eventToKeyNote(rawKey);

      const decryptedSecret = await nip04.decrypt(
        podcast.gate.note.pubkey,
        key.note.content
      );
      const content = unlockGatedNote(podcast.gate.note, decryptedSecret);
      const audioFilepath = content.tags?.find((tag) => tag[0] === "r")?.[1];

      if (!audioFilepath) throw new Error("Audio filepath not found");

      const newPodcast = {
        ...podcast,
        content,
        audioFilepath,
      };
      set({ playerPagePodcast: newPodcast });
    } catch (e) {

      if(!noKey){
        throw new Error(`Error unlocking page: ${e}`);
      } else {
        console.log("No key found, need to buy podcast");
      }
    } finally {
      set({ playerPageIsUnlocking: false });
    }
  };

  const playerPageBuyPodcast = async (
    nostrRelays: string[],
    nostrPool: SimplePool,
    podcast: Podcast,
    nip04: NIP04,
    nip07: NIP07,
    publicKey: string,
    webln: WebLNProvider
  ) => {
    try {
      if (!nostrRelays) throw new Error("No relays");
      if (!nostrPool) throw new Error("No pool");
      if (!podcast) throw new Error("No podcast");
      if (!webln) throw new Error("No webln provider");
      if (!publicKey) throw new Error("No public key");
      if (!nip04) throw new Error("No NIP-04");
      if (!nip07) throw new Error("No NIP-07");

      set({ playerPageIsUnlocking: true });

      const uri = `${podcast.gate.endpoint}/${podcast.gate.note.id}`;
      const invoiceResponse = await fetch(uri);
      const invoiceResponseJson = (await invoiceResponse.json()) as PREntry;

      await webln.sendPayment(invoiceResponseJson.pr);
      const resultResponse = await fetch(invoiceResponseJson.successAction.url);

      if(!resultResponse.ok) throw new Error("Failed to get secret from server");

      const resultResponseJson = await resultResponse.json();

      const secret = resultResponseJson.secret;

      const encryptedKey = await nip04.encrypt(
        podcast.gate.note.pubkey,
        secret
      );

      const key = createKeyNoteUnsigned(
        publicKey,
        encryptedKey,
        podcast.gate.note,
        podcast.announcement.note,
        true
      );

      const keySigned = await nip07.signEvent(key);

      await nostrPool.publish(nostrRelays, keySigned);

      const content = unlockGatedNote(podcast.gate.note, secret);
      const audioFilepath = content.tags?.find((tag) => tag[0] === "r")?.[1];

      if (!audioFilepath) throw new Error("Audio filepath not found");

      const newPodcast = {
        ...podcast,
        content,
        audioFilepath,
      };
      set({ playerPagePodcast: newPodcast });
    } catch (e) {
      throw new Error(`Failed to unlock podcast - ${e}`);
    } finally {
      set({ playerPageIsUnlocking: false });
    }
  };

  return {
    ...DEFAULT_STATE,
    actions: {
      playerPageSetGateId,
      playerPageUnlockPodcast,
      playerPageBuyPodcast,
      playerPageSetPlaying,
      playerPageSetDuration,
      playerPageSetCurrentTime,
      playerPageSetVolume,
      playerPageSetPlayerShowing,
    },
  };
};

const usePlayerPage = create<PlayerPageSlice>()(createPlayerPageSlice);

export const usePlayerPagePodcastCreator = () => usePlayerPage((state) => state.playerPagePodcastCreator);
export const usePlayerPageIsPlaying = () => usePlayerPage((state) => state.playerPageIsPlaying);
export const usePlayerPageDuration = () => usePlayerPage((state) => state.playerPageDuration);
export const usePlayerPageCurrentTime = () => usePlayerPage((state) => state.playerPageCurrentTime);
export const usePlayerPageVolume = () => usePlayerPage((state) => state.playerPageVolume);
export const usePlayerPageIsPlayerShowing = () =>
  usePlayerPage((state) => state.playerPageIsPlayerShowing);
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
