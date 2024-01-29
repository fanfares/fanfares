import { StateCreator, create } from "zustand"
import { CombinedState } from "./old/use-app-state"

export interface SupportInputs {
  name: string
  email: string
  message: string
}

export interface SupportFormSlice {
  supportName: string
  supportEmail: string
  supportMessage: string
  supportFormLoading: boolean
  actions: {
    clear: () => void
    submit: () => Promise<void>
    setName: (name: string) => void
    setEmail: (email: string) => void
    setMessage: (message: string) => void
  }
}

const DEFAULT_STATE: SupportFormSlice = {
  supportName: "",
  supportEmail: "",
  supportMessage: "",
  supportFormLoading: false,
  actions: {
    clear: () => {},
    submit: async () => {},
    setName: () => {},
    setEmail: () => {},
    setMessage: () => {},
  },
}

export const createSupportFormSlice: StateCreator<
  SupportFormSlice,
  [],
  [],
  SupportFormSlice
> = (set, get) => {
  const clear = () => {
    set({
      supportName: "",
      supportEmail: "",
      supportMessage: "",
      supportFormLoading: false,
    })
  }

  const submit = async () => {
    const { supportName, supportEmail, supportMessage, supportFormLoading } =
      get()

    if (supportFormLoading) return

    try {
      if (!supportName) throw new Error("Name is required")
      if (!supportEmail) throw new Error("Email is required")
      if (!supportMessage) throw new Error("Message is required")

      set({ supportFormLoading: true })

      const inputs: SupportInputs = {
        name: supportName,
        email: supportEmail,
        message: supportMessage,
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
      set({ supportFormLoading: false })
    }
  }

  const setName = (name: string) => {
    set({ supportName: name })
  }

  const setEmail = (email: string) => {
    set({ supportEmail: email })
  }

  const setMessage = (message: string) => {
    set({ supportMessage: message })
  }

  return {
    ...DEFAULT_STATE,
    actions: {
      clear,
      submit,
      setName,
      setEmail,
      setMessage,
    },
  }
}

const useSupportFormSlice = create<SupportFormSlice>(createSupportFormSlice)
export const useSupportFormLoading = () =>
  useSupportFormSlice(state => state.supportFormLoading)
export const useSupportFormName = () =>
  useSupportFormSlice(state => state.supportName)
export const useSupportFormEmail = () =>
  useSupportFormSlice(state => state.supportEmail)
export const useSupportFormMessage = () =>
  useSupportFormSlice(state => state.supportMessage)
export const useSupportFormActions = () =>
  useSupportFormSlice(state => state.actions)
