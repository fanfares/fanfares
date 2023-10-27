import { Invoice } from "utils"

export interface NoteEntry {
    noteId: string
    lud16: string
    price: number
    secret: string
    timestamp: number
  }


  export interface PREntry extends Invoice {
    noteId: string
    timestamp: number
    paymentStatus: "UNPAID" | "PAID"
  }
  