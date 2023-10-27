// 00000014a2d0f6db9981fd1ec86acc94e0ef2d42d7a0c17c3a396991692d2426
import { fetchEvent } from "@/controllers/firestoreHelpers"

export default async function EventPage({ params }: any) {
  const event = await fetchEvent(params.e)

  return (
    <>
      <p>{event.id}</p>
      <p>{event.content}</p>
    </>
  )
}
