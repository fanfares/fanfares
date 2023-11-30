import { PublicKey } from '@solana/web3.js';
import { MEDIA_COLLECTION } from 'src/controllers/firebase/firebase';
import { adminFirestore } from '../../controllers/firebase/server/firebase-admin';
import { fetchAndWriteMedia } from './tick-media';

// Trustless check on a peice of media
// eslint-disable-next-line
export default async (req, res) => {
  try {
    // ------------ Error Checking -----------------------
    if (req.method !== 'POST') throw new Error('Needs a POST');

    const { mediaKeyString } = req.body;
    if (!mediaKeyString) throw new Error('Needs a media key string');

    const mediaKey = new PublicKey(mediaKeyString);
    let snapshot = await adminFirestore.collection(MEDIA_COLLECTION).doc(mediaKey.toString()).get();

    if (!snapshot.exists) {
      await fetchAndWriteMedia(mediaKeyString);
      snapshot = await adminFirestore.collection(MEDIA_COLLECTION).doc(mediaKey.toString()).get();
      if (!snapshot.exists) {
        throw new Error('Media does not exsist');
      }
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(snapshot.data()));
  } catch (e) {
    res.status(400).end();
  }
};
