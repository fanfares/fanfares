import { SimplePool, Event as NostrEvent } from "nostr-tools";
import { NIP07 } from "utils";
import { createNoteUnsigned } from "../nip108";
import { WaterfallRequirements } from "./waterfall";

export enum PostGatedNoteState {
    IDLE = "IDLE",
    GETTING_PUBLIC_KEY = "GETTING_PUBLIC_KEY",
    SIGNING = "SIGNING",
    POSTING = "POSTING",
}

export interface PostGatedNoteInput extends WaterfallRequirements {
    content: string,
    kind?: number,
    tags?: string[][],

    _state?: PostGatedNoteState,
    _setState: (state: PostGatedNoteState) => void,

    _publicKey?: string,
    _setPublicKey: (publicKey: string) => void,

    _signedGatedNote?: NostrEvent,
    _setSignedGatesNote: (signedNote: NostrEvent) => void,

    debug?: boolean,
}

export async function postGatedNote(input: PostGatedNoteInput): Promise<string> {
    const { nip07, publish, content, tags, kind, debug } = input;
    const { _setState, _setPublicKey, _setSignedGatesNote: _setSignedNote } = input;
    let { _state, _publicKey, _signedGatedNote } = input;

    if( !nip07 ) throw new Error("Missing NIP07");
    if( !publish ) throw new Error("Missing publish");
    if( !content ) throw new Error("Missing content");

    switch(_state){
        case PostGatedNoteState.IDLE: {
            _setState(PostGatedNoteState.GETTING_PUBLIC_KEY);
        }
        case PostGatedNoteState.GETTING_PUBLIC_KEY: {
            _publicKey = await nip07.getPublicKey();
            _setPublicKey(_publicKey);
            _setState(PostGatedNoteState.SIGNING);
        }
        case PostGatedNoteState.SIGNING: {
            if(!_publicKey){
                _setState(PostGatedNoteState.GETTING_PUBLIC_KEY);
                throw new Error("Missing public key");
            }

            const noteToPost = createNoteUnsigned(
                _publicKey,
                content,
                kind,
                tags,
                debug,
            );

            _signedGatedNote = await nip07.signEvent(noteToPost);

            _setSignedNote(_signedGatedNote);
            _setState(PostGatedNoteState.POSTING);

        }
        case PostGatedNoteState.POSTING: {
            if(!_signedGatedNote){
                _setState(PostGatedNoteState.SIGNING);
                throw new Error("Missing signed note");
            }

            await publish(_signedGatedNote);
            _setState(PostGatedNoteState.IDLE);
            return _signedGatedNote.id;
        }
        default: {
            throw new Error("Invalid state");
        }
    }
}