import { StateCreator } from 'zustand';
import { CombinedState } from './use-app-state';
import { AnnouncementNote, GatedNote, NIP_108_KINDS, PREntry, createKeyNoteUnsigned, eventToAnnouncementNote, eventToGatedNote, eventToKeyNote, unlockGatedNote, unlockGatedNoteFromKeyNote } from 'nip108';
import { Event as NostrEvent } from 'nostr-tools';

export interface Podcast {
    title: string,
    description: string,
    imageFilepath: string,
    audioFilepath?: string,

    content?: NostrEvent<number>,
    announcement: AnnouncementNote,
    gate: GatedNote
}

export interface PodcastSlice {
    podcastFetching: boolean;
    podcastFetch: ()=>void;
    podcastUnlock: (gateId: string)=>void;
    podcastUnlockAll: ()=>void;
    podcastEpisodes: {
        [key: string]: Podcast // Indexed by gateID
    };
}

const DEFAULT_STATE: PodcastSlice = {
    podcastFetching: false,
    podcastFetch: () => {},
    podcastUnlock: () => {},
    podcastUnlockAll: () => {},
    podcastEpisodes: {},
};

export const createPodcastSlice: StateCreator<
  CombinedState & PodcastSlice,
  [],
  [],
  PodcastSlice
> = (set, get) => {

    const podcastUnlock = async (gateId: string) => {

        const webln = get().accountWebln;
        const pool = get().nostrPool;
        const relays = get().nostrRelays;
        const podcastEpisodes = get().podcastEpisodes;
        const publicKey = get().accountPublicKey;
        const nip04 = get().accountNIP07?.nip04;
        const nip07 = get().accountNIP07;

        try {
            if(!webln) throw new Error("No webln provider");
            if(!pool) throw new Error("No pool");
            if(!relays) throw new Error("No relays");
            if(!podcastEpisodes) throw new Error("No podcast episodes");
            if(!publicKey) throw new Error("No public key");
            if(!nip04) throw new Error("No NIP-04");
            if(!nip07) throw new Error("No NIP-07");
    
            const newPodcastEpisodes = {...podcastEpisodes};
            const podcast = newPodcastEpisodes[gateId];
    
            const uri = `${podcast.gate.endpoint}/${podcast.gate.note.id}`;
            const invoiceResponse = await fetch(uri);
            const invoiceResponseJson = (await invoiceResponse.json()) as PREntry;
    
            await webln.sendPayment(invoiceResponseJson.pr);
    
            const resultResponse = await fetch(invoiceResponseJson.successAction.url);
            const resultResponseJson = await resultResponse.json();
            const secret = resultResponseJson.secret;
    
            const encryptedKey = await nip04.encrypt(podcast.gate.note.pubkey, secret);
    
            const key = createKeyNoteUnsigned(
                publicKey, 
                encryptedKey,
                podcast.gate.note,
                podcast.announcement.note,
                true
            );
    
            const keySigned = await nip07.signEvent(key);
            await pool.publish(relays, keySigned);
    
            const content = unlockGatedNote(podcast.gate.note, secret);
            newPodcastEpisodes[podcast.gate.note.id] = {
                ...podcast,
                content,
                audioFilepath: content.tags?.find((tag) => tag[0] === "r")?.[1],
            };
    
            set({
                podcastEpisodes: newPodcastEpisodes
            })
        } catch (error) {
            alert(error);
        }

  
    }

    // const handleBuy = async (gatedNote: GatedNote) => {
    //     if (gateLoading) return;
    
    //     setGateLoading(gatedNote.note.id);
    
    //     try {
    //       if (!webln) throw new Error("No webln provider");
    //       if (!nostr) throw new Error("No nostr provider");
    //       if (!publicKey) throw new Error("No Public Key");
    //       if (!relay) throw new Error("No relay");
    
    //       const uri = `${gatedNote.endpoint}/${gatedNote.note.id}`;
    //       const invoiceResponse = await fetch(uri);
    //       const invoiceResponseJson = (await invoiceResponse.json()) as PREntry;
    
    //       await webln.sendPayment(invoiceResponseJson.pr);
    
    //       const resultResponse = await fetch(invoiceResponseJson.successAction.url);
    //       const resultResponseJson = await resultResponse.json();
    //       const secret = resultResponseJson.secret;
    
    //       const content = await nostr.nip04.encrypt(gatedNote.note.pubkey, secret);
    
    //       const keyEvent = {
    //         kind: NIP_108_KINDS.key,
    //         pubkey: publicKey,
    //         created_at: Math.floor(Date.now() / 1000),
    //         tags: [["g", gatedNote.note.id]],
    //         content: content,
    //       };
    
    //       const keyEventVerified = await nostr.signEvent(keyEvent);
    
    //       await relay.publish(keyEventVerified);
    
    //       const keyNoteUnlocked = {
    //         ...eventToKeyNote(keyEventVerified),
    //         unlockedSecret: secret,
    //       } as KeyNote;
    //       setKeyNotes([...keyNotes, keyNoteUnlocked]);
    //     } catch (e) {
    //       alert(e);
    //     }
    
    //     setGateLoading(null);
    //   };

    const podcastUnlockAll = async () => {

        const pool = get().nostrPool;
        const relays = get().nostrRelays;
        const podcastEpisodes = get().podcastEpisodes;
        const publicKey = get().accountPublicKey;
        const nip04 = get().accountNIP07?.nip04;

        if(!pool) throw new Error("No pool");
        if(!relays) throw new Error("No relays");
        if(!podcastEpisodes) throw new Error("No podcast episodes");
        if(!publicKey) throw new Error("No public key");
        if(!nip04) throw new Error("No NIP-04");

        const newPodcastEpisodes = {...podcastEpisodes};

        const filters = Object.values(podcastEpisodes).map((episode) => {
            return {
                kinds: [NIP_108_KINDS.key],
                authors: [publicKey],
                '#e': [episode.gate.note.id],
            }
        });

        const rawKeys = await pool.list(relays, filters);
        const keys = rawKeys.map(eventToKeyNote);

        for(const key of keys) {
            const podcast = newPodcastEpisodes[key.gate];

            if(!podcast) continue;

            const decryptedSecret = await nip04.decrypt(podcast.gate.note.pubkey, key.note.content);
            const content = unlockGatedNote(podcast.gate.note, decryptedSecret);
            newPodcastEpisodes[key.gate] = {
                ...podcast,
                content,
                audioFilepath: content.tags?.find((tag) => tag[0] === "r")?.[1],
            };
        }

        set({ podcastEpisodes: newPodcastEpisodes });
    }
    
    const podcastFetch = async () => {
    
        const pool = get().nostrPool;
        const relays = get().nostrRelays;
        const podcastFetching = get().podcastFetching;

        try {
            if(podcastFetching) return;
            if(!pool) throw new Error("No pool");
            if(!relays) throw new Error("No relays");

            set({ podcastFetching: true });
    
            const podcasts: {
                [key: string]: Podcast // Indexed by gateID
            } = {};
    
            const rawAnnouncements = await pool.list(relays, [
                {
                  "#t": ["podcast"],
                  kinds: [NIP_108_KINDS.announcement],
                  limit: 10,
                }
            ]);
    
            const announcements = rawAnnouncements.map(eventToAnnouncementNote);
            const gatesToGet = announcements.map((a) => a.gate);
    
            const rawGates = await pool.list(relays, [
                {
                    ids: gatesToGet,
                }
            ]);
            const gates = rawGates.map(eventToGatedNote);
    
            for (const gate of gates) {
                const announcement = announcements.find((a) => a.gate === gate.note.id);
    
                if(!announcement) continue;
    
                const contentSplit = announcement.note.content.split("\n");
                const title = contentSplit[0];
                const description = contentSplit[1];
        
                let imageFilepath = "https://placehold.co/400";
                const imageTag = announcement.note.tags?.find((tag) => tag[0] === "r");
                if(imageTag && imageTag[1]) {
                    imageFilepath = imageTag[1];
                }
    
                podcasts[gate.note.id] = {
                    title,
                    description,
                    imageFilepath,
                    gate,
                    announcement,
                }
            }
    
            set({ podcastEpisodes: podcasts });
        } catch (error) {

        } finally {
            set({ podcastFetching: false});
        }

    }

    return {
        ...DEFAULT_STATE,
        podcastFetch,
        podcastUnlock,
        podcastUnlockAll,
    };
};
