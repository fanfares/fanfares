import { VerifiedEvent, finishEvent, generatePrivateKey, getPublicKey, relayInit } from "nostr-tools";
import { PREntry, CreateNotePostBody, createAnnouncementNote, createGatedNote, createKeyNote, eventToGatedNote, unlockGatedNoteFromKeyNote } from "nip108";
import storyData from './story.json';

const SERVER = Bun.env.NEXT_PUBLIC_GATE_SERVER as string;
const LNBITS_API = Bun.env.LNBITS_API as string
const LUD16 = Bun.env.LUD16 as string
const RELAY = Bun.env.NOSTR_RELAY as string
const NOSTR_SK = Bun.env.NOSTR_SK ?? generatePrivateKey();

// ------------- HELPERS ------------------

function createLockedEvent(privateKey: string, content: string) {
  
    const event = {
      kind: 1,
      pubkey: getPublicKey(privateKey),
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: content,
    };
  
    return finishEvent(event, privateKey);
  }

  async function payInvoice(pr: string) {

    return fetch("https://legend.lnbits.com/api/v1/payments", {
        method: 'POST',
        headers: {
            'X-Api-Key': LNBITS_API,
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            out: true,
            bolt11: pr,
        })
    });

}

async function createGatedEvent(
    privateKey: string, 
    content: string,
    lud16: string,
    endpoint: string,
    cost: number,
){
    const secret = generatePrivateKey();
    const lockedNote = createLockedEvent(privateKey, content);
  
    const gatedNote = createGatedNote(
      privateKey,
      secret,
      cost,
      endpoint,
      lockedNote
    );

    const postBody: CreateNotePostBody = {
        gateEvent: gatedNote,
        lud16: lud16,
        secret: secret,
        cost: cost,
    }

    const response = await fetch(endpoint + '/create', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(postBody)
    })

    return gatedNote;
}


async function testUnlockGatedNote(gatedNote: VerifiedEvent<number>){
    const gatedNoteData = eventToGatedNote(gatedNote);

    const invoiceResponse = await fetch(gatedNoteData.endpoint + '/' + gatedNoteData.note.id);
    const invoiceResponseData = await invoiceResponse.json() as PREntry; 

    const invoice = await payInvoice(invoiceResponseData.pr);
    const invoiceData = await invoice.json();

    const getResultsResponse = await fetch(invoiceResponseData.successAction.url);
    const getResultsResponseData = await getResultsResponse.json();

    return getResultsResponseData.secret;
}

async function postToNostr(gatedNote: VerifiedEvent<number>, keyNote: VerifiedEvent<number>, announcementNote: VerifiedEvent<number>,){
    const relay = relayInit(RELAY);

    await relay.connect();

    await relay.publish(gatedNote)
    await relay.publish(keyNote)
    await relay.publish(announcementNote)

    await relay.close();
}

async function postStories(){

    let x = 1;
    for (const storyEntry of storyData.stories) {
        console.log(`Creating ${x++}/${storyData.stories.length} stories`);

        console.log("Creating gated note...")
        const gatedNote = await createGatedEvent(
            NOSTR_SK, 
            storyEntry.story, 
            LUD16,
            SERVER,
            storyEntry.cost
        );
    
        console.log("Paying for gated note...")
        const secret = await testUnlockGatedNote(gatedNote);

        if(!secret){
            throw new Error("Could not unlock gated note - Check LNBits API");
        }

        console.log("Creating key note...");
        const keyNote = await createKeyNote(NOSTR_SK, secret, gatedNote);
    
        console.log("Unlocking from key note...");
        const unlockedNote = await unlockGatedNoteFromKeyNote(NOSTR_SK, keyNote, gatedNote)
    
        console.log("Creating announcement note...");
        const announcementNote = createAnnouncementNote(NOSTR_SK, storyEntry.preview, gatedNote)
    
        console.log("Posting Notes...");
        await postToNostr(gatedNote, keyNote, announcementNote);
    
        console.log("Result: " + unlockedNote.content);
    }

    console.log(`Done.`);
}

postStories();
