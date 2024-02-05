import { StateCreator, create } from "zustand"
import { CombinedState } from "./old/use-app-state"

export interface ProfileEditorInputs {
  displayName: string
  username: string
  website: string
  aboutMe: string
  lud16: string
}

export interface ProfileEditorSlice {
  profileEditorDisplayName: string
  profileEditorUsername: string
  profileEditorWebsite: string
  profileEditorAboutMe: string
  profileEditorLud16: string
  profileEditorLoading: boolean
  actions: {
    clear: () => void
    submit: () => Promise<void>
    setDisplayName: (displayName: string) => void
    setUsername: (username: string) => void
    setWebsite: (website: string) => void
    setAboutMe: (aboutMe: string) => void
    setLud16: (lud16: string) => void
  }
}

const DEFAULT_STATE: ProfileEditorSlice = {
  profileEditorDisplayName: "",
  profileEditorUsername: "",
  profileEditorWebsite: "",
  profileEditorAboutMe: "",
  profileEditorLud16: "",
  profileEditorLoading: false,
  actions: {
    clear: () => {},
    submit: async () => {},
    setDisplayName: () => {},
    setUsername: () => {},
    setWebsite: () => {},
    setAboutMe: () => {},
    setLud16: () => {},
  },
}

export const createProfileEditorSlice: StateCreator<
  ProfileEditorSlice,
  [],
  [],
  ProfileEditorSlice
> = (set, get) => {
  const clear = () => {
    set({
      profileEditorDisplayName: "",
      profileEditorUsername: "",
      profileEditorWebsite: "",
      profileEditorAboutMe: "",
      profileEditorLud16: "",
      profileEditorLoading: false,
    })
  }

  const submit = async () => {
    const {
      profileEditorDisplayName: displayName,
      profileEditorUsername: username,
      profileEditorWebsite: website,
      profileEditorAboutMe: aboutMe,
      profileEditorLud16: lud16,
      profileEditorLoading: supportFormLoading,
    } = get()

    if (supportFormLoading) return

    try {
      if (!displayName) throw new Error("Display Name is required")
      if (!username) throw new Error("Username is required")
      if (!lud16) throw new Error("Lightning Address is required")

      set({ profileEditorLoading: true })

      const inputs: ProfileEditorInputs = {
        displayName: displayName,
        username: username,
        website: website,
        aboutMe: aboutMe,
        lud16: lud16,
      }

      const response = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      })

      if (!response.ok)
        throw new Error(`Error sending email - ${response.statusText}`)

      alert("Support Message sent!")
      clear()
    } catch (e) {
      alert(`Error sending email - ${e}`)
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

  return {
    ...DEFAULT_STATE,
    actions: {
      clear,
      submit,
      setDisplayName,
      setUsername,
      setWebsite,
      setAboutMe,
      setLud16,
    },
  }
}

const useProfileEditorSlice = create<ProfileEditorSlice>(
  createProfileEditorSlice
)
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
export const useProfileEditorActions = () =>
  useProfileEditorSlice(state => state.actions)
