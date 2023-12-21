import { MessageSignRequest, MessageSignResponse } from '@/app/controllers/shdw/upload';
import { secretToKeypair } from '@/app/controllers/shdw/utils'
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import crypto from 'crypto';

// https://docs.shdwdrive.com/build/the-api
export const SHDW_STORAGE_ACCOUNT = process.env.SDHW_STORAGE as string;
export const SHDW_DRIVE_ENDPOINT = "https://us.shadow.cloud";
export const SHDW_TEMP_HASH = "[TEMP_HASH]";
export const SHDW_MESSAGE_BASE = `ShdwDrive Signed Message:\nStorage Account: ${SHDW_STORAGE_ACCOUNT}\nUpload files with hash: ${SHDW_TEMP_HASH}`;

export async function POST(request: Request) {

  try {
    // Gather Request Data
    const postEndpoint = `${SHDW_DRIVE_ENDPOINT}/upload`;
    const storageAccount = SHDW_STORAGE_ACCOUNT;
    const keypair = secretToKeypair(process.env.SOLANA_SIGNER as string)
    const signer = keypair.publicKey.toString()

    // Parse Request
    const requestJSON = await request.json() as MessageSignRequest;
    const { fileNames } = requestJSON;

    // Validate Request
    if(!fileNames) throw new Error("Missing file names");
    if(fileNames.length > 300) throw new Error("File names too long");

    // Hash filename
    const hashSum = crypto.createHash("sha256")
    const hashedFileNames = hashSum.update(fileNames)
    const fileNamesHashed = hashSum.digest("hex")

    // Create Message
    const message = SHDW_MESSAGE_BASE.replace(SHDW_TEMP_HASH, fileNamesHashed);
    
    // Sign Message
    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = nacl.sign.detached(encodedMessage, keypair.secretKey);
    const signature = bs58.encode(signedMessage)

    // Create Response
    const response: MessageSignResponse = {
      storageAccount,
      signer,
      signature,
      message,
      postEndpoint,
      fileNamesHashed
    }

    return Response.json(response)

  } catch (e) {
    return new Response(`Error: ${e}`, { status: 500 })
  }
}