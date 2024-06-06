import { Keypair } from "@solana/web3.js";

export function secretToKeypair(secretString: string) {
  // Step 1: Remove the square brackets
  const trimmedSecret = secretString.slice(1, -1);

  // Step 2: Split the string by comma
  const secretArray = trimmedSecret.split(",");

  // Step 3: Convert each string to a number
  const secretBytes = secretArray.map((num) => parseInt(num.trim()));

  // Step 4: Convert the array of numbers to a Uint8Array
  const secretUint8Array = new Uint8Array(secretBytes);

  // Step 5: Create a Keypair from the Uint8Array
  const keypair = Keypair.fromSecretKey(secretUint8Array);

  return keypair;
}

export function formatFilePrefixedName(file: File, fileNamePrefix?: string) {
  // Sanitize the filename: remove spaces, special characters, and existing underscores
  let sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '');

  // If fileNamePrefix is provided, prepend it to the sanitized filename
  if (fileNamePrefix) {
      return `${fileNamePrefix}_${sanitizedFileName}`;
  }

  return sanitizedFileName;
}