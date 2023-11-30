import { MetadataDistribution } from '@excalibur/metadata';
import { PublicKey } from '@solana/web3.js';
import { validate } from 'bitcoin-address-validation';
import { MAX_DESCRIPTION_LENGTH, MAX_TITLE_LENGTH } from 'src/controllers/utils/nft-metadata';

export interface MediaUploadFormData {
  name: string;
  description: string;
  duration: string;
  thumbnail: File | null;
  media: File;
  creators: MetadataDistribution[];
  mintPrice: number;
  btcWallet: string | null;
}

export enum MediaUploadErrorType {
  NoName = 'No name',
  NameTooLong = 'Name too long',
  DescriptionTooLong = 'Description too long',
  NoAudio = 'No Audio File',
  NoCreators = 'No Creators',
  TooManyCreators = 'Too Many Creators',
  DuplicateCreators = 'Duplicate Creators',
  BadCreatorName = 'Bad Creator Name',
  NonValidWallet = 'Non-Valid Wallet',
  Not100 = 'Not 100 Percent',
  mintPriceNeedsToBeANumber = 'Mint price needs to be a number',
  toSmallofAMintAmount = 'Too small of a mint amount',
  badBTCWallet = 'Bad BTC Wallet'
}

export interface MediaUploadValidation {
  error: string;
  type: MediaUploadErrorType;
}

export function validateMediaUploadFormData(formData: MediaUploadFormData): MediaUploadValidation | null {
  if (!formData.name) {
    return { error: 'Please add an episode name', type: MediaUploadErrorType.NoName };
  }

  if (formData.name.length > MAX_TITLE_LENGTH) {
    return {
      error: `Max episode name length is ${MAX_TITLE_LENGTH} charecters`,
      type: MediaUploadErrorType.NameTooLong
    };
  }

  if (formData.description.length > MAX_DESCRIPTION_LENGTH) {
    return {
      error: `Max episode description length is ${MAX_DESCRIPTION_LENGTH} charecters`,
      type: MediaUploadErrorType.DescriptionTooLong
    };
  }

  if (!formData.media) {
    return { error: `Please select your audio file`, type: MediaUploadErrorType.NoAudio };
  }

  if (formData.creators.length === 0) {
    return { error: 'Please add at least 1 creator', type: MediaUploadErrorType.NoCreators };
  }

  if (formData.creators.length > 8) {
    return { error: 'Max 8 creators', type: MediaUploadErrorType.TooManyCreators };
  }

  if (isNaN(formData.mintPrice)) {
    return { error: 'Mint price needs to be a number', type: MediaUploadErrorType.mintPriceNeedsToBeANumber };
  }

  // if (formData.mintPrice !== 0 && formData.mintPrice < 1 / LAMPORTS_PER_SOL) {
  //   return { error: 'Too small of a mint amount', type: MediaUploadErrorType.toSmallofAMintAmount };
  // }

  if (formData.btcWallet && !validate(formData.btcWallet)) {
    return { error: 'Bad BTC wallet', type: MediaUploadErrorType.badBTCWallet };
  }

  let percent = 0;
  let index = 0;
  const duplicateWaletCheck: PublicKey[] = [];
  for (const creator of formData.creators) {
    percent += Math.abs(creator.percentage);
    index += 1;

    if (!creator.name) {
      return {
        error: `Please enter a name for Creator #${index}`,
        type: MediaUploadErrorType.BadCreatorName
      };
    }

    try {
      const wallet = new PublicKey(creator.wallet);
      if (duplicateWaletCheck.find(w => w.equals(wallet))) {
        return {
          error: `You cannot have two creators with the same wallet`,
          type: MediaUploadErrorType.DuplicateCreators
        };
      }
      duplicateWaletCheck.push(wallet);
    } catch (e) {
      return {
        error: `Please enter a valid Solana wallet address for "${creator.name}"`,
        type: MediaUploadErrorType.NonValidWallet
      };
    }
  }

  if (percent !== 100) {
    return { error: `Percentages need to add up to 100%, you have ( ${percent}% )`, type: MediaUploadErrorType.Not100 };
  }

  // All good
  return null;
}
