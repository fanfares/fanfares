import { VerifiedEvent } from "nostr-tools";

export interface NostrProfile {
    pubkey: string;
    picture: string;
    banner: string;
    display_name: string;
    about: string;
    name?: string;
    damus_donation_v2?: number;
    website?: string;
    nip05?: string;
    lud16?: string;
    lud06?: string;
}

// export function defaultNostrProfile(pubkey: string): NostrProfile {
//     return {    
//         pubkey: pubkey,

//     }
// }

export function eventToNostrProfile(pubkey: string, event: VerifiedEvent | null): NostrProfile {

    let profile = {};

    if(event && event.content){
        profile = JSON.parse((event as any).content)
    }

    return {
        // ...defaultNostrProfile(pubkey),
        ...profile
    } as NostrProfile
}