import { SimplePool, Event as NostrEvent } from "nostr-tools";
import { NIP07 } from "utils";
import { createNoteUnsigned } from "../nip108";

export interface WaterfallRequirements {
    nip07: NIP07,
    publish: (note: NostrEvent) => Promise<void>,
}
