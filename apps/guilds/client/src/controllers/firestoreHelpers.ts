
import { VerifiedEvent } from "nostr-tools"

const NEXT_REVALIDATE = 10 //TODO put in .env

export async function fetchEvent(e: string): Promise<VerifiedEvent<number>> {
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/excalibur-guilds/databases/(default)/documents/events/${e}`,
    {
      next: { revalidate: NEXT_REVALIDATE },
    }
  )

  const rawData = await res.json()
  const event: VerifiedEvent<number> = JSON.parse(
    rawData.fields.stringifiedEvent.stringValue
  )
  return event
}

export async function fetchProfile(p: string): Promise<VerifiedEvent<number>> {
  const res = await fetch(
    `https://firestore.googleapis.com/v1/projects/excalibur-guilds/databases/(default)/documents/events/${p}`,
    {
      next: { revalidate: NEXT_REVALIDATE },
    }
  )

  const rawData = await res.json()
  const event: VerifiedEvent<number> = JSON.parse(
    rawData.fields.stringifiedEvent.stringValue
  )
  return event
}

export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDC3BUW1Xm8TJm3X6zKIAt4WwKtFciGU_o",
  authDomain: "excalibur-guilds.firebaseapp.com",
  projectId: "excalibur-guilds",
  storageBucket: "excalibur-guilds.appspot.com",
  messagingSenderId: "930297284994",
  appId: "1:930297284994:web:0b4d2a045d2de68c9e279b",
  measurementId: "G-5B9PX32SFT"
};