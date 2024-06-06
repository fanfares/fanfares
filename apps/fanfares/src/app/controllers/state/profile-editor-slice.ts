import { StateCreator, create } from "zustand"
import { CombinedState } from "./old/use-app-state"
import { NostrProfile } from "utils"
import { SimplePool } from "nostr-tools"
import { uploadToShdwDrive } from "../shdw/upload"
import { NostrAccount } from "./account-slice"

export interface ProfileEditorSlice {
  profileEditorDisplayName?: string
  profileEditorUsername?: string
  profileEditorWebsite?: string
  profileEditorAboutMe?: string
  profileEditorLud16?: string
  profileEditorLoading: boolean
  profileEditorDidUpload: boolean
  profileEditorImageFile: File | null
  profileEditorImageUrl?: string
  actions: {
    clearToProfile: (profile: NostrProfile) => void
    submit: (
      nostrPool: SimplePool,
      nostrRelays: string[],
      nostrProfile: NostrProfile,
      nostrAccount: NostrAccount,
    ) => Promise<void>
    setDisplayName: (displayName: string) => void
    setUsername: (username: string) => void
    setWebsite: (website: string) => void
    setAboutMe: (aboutMe: string) => void
    setLud16: (lud16: string) => void
    handleImageFileChange: (event: any) => void
  }
}

const DEFAULT_STATE: ProfileEditorSlice = {
  profileEditorDisplayName: "",
  profileEditorUsername: "",
  profileEditorWebsite: "",
  profileEditorAboutMe: "",
  profileEditorLud16: "",
  profileEditorImageFile: null,
  profileEditorImageUrl: "",
  profileEditorLoading: false,
  profileEditorDidUpload: false,
  actions: {
    clearToProfile: () => {},
    submit: async () => {},
    setDisplayName: () => {},
    setUsername: () => {},
    setWebsite: () => {},
    setAboutMe: () => {},
    setLud16: () => {},
    handleImageFileChange: () => {},
  },
}

export const createProfileEditorSlice: StateCreator<
  ProfileEditorSlice,
  [],
  [],
  ProfileEditorSlice
> = (set, get) => {

  const clearToProfile = (profile: NostrProfile) => {
    set({
      profileEditorDisplayName: profile.display_name,
      profileEditorUsername: profile.name,
      profileEditorWebsite: profile.website,
      profileEditorAboutMe: profile.about,
      profileEditorLud16: profile.lud16,
      profileEditorImageUrl: profile.picture,
      profileEditorImageFile: null,
      profileEditorDidUpload: false,
    })
  }

  const submit = async (
    nostrPool: SimplePool,
    nostrRelays: string[],
    nostrProfile: NostrProfile,
    nostrAccount: NostrAccount
  ) => {

    const { 
      profileEditorImageFile,
      profileEditorLoading,
      profileEditorDidUpload
    } = get()

    if (profileEditorLoading) return

    set({ profileEditorLoading: true })

    try {

      if(profileEditorImageFile && !profileEditorDidUpload){
        const prefix = "profile"
        const fileUrls = await uploadToShdwDrive([profileEditorImageFile], prefix)
        if(fileUrls.length === 0){
          throw new Error("Failed to upload image")
        }

        set({ 
          profileEditorImageUrl: fileUrls[0],
          profileEditorDidUpload: true,
        })
      }

      const {
        profileEditorDisplayName,
        profileEditorUsername,
        profileEditorWebsite,
        profileEditorAboutMe,
        profileEditorLud16,
        profileEditorImageUrl,
        profileEditorDidUpload: didUpload,
      } = get()

      const profileUpdate: NostrProfile = {
        ...nostrProfile,
        display_name: profileEditorDisplayName ? profileEditorDisplayName : nostrProfile.display_name,
        name: profileEditorUsername ? profileEditorUsername : nostrProfile.name,
        website: profileEditorWebsite ? profileEditorWebsite : nostrProfile.website,
        about: profileEditorAboutMe ? profileEditorAboutMe : nostrProfile.about,
        lud16: profileEditorLud16 ? profileEditorLud16 : nostrProfile.lud16,
        picture: (didUpload && profileEditorImageUrl) ? profileEditorImageUrl : nostrProfile.picture,
      }

      const content = JSON.stringify(profileUpdate);

      const event = {
        kind: 0,
        pubkey: nostrAccount.accountPublicKey,
        created_at: Math.floor(Date.now() / 1000),
        tags: [],
        content,
      };

      const singedEvent = await nostrAccount.accountNIP07?.signEvent(event);
      if(!singedEvent) throw new Error("Failed to sign event");

      await nostrPool.publish(nostrRelays, singedEvent); 

    } catch (error) {
      throw new Error(`Failed to update account - ${error}`)
    } finally {
      set({ profileEditorLoading: false })
    }

  }


  const setUsername = (userName: string) => {
    set({ profileEditorUsername: userName })
  }
  const setDisplayName = (displayName: string) => {
    set({ profileEditorDisplayName: displayName })
  }

  const setWebsite = (website: string) => {
    set({ profileEditorWebsite: website })
  }

  const setAboutMe = (aboutMe: string) => {
    set({ profileEditorAboutMe: aboutMe })
  }

  const setLud16 = (lud16: string) => {
    set({ profileEditorLud16: lud16 })
  }

  const handleImageFileChange = (event: any) => {
    const fileList = event.target.files as FileList
    const file = fileList.item(0)

    console.log(file)

    if(!file) return;

    set({ 
      profileEditorImageFile: file,
      profileEditorImageUrl: URL.createObjectURL(file),
    })
  }

  return {
    ...DEFAULT_STATE,
    actions: {
      ...DEFAULT_STATE.actions,
      clearToProfile,
      submit,
      setDisplayName,
      setUsername,
      setWebsite,
      setAboutMe,
      setLud16,
      handleImageFileChange,
    }

  }
}

const useProfileEditorSlice = create<ProfileEditorSlice>(
  createProfileEditorSlice
);
export const useProfileEditorLoading = () =>
  useProfileEditorSlice(state => state.profileEditorLoading)
export const useProfileEditorUsername = () =>
  useProfileEditorSlice(state => state.profileEditorUsername)
export const useProfileEditorDisplayName = () =>
  useProfileEditorSlice(state => state.profileEditorDisplayName)
export const useProfileEditorWebsite = () =>
  useProfileEditorSlice(state => state.profileEditorWebsite)
export const useProfileEditorAboutMe = () =>
  useProfileEditorSlice(state => state.profileEditorAboutMe)
export const useProfileEditorLud16 = () =>
  useProfileEditorSlice(state => state.profileEditorLud16)
export const useProfileEditorImageFile = () =>
  useProfileEditorSlice(state => state.profileEditorImageFile)
export const useProfileEditorImageUrl = () =>
  useProfileEditorSlice(state => state.profileEditorImageUrl)
export const useProfileEditorActions = () =>
  useProfileEditorSlice(state => state.actions)
