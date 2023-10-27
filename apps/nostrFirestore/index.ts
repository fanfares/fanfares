import { Relay, Event as NostrEvent, relayInit, Sub } from 'nostr-tools';
import { promises as fs } from 'fs';
import { QueryDocumentSnapshot } from '@firebase/firestore-types';

global.WebSocket = require('ws');
const csv = require('csv-parser')
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-admin.json");

const MOST_RECENT_EVENT_FILE = 'mostRecentEvent.txt';

async function getMostRecentEventFromFile(): Promise<number> {
    try {
        const content = await fs.readFile(MOST_RECENT_EVENT_FILE, 'utf-8');
        return parseInt(content.trim(), 10);
    } catch (error) {
        console.log('Error reading mostRecentEvent file. Defaulting to Date.now().', error);
        return Date.now();
    }
}

async function saveMostRecentEventToFile(value: number) {
    try {
        await fs.writeFile(MOST_RECENT_EVENT_FILE, value.toString(), 'utf-8');
    } catch (error) {
        console.log('Error writing to mostRecentEvent file.', error);
    }
}

interface NostrFirestoreEvent extends Omit<
    NostrEvent<number>, 'content' | 'tags' | 'sig'>{
    stringifiedEvent: string
    searchTags: {
        [key: string]: boolean;
    }
}

function sanitizeKeyForFirestore(key: string): string {
    return key.trim()
        .replace(/\s+/g, '__')  // Replace all whitespace sequences with double underscores
        .replace(/[.$#[\]/]/g, '_')  // Replace forbidden characters with underscores
        .replace(/^\.*|\.*$/g, '')  // Ensure the key doesn't start or end with a dot
        .toLowerCase();
}

function createFirestoreKey(key: string, value: string, delineator: string = '---'): string {
    if(key.length != 1) throw new Error("Key must be a single character");
    if(value.length > 500) throw new Error("Value must be less than 500 characters");
    return key + delineator + sanitizeKeyForFirestore(value);
}

function mapEventToFirestore(event: NostrEvent<number>): NostrFirestoreEvent {
    const { tags, ...eventWithoutTags } = event;
    const searchTags: { [key: string]: boolean } = {};

    for (const [key, value] of tags) {

        try {
            const firestoreKey = createFirestoreKey(key, value);    
            searchTags[firestoreKey] = true;
        } catch (e){
            continue;
        }
    }

    return {
        ...eventWithoutTags,
        searchTags,
        stringifiedEvent: JSON.stringify(event),
    };
}

async function uploadBatchedEvents(db: any, events: NostrFirestoreEvent[]){
    const batch = db.batch();

    for(const event of events){
        const eventRef = db.doc(`events/${event.id}`);
        batch.set(eventRef, event, { merge: true });
    }

    await batch.commit();
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

let relaySub: Sub<number>;
let relay: Relay;
let mostRecentEvent: number;

async function runServer(){

    let tries = 50;
    let fails = 0;
    const timeout = 30000;

    console.log("Connecting to firestore...");
    const db = admin.firestore();

    mostRecentEvent = await getMostRecentEventFromFile();

    console.log("Connecting to relay...");
    relay = relayInit('wss://relay.primal.net');
    await relay.connect();

    

    relaySub = relay.sub([]);
    relaySub.on('event', async (event: NostrEvent<number>) => {
        const mappedEvent = mapEventToFirestore(event);
        await uploadBatchedEvents(db, [mappedEvent]);
        console.log("Uploaded event", mappedEvent.id);
    });

    while(true){
        try {

            const startTime = Date.now();
            const data = await relay.list([
                {
                    limit: 500,
                    until: mostRecentEvent,
                    since: 0,
                }
            ], );
            const mappedData = data.map(mapEventToFirestore);
            mappedData.sort((a, b) => a.created_at - b.created_at);
            await uploadBatchedEvents(db, mappedData);

            const endTime = Date.now();
            const timeDifference = (endTime - startTime) / 1000;  // in seconds
            const averageEventsPerSecond = mappedData.length / timeDifference;

            if(mappedData.length == 0) throw new Error("No events found!");
            mostRecentEvent = mappedData[0].created_at;
            console.log(`${mostRecentEvent}: Uploaded ${mappedData.length} events in ${timeDifference.toFixed(2)} seconds for an average of ${averageEventsPerSecond.toFixed(2)}/s`);
            fails = 1;
        } catch(e){
            fails++;
            if(--tries < 0){
                console.log(e);
                cleanup();
                break;
            } else {    
                console.log(e);
                console.log(`Retrying in ${timeout * fails / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, timeout * fails));
            }
        }
    }
}

async function cleanup() {

    relaySub.unsub();
    relay.close();
    console.log("Last event:", mostRecentEvent);
    await saveMostRecentEventToFile(mostRecentEvent);

    process.exit();
}

process.on('SIGINT', async () => {
    console.log('\nReceived SIGINT (ctrl+c). Initiating cleanup...');
    await cleanup();
});


// runServer();


// ----------- TESTS -----------

async function runTest(){
    const tagToSearch = createFirestoreKey('t', 'nostr');
    const db = admin.firestore();
    const eventsRef = db.collection('events');
    const querySnapshot = await eventsRef.where(`searchTags.${tagToSearch}`, '==', true).get();
    // const querySnapshot = await eventsRef.where(`kind`, '==', 9735).get();

    if (querySnapshot.empty) {
        console.log('No matching documents found.');
        return;
    }

    console.log(`\nFound ${querySnapshot.size} matching documents for tag ${tagToSearch}`);
    querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
        console.log(doc.id);
    });
    console.log(`Found ${querySnapshot.size} matching documents for tag ${tagToSearch}\n`);

}

runTest();