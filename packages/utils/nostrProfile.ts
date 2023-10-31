import { Event as NostrEvent } from "nostr-tools";

export interface NostrProfile {
    pubkey: string;
    picture: string;
    banner: string;
    display_name: string;
    about: string;
    name: string;
    damus_donation_v2?: number;
    website?: string;
    nip05?: string;
    lud16?: string;
    lud06?: string;
}



export function getDefaultNostrProfile(pubkey: string): NostrProfile {
    return {    
        pubkey: pubkey,
        picture: "https://shdw-drive.genesysgo.net/DYTesEgJE5YAHBZxRFMe9xENR1xEVuczhD4HqvWf2yfo/default_profile.png",
        banner: "https://shdw-drive.genesysgo.net/DYTesEgJE5YAHBZxRFMe9xENR1xEVuczhD4HqvWf2yfo/default_banner.png",
        display_name: '',
        name: '',
        about: ''
    }
}

export function eventToNostrProfile(pubkey: string, event: NostrEvent<0> | null): NostrProfile {

    const profile = (event && event.content) ? JSON.parse((event as any).content) : {};

    return {
        ...getDefaultNostrProfile(pubkey),
        ...profile
    } as NostrProfile
}

export function pubkeyToReadableName(pubkey: string): string {
    const colors: string[] = [
        'red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange', 
        'teal', 'grey', 'brown', 'cyan', 'magenta', 'olive', 'lime', 
        'navy', 'maroon', 'beige'
    ];
    
    const emotions: string[] = [
        'happy', 'sad', 'angry', 'joyful', 'anxious', 'calm', 'energetic', 
        'lazy', 'hopeful', 'frustrated', 'elated', 'bored', 'content', 
        'melancholic', 'optimistic', 'pessimistic', 'curious', 'indifferent', 
        'overwhelmed'
    ];

    const animals: string[] = [
        'cat', 'dog', 'lion', 'tiger', 'elephant', 'giraffe', 'koala', 
        'monkey', 'penguin', 'zebra', 'bear', 'rhino', 'hippo', 'eagle', 
        'kangaroo', 'sloth', 'meerkat', 'panda', 'platypus', 'seal', 
        'peacock', 'flamingo', 'otter', 'lynx', 'chameleon', 'lemur', 
        'toucan', 'anteater', 'dolphin', 'whale', 'shark'
    ];

    // Ensure that the hash is positive
    const positiveHash = stringHashCode(pubkey) & 0x7FFFFFFF;

    const colorIndex = positiveHash % colors.length;
    const emotionIndex = positiveHash % emotions.length;
    const animalIndex = positiveHash % animals.length;

    return `${emotions[emotionIndex]}-${colors[colorIndex]}-${animals[animalIndex]}`;
}

// Helper function to generate a hash code for a string
export function stringHashCode(str: string): number {
    let hash = 0;
    if (str.length === 0) return hash;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

export function getDisplayName(profile: NostrProfile): string {
    return profile.display_name || profile.name || pubkeyToReadableName(profile.pubkey);
}