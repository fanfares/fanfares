import { fetchMediaAccount, fetchMetadata, getBurnerProgram, getMetadataKey, MediaAccount } from '@excalibur/drm';
import { Metadata } from '@excalibur/metadata';
import { PublicKey } from '@solana/web3.js';
import { getConfig } from '@utils';
import { DrmMediaAccount } from 'src/controllers/drm-api/drm-media-account';
import { MEDIA_COLLECTION } from 'src/controllers/firebase/firebase';
import { createMediaMetadata } from 'src/controllers/utils/nft-metadata';
import { adminFirestore } from '../../controllers/firebase/server/firebase-admin';

export function drmMediaAccountToFirebseAccount(drmMedia: DrmMediaAccount) {
  return {
    media_duraion: drmMedia.duration ?? 0,
    media_size: drmMedia.size ?? 0,
    media_url: drmMedia.audioUrl,
    media_type: drmMedia.audioType,
    thumnail_type: drmMedia.thumbnailType,
    thumnail_url: drmMedia.thumbnailUri
  };
}

export function mediaAccountToFirebseAccount(mediaAccount: MediaAccount) {
  return {
    is_affiliate: mediaAccount.originalMedia.toString() !== mediaAccount.key.toString(),
    episode: mediaAccount.mediaCreationIndex.toNumber(),
    media_key: mediaAccount.key.toString(),
    creator_key: mediaAccount.originalUser.toString(),
    original_media: mediaAccount.originalMedia.toString(),
    owner_key: mediaAccount.originalOwner.toString(),
    sft_mint_key: mediaAccount.sftMint.toString(),
    state: mediaAccount.mintingState,
    creation_date_unix: mediaAccount.creationDate.toNumber() * 1000,
    lamports: mediaAccount.lamportsTotal.toNumber()
  };
}

export function updateMetadata(drmMedia: DrmMediaAccount): Metadata {
  return createMediaMetadata({
    name: drmMedia.name,
    description: drmMedia.description,
    artworkUrl: drmMedia.thumbnailUri,
    artworkType: drmMedia.thumbnailType,
    mediaUrl: drmMedia.audioUrl,
    mediaType: drmMedia.audioType,
    duration: drmMedia?.duration ?? 0,
    size: drmMedia?.size ?? 0,
    mediaKey: drmMedia.key,
    distro: drmMedia.metadataDistribution
  });
}

export async function fetchAndWriteMedia(mediaKeyString: string) {
  const mediaKey = new PublicKey(mediaKeyString);
  const connnection = getConfig().solanaConnection;
  const program = getBurnerProgram(connnection);

  // Fetch Blockchain Data
  const mediaAccount = await fetchMediaAccount(program, mediaKey);
  if (!mediaAccount) throw new Error('No Media Account');

  const mediaMetadataAccountKey = (await getMetadataKey(mediaAccount.sftMint))[0];
  const mediaMetadataAccount = await fetchMetadata(program.program.provider.connection, mediaMetadataAccountKey);

  if (!mediaMetadataAccount) throw new Error('No Media Metadata Account');

  const mediaMetadata = (await (await fetch(mediaMetadataAccount.data.uri)).json()) as Metadata;

  if (!mediaMetadata) throw new Error('No Media Metadata');

  const drmMedia = new DrmMediaAccount(mediaAccount, mediaMetadata);

  const newMetadata = await updateMetadata(drmMedia);

  const mediaFirebaseMetadata = {
    ...newMetadata,
    ...drmMediaAccountToFirebseAccount(drmMedia),
    ...mediaAccountToFirebseAccount(mediaAccount)
  };

  adminFirestore.collection(MEDIA_COLLECTION).doc(mediaAccount.key.toString()).set(mediaFirebaseMetadata);
}

// Trustless check on a peice of media
// eslint-disable-next-line
export default async (req, res) => {
  try {
    // ------------ Error Checking -----------------------
    if (req.method !== 'POST') throw new Error('Needs a post');

    const { mediaKeyString } = req.body;
    if (!mediaKeyString) throw new Error('Needs a media key string');

    await fetchAndWriteMedia(mediaKeyString);

    res.status(200).end();
  } catch (e) {
    res.status(400).end();
  }
};
