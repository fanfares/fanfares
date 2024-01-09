import { Event as NostrEvent } from "nostr-tools";
import { createNoteUnsigned } from "../nip108";
import { WaterfallRequirements } from "./waterfall";

export type PostNoteState = "IDLE" | "GETTING_PUBLIC_KEY" | "SIGNING" | "POSTING";

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
        case 'IDLE': {
            _setState("GETTING_PUBLIC_KEY");
        }
        case "GETTING_PUBLIC_KEY": {
            _publicKey = await nip07.getPublicKey();
            _setPublicKey(_publicKey);
            _setState("SIGNING");
        }
        case "SIGNING": {
            if(!_publicKey){
                _setState("GETTING_PUBLIC_KEY");
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
            _setState("POSTING");

        }
        case "POSTING": {
            if(!_signedNote){
                _setState("SIGNING");
                throw new Error("Missing signed note");
            }

            await publish(_signedNote);
            _setState("IDLE");
            return _signedNote.id;
        }
        default: {
            throw new Error("Invalid state");
        }
    }
}