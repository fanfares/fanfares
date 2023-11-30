import { PublicKey } from '@solana/web3.js';

export interface transferTokenFormData {
  amount: number;
  toAddress: string;
}

export function validateTransferTokenFormData(formData: transferTokenFormData): string | null {
  try {
    new PublicKey(formData.toAddress);
  } catch (e) {
    return 'Not a valid Solana address';
  }
  // All good
  return null;
}
