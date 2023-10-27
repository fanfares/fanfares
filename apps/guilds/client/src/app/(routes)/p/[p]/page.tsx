import { fetchProfile } from "@/controllers/firestoreHelpers"

export default async function ProfilePage({ params }: any) {
  const profile = await fetchProfile(params.p)

  return <p>Profile {profile.id}</p>
}
