import { Database } from "bun:sqlite"
import { Invoice } from "utils/lightning"
import { NoteEntry, PREntry } from "./models"

// ---------------- SECURITY ------------------
const NOTE_TABLE = process.env.DB_NOTE_TABLE as string
const PR_TABLE = process.env.DB_PR_TABLE as string

function checkIfIsTableOk(table: string) {
  if (table !== NOTE_TABLE && table !== PR_TABLE) {
    throw new Error("Bad table")
  }
}

function checkIfClientInputsAreOk(inputs: string[]): void {
  const alphanumericRegex = /^[a-z0-9]+$/i // Matches a string that contains only letters and numbers
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/ // Matches a basic email format

  for (const input of inputs) {
    if (!alphanumericRegex.test(input) && !emailRegex.test(input)) {
      throw new Error(
        `Input "${input}" is neither alphanumeric nor a valid email.`
      )
    }
  }
}

function checkIfPrEntryIsOkay(
  entry: Omit<PREntry, "timestamp" | "paymentStatus"> | PREntry
): void {
  const alphanumericRegex = /^[a-z0-9]+$/i
  const urlRegex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/

  // Check for required fields
  if (!entry.paymentHash || !entry.noteId || !entry.pr || !entry.verify) {
    throw new Error("Missing required fields in the PREntry.")
  }

  // Check the format of required alphanumeric fields
  if (
    !alphanumericRegex.test(entry.paymentHash) ||
    !alphanumericRegex.test(entry.noteId) ||
    !alphanumericRegex.test(entry.pr) ||
    !urlRegex.test(entry.verify)
  ) {
    throw new Error("Required fields of PREntry should be alphanumeric.")
  }

  // Check status
  if (entry.status !== "OK" && entry.status !== "ERROR") {
    throw new Error(`Invalid status in PREntry: ${entry.status}`)
  }

  // Check successAction
  if (
    entry.successAction.tag !== "url" ||
    !urlRegex.test(entry.successAction.url)
    // !alphanumericRegex.test(entry.successAction.description) <- Don't need to test since we stringify it.
  ) {
    throw new Error("Invalid successAction in PREntry.")
  }

  // Check routes
  if (entry.routes.some(route => !alphanumericRegex.test(route))) {
    throw new Error("Invalid routes in PREntry.")
  }

  // Check optional fields
  if (
    "paymentStatus" in entry &&
    entry.paymentStatus !== "UNPAID" &&
    entry.paymentStatus !== "PAID"
  ) {
    throw new Error(`Invalid paymentStatus in PREntry: ${entry.paymentStatus}`)
  }

  if ("timestamp" in entry && typeof entry.timestamp !== "number") {
    throw new Error(`Invalid timestamp in PREntry: ${entry.timestamp}`)
  }
}

// ---------------- TABLE SETUP ------------------

export function setupNoteTable(db: Database, table: string) {
  checkIfIsTableOk(table)

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${table} (
      noteId TEXT PRIMARY KEY,
      price INTEGER,
      lud16 TEXT,
      secret TEXT,
      timestamp INTEGER
    );
  `

  db.query(createTableQuery).run()
}

export function setupPRTable(db: Database, table: string) {
  checkIfIsTableOk(table)

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS ${table} (
      paymentHash TEXT PRIMARY KEY,
      noteId TEXT,
      pr TEXT,
      verify TEXT,
      status TEXT,
      paymentStatus TEXT,
      successAction TEXT,
      routes TEXT,
      timestamp INTEGER
    );
  `

  db.query(createTableQuery).run()
}

// ------------------- NOTE ENTRIES ------------------------

export function createNoteEntry(
  db: Database,
  table: string,
  noteId: string,
  lud16: string,
  secret: string,
  price: number
) {
  checkIfClientInputsAreOk([noteId, lud16, secret, price.toString()])
  checkIfIsTableOk(table)

  const timestamp = Math.floor(Date.now()) // Current Unix timestamp

  const insertQuery = db.query(`
      INSERT INTO ${table} (noteId, price, lud16, secret, timestamp)
      VALUES ($noteId, $price, $lud16, $secret, $timestamp);
    `)

  insertQuery.run({
    $noteId: noteId,
    $price: price,
    $lud16: lud16,
    $secret: secret,
    $timestamp: timestamp,
  })
}

