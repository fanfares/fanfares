import { SimplePool, Event as NostrEvent } from "nostr-tools";
import { NIP07 } from "utils";
import { createNoteUnsigned } from "./nip108";

export interface WaterfallRequirements {
    nip07: NIP07,
    publish: (note: NostrEvent) => Promise<void>,
}

// const pool = get().nostrPool;
// const relays = get().nostrRelays;
// const publicKey = get().accountPublicKey;
// const nip07 = get().accountNIP07;
// const gateState = get().gateCreateState;
// const lud16 = get().accountProfile?.lud16;

export enum PostNoteState {
    IDLE = "IDLE",
    GETTING_PUBLIC_KEY = "GETTING_PUBLIC_KEY",
    SIGNING = "SIGNING",
    POSTING = "POSTING",
}

export interface PostNoteInput extends WaterfallRequirements {
    content: string,
    kind?: number,
    tags?: string[][],

    _state?: PostNoteState,
    _setState: (state: PostNoteState) => void,

    _publicKey?: string,
    _setPublicKey: (publicKey: string) => void,

    _signedNote?: NostrEvent,
    _setSignedNote: (signedNote: NostrEvent) => void,

    debug?: boolean,
}

export async function postNote(input: PostNoteInput): Promise<String> {
    const { nip07, publish, content, tags, kind, debug } = input;
    const { _setState, _setPublicKey, _setSignedNote } = input;
    let { _state, _publicKey, _signedNote } = input;

    if( !nip07 || !publish || !content || !tags || kind == null ) throw new Error("Missing required input");


    switch(_state){
        case PostNoteState.IDLE: {
            _setState(PostNoteState.GETTING_PUBLIC_KEY);
        }
        case PostNoteState.GETTING_PUBLIC_KEY: {
            _publicKey = await nip07.getPublicKey();
            _setPublicKey(_publicKey);
            _setState(PostNoteState.SIGNING);
        }
        case PostNoteState.SIGNING: {
            if(!_publicKey){
                _setState(PostNoteState.GETTING_PUBLIC_KEY);
                throw new Error("Missing public key");
            }

            const noteToPost = createNoteUnsigned(
                _publicKey,
                content,
                kind,
                tags,
                debug,
            );

            _signedNote = await nip07.signEvent(noteToPost);

            _setSignedNote(_signedNote);
            _setState(PostNoteState.POSTING);

        }
        case PostNoteState.POSTING: {
            if(!_signedNote){
                _setState(PostNoteState.SIGNING);
                throw new Error("Missing signed note");
            }

            await publish(_signedNote);
            _setState(PostNoteState.IDLE);
            return _signedNote.id;

        }
        default: {
            throw new Error("Invalid state");
        }
    }

}