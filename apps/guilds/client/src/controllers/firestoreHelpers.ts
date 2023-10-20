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
