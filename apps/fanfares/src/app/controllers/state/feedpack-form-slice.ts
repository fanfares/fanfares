import { StateCreator, create } from "zustand"
import { CombinedState } from "./old/use-app-state"
import { toast } from "react-toastify"

export interface FeedbackInputs {
  lud16: string
  publicKey: string
  email: string
  message: string
}

export interface FeedbackFormSlice {
  feedbackLud16: string
  feedbackPublicKey: string
  feedbackEmail: string
  feedbackMessage: string
  feedbackFormLoading: boolean
  actions: {
    clear: () => void
    submit: () => Promise<void>
    setLud16: (lud16: string) => void
    setPublicKey: (publicKey: string) => void
    setEmail: (email: string) => void
    setMessage: (message: string) => void
  }
}

const DEFAULT_STATE: FeedbackFormSlice = {
  feedbackLud16: "",
  feedbackPublicKey: "",
  feedbackEmail: "",
  feedbackMessage: "",
  feedbackFormLoading: false,
  actions: {
    clear: () => {},
    submit: async () => {},
    setLud16: () => {},
    setPublicKey: () => {},
    setEmail: () => {},
    setMessage: () => {},
  },
}

export const createFeedbackFormSlice: StateCreator<
  FeedbackFormSlice,
  [],
  [],
  FeedbackFormSlice
> = (set, get) => {
  const clear = () => {
    set({
      feedbackEmail: "",
      feedbackMessage: "",
      feedbackFormLoading: false,
    })
  }

  const submit = async () => {
    const {
      feedbackLud16,
      feedbackPublicKey,
      feedbackEmail,
      feedbackMessage,
      feedbackFormLoading,
    } = get()

    if (feedbackFormLoading) return

    try {
      if (!feedbackLud16) throw new Error("Alby address is required")
      if (!feedbackEmail) throw new Error("Email is required")
      if (!feedbackMessage) throw new Error("Message is required")
      if (!feedbackPublicKey) throw new Error("Public Key is required")

      set({ feedbackFormLoading: true })

      const inputs: FeedbackInputs = {
        lud16: feedbackLud16,
        publicKey: feedbackPublicKey,
        email: feedbackEmail,
        message: feedbackMessage,
      }

      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      })

      if (!response.ok)
        throw new Error(`Error sending email - ${response.statusText}`)

      toast.success("Feedback sent!")
      clear()
    } catch (e) {
      toast.error(`Error sending email - ${e}`)
    } finally {
      set({ feedbackFormLoading: false })
    }
  }

  const setLud16 = (lud16: string) => {
    set({ feedbackLud16: lud16 })
  }

  const setPublicKey = (publicKey: string) => {
    set({ feedbackPublicKey: publicKey })
  }

  const setEmail = (email: string) => {
    set({ feedbackEmail: email })
  }

  const setMessage = (message: string) => {
    set({ feedbackMessage: message })
  }

  return {
    ...DEFAULT_STATE,
    actions: {
      clear,
      submit,
      setLud16,
      setPublicKey,
      setEmail,
      setMessage,
    },
  }
}

const useFeedbackFormSlice = create<FeedbackFormSlice>(createFeedbackFormSlice)
export const useFeedbackFormLoading = () =>
  useFeedbackFormSlice(state => state.feedbackFormLoading)
export const useFeedbackFormLud16 = () =>
  useFeedbackFormSlice(state => state.feedbackLud16)
export const useFeedbackFormPublicKey = () =>
  useFeedbackFormSlice(state => state.feedbackPublicKey)
export const useFeedbackFormEmail = () =>
  useFeedbackFormSlice(state => state.feedbackEmail)
export const useFeedbackFormMessage = () =>
  useFeedbackFormSlice(state => state.feedbackMessage)
export const useFeedbackFormActions = () =>
  useFeedbackFormSlice(state => state.actions)
