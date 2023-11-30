import { PublicKey } from '@solana/web3.js';
import { MEDIA_PLAYS_COLLECTION } from 'src/controllers/firebase/firebase';
import { adminFirestore } from '../../controllers/firebase/server/firebase-admin';

export async function writeMediaPlay(mediaKeyString: string) {
  const mediaKey = new PublicKey(mediaKeyString);
  const docRef = adminFirestore.collection(MEDIA_PLAYS_COLLECTION).doc(mediaKey.toString());

  const latest_play_unix = Date.now();

  try {
    await adminFirestore.runTransaction(async transaction => {
      const doc = await transaction.get(docRef);

      const plays = doc.exists ? doc.data().plays + 1 : 1;

      const mediaPlayFirebaseMetadata = {
        plays,
        latest_play_unix
      };

      transaction.set(docRef, mediaPlayFirebaseMetadata);
    });
  } catch (error) {
    console.error('Error updating play count: ', error);
  }
}

// Trustless check on a peice of media
// eslint-disable-next-line
export default async (req, res) => {
  try {
    // ------------ Error Checking -----------------------
    if (req.method !== 'POST') throw new Error('Needs a post');

    const { mediaKeyString } = req.body;
    if (!mediaKeyString) throw new Error('Needs a media key string');

    await writeMediaPlay(mediaKeyString);

    res.status(200).end();
  } catch (e) {
    res.status(400).end();
  }
};
