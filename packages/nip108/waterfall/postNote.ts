import { Event as NostrEvent } from "nostr-tools";
import { createNoteUnsigned } from "../nip108";
import { WaterfallRequirements } from "./waterfall";

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

export async function postNote(input: PostNoteInput): Promise<string> {
    const { nip07, publish, content, tags, kind, debug } = input;
    const { _setState, _setPublicKey, _setSignedNote } = input;
    let { _state, _publicKey, _signedNote } = input;

    if( !nip07 ) throw new Error("Missing NIP07");
    if( !publish ) throw new Error("Missing publish");
    if( !content ) throw new Error("Missing content");

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