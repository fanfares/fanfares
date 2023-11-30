import { fetchMetadata, fetchUserAccount, getBurnerProgram, UserAccount } from '@excalibur/drm';
import { PublicKey } from '@solana/web3.js';
import { getConfig } from '@utils';
import { CREATOR_COLLECTION } from 'src/controllers/firebase/firebase';
import { adminFirestore } from '../../controllers/firebase/server/firebase-admin';

export function creatorAccountToFirebseAccount(creatorAccount: UserAccount) {
  return {
    episodes: creatorAccount.mediaCreationCount.toNumber(),
    creator_key: creatorAccount.key.toString(),
    owner_key: creatorAccount.owner.toString(),
    collection_mint_key: creatorAccount.collectionMint.toString(),
    creation_date_unix: creatorAccount.creationDate.toNumber() * 1000,
    lamports: creatorAccount.lamportsTotal.toNumber()
  };
}

export async function fetchAndWriteCreator(creatorKeyString: string) {
  const creatorKey = new PublicKey(creatorKeyString);
  const connnection = getConfig().solanaConnection;
  const program = getBurnerProgram(connnection);

  // Fetch Blockchain Data
  const creatorAccount = await fetchUserAccount(program, creatorKey);
  if (!creatorAccount) throw new Error('No Media Account');

  const creatorMetadataAccount = await fetchMetadata(
    program.program.provider.connection,
    creatorAccount.collectionMetadata
  );

  if (!creatorMetadataAccount) throw new Error('No Media Metadata Account');

  const creatorMetadata = await (await fetch(creatorMetadataAccount.data.uri)).json();

  if (!creatorMetadata) throw new Error('No Media Metadata');

  const creatorFirebaseMetadata = {
    ...creatorMetadata,
    ...creatorAccountToFirebseAccount(creatorAccount)
  };

  adminFirestore.collection(CREATOR_COLLECTION).doc(creatorAccount.owner.toString()).set(creatorFirebaseMetadata);
}

// Trustless check on a peice of media
// eslint-disable-next-line
export default async (req, res) => {
  try {
    // ------------ Error Checking -----------------------
    if (req.method !== 'POST') throw new Error('Needs a post');

    const { creatorKeyString } = req.body;
    if (!creatorKeyString) throw new Error('Needs a creator key string');

    await fetchAndWriteCreator(creatorKeyString);

    res.status(200).end();
  } catch (e) {
    res.status(400).end();
  }
};