export function getNoteEntry(
  db: Database,
  table: string,
  noteId: string
): NoteEntry {
  checkIfClientInputsAreOk([noteId])
  checkIfIsTableOk(table)

  const selectQuery = db.query(`SELECT * FROM ${table} WHERE noteId = $noteId`)
  const result = selectQuery.get({ $noteId: noteId }) as NoteEntry | undefined

  if (!result) {
    throw new Error(`No entry found for noteId: ${noteId}`)
  }

  return result
}

export function changeNotePrice(
  db: Database,
  table: string,
  noteId: string,
  newPrice: number
) {
  checkIfClientInputsAreOk([noteId, newPrice.toString()])
  checkIfIsTableOk(table)

  const selectQuery = db.query(`SELECT * FROM ${table} WHERE noteId = $noteId`)
  const entry = selectQuery.get({ $noteId: noteId })

  if (!entry) {
    throw new Error(`No entry found with noteId: ${noteId}`)
  }

  const updateQuery = db.query(
    `UPDATE ${table} SET price = $price WHERE noteId = $noteId`
  )
  updateQuery.run({ $noteId: noteId, $price: newPrice })
}

// ------------------- PR ENTRIES ------------------------
export function createPrEntry(
  db: Database,
  table: string,
  entry: Omit<PREntry, "timestamp" | "paymentStatus"> | PREntry
) {
  checkIfPrEntryIsOkay(entry)
  checkIfIsTableOk(table)

  const timestamp = Math.floor(Date.now() / 1000) // Current Unix timestamp
  const paymentStatus = "UNPAID"

  const insertQuery = db.query(`
      INSERT INTO ${table} (paymentHash, noteId, pr, verify, status, paymentStatus, successAction, routes, timestamp)
      VALUES ($paymentHash, $noteId, $pr, $verify, $status, $paymentStatus, $successAction, $routes, $timestamp);
    `)

  insertQuery.run({
    $paymentHash: entry.paymentHash,
    $noteId: entry.noteId,
    $pr: entry.pr,
    $verify: entry.verify,
    $status: entry.status,
    $paymentStatus: paymentStatus,
    $successAction: JSON.stringify(entry.successAction), // Assuming this is an object and storing it as a string
    $routes: JSON.stringify(entry.routes), // Assuming you want to store the routes array as a string
    $timestamp: timestamp,
  })

  return getPREntry(db, table, entry.paymentHash)
}

export function getPREntry(
  db: Database,
  table: string,
  paymentHash: string
): PREntry {
  checkIfClientInputsAreOk([paymentHash])
  checkIfIsTableOk(table)

  const selectQuery = db.query(
    `SELECT * FROM ${table} WHERE paymentHash = $paymentHash`
  )
  const rawResult = selectQuery.get({ $paymentHash: paymentHash }) as PREntry

  if (!rawResult) {
    throw new Error(`No entry found with paymentHash: ${paymentHash}`)
  }

  // Deserialize properties that were stringified
  const result: PREntry = {
    ...rawResult,
    successAction: JSON.parse((rawResult as any).successAction),
    routes: JSON.parse((rawResult as any).routes),
  }

  return result
}

export function markPaid(
  db: Database,
  table: string,
  paymentHash: string
): void {
  checkIfClientInputsAreOk([paymentHash])
  checkIfIsTableOk(table)

  const prEntry = getPREntry(db, table, paymentHash)

  const updateQuery = db.query(`
        UPDATE ${table}
        SET paymentStatus = $newStatus
        WHERE paymentHash = $paymentHash;
    `)

  updateQuery.run({
    $paymentHash: prEntry.paymentHash,
    $newStatus: "PAID",
  })
}
