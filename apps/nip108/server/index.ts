import express from "express"
import cors from "cors"
import bodyParser from "body-parser"
import { checkPaid, getInvoice } from "utils/lightning"
import { Database } from "bun:sqlite"
import {
  createNoteEntry,
  createPrEntry,
  getNoteEntry,
  getPREntry,
  markPaid,
  setupNoteTable,
  setupPRTable,
} from "nip108"
import { CreateNotePostBody, verifyCreateNote } from "nip108"
import { Action, Status, serverLog } from "utils/logging"

// ------------------- DATABASE SETUP ------------------

const DB = new Database(Bun.env.DB_FILENAME, { create: true })
const NOTE_TABLE = Bun.env.DB_NOTE_TABLE as string
const PR_TABLE = Bun.env.DB_PR_TABLE as string

setupNoteTable(DB, NOTE_TABLE) // Setup the table immediately after its definition
setupPRTable(DB, PR_TABLE) // Setup the table immediately after its definition

// -------------------- SERVER SETUP --------------------

const APP = express()
const SERVER_PORT = Number(Bun.env.SERVER_PORT)
const GATE_SERVER = `${Bun.env.NEXT_PUBLIC_GATE_SERVER as string}`

APP.use(cors())
APP.use(bodyParser.json())

APP.post("/create", async (request, response) => {
  try {
    const postBody: CreateNotePostBody = request.body

    await verifyCreateNote(postBody, GATE_SERVER)

    await createNoteEntry(
      DB,
      NOTE_TABLE,
      postBody.gateEvent.id,
      postBody.lud16,
      postBody.secret,
      postBody.cost
    )

    serverLog(
      Action.CREATE,
      Status.SUCCESS,
      `Created: ${postBody.gateEvent.id}`
    )
    response.status(200).send({ message: "Saved gated note!" })
  } catch (e: any) {
    serverLog(Action.CREATE, Status.ERROR, `${e.toString()}`)
    response.status(e.status ?? 500).send({ error: e.toString() })
  }
})

APP.get("/:noteId", async (request, response) => {
  try {
    const noteId = request.params.noteId

    const noteEntry = getNoteEntry(DB, NOTE_TABLE, noteId)

    const invoice = await getInvoice(
      noteEntry.lud16,
      GATE_SERVER,
      noteEntry.price,
      noteId
    )

    const prEntry = createPrEntry(DB, PR_TABLE, {
      noteId,
      ...invoice,
    })

    serverLog(Action.GET_INVOICE, Status.SUCCESS, `Send invoice: ${noteId}`)
    response.status(402).send(prEntry)
  } catch (e: any) {
    serverLog(Action.GET_INVOICE, Status.ERROR, `${e.toString()}`)
    response.status(e.status ?? 500).send({ error: e.toString() })
  }
})

APP.get("/:noteId/:paymentHash", async (request, response) => {
  try {
    const noteId = request.params.noteId
    const paymentHash = request.params.paymentHash
    const noteEntry = getNoteEntry(DB, NOTE_TABLE, noteId)
    const prEntry = getPREntry(DB, PR_TABLE, paymentHash)

    if (noteEntry.noteId !== prEntry.noteId) {
      throw new Error(
        "The payment hash provided is not associated with the note ID"
      )
    }

    if (prEntry.paymentStatus === "PAID") {
      serverLog(Action.GET_RESULT, Status.SUCCESS, `Returned Secret: ${noteId}`)
      response.status(200).send(noteEntry)
      return
    }

    const verify = await checkPaid(prEntry.verify)

    if (!verify.settled) {
      serverLog(Action.GET_RESULT, Status.SUCCESS, `Not yet paid: ${noteId}`)
      response.status(402).send(prEntry)
      return
    }

    markPaid(DB, PR_TABLE, paymentHash)

    serverLog(
      Action.GET_RESULT,
      Status.SUCCESS,
      `Paid and returned secret: ${noteId}`
    )
    response.status(200).send(noteEntry)
  } catch (e: any) {
    serverLog(Action.GET_RESULT, Status.ERROR, `${e.toString()}`)
    response.status(e.status ?? 500).send({ error: e.toString() })
  }
})

APP.listen(SERVER_PORT, () => {
  serverLog(
    Action.SERVER,
    Status.INFO,
    "Welcome to NIP-108: Lightning Gated Notes"
  )
  serverLog(Action.SERVER, Status.INFO, `Listening on port ${SERVER_PORT}...`)
})
