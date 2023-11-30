import { Text } from '@components/Text';
import { TextInput } from '@components/TextInput';
import { FAProSolid, FontAwesomeIcon } from '@excalibur/config/fontawesome';

import Button from '@components/Button';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { FieldErrors, FormProvider, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useAppState } from 'src/controllers/state/use-app-state';
import { SOLANA_TOKEN } from 'src/controllers/utils/solana-token-info';
import { transferTokenFormData, validateTransferTokenFormData } from './transfer-token-validation';

const QrReader = dynamic(() => import('react-web-qr-reader'), {
  ssr: false
});

export interface WalletTransferSubpageProps {
  gotoHome: () => void;
}

export function WalletTransferSubpage({ gotoHome }: WalletTransferSubpageProps) {
  const { balance, connection, publicKey, signAndSendTransaction } = useAppState();
  const [scannerShowing, setScannerShowing] = useState(false);
  const currentToken = SOLANA_TOKEN;

  const methods = useForm<transferTokenFormData>({
    mode: 'onSubmit',
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUseNativeValidation: true
  });
  const { handleSubmit, setValue } = methods;

  function shortenAddress(address: string, chars = 5): string {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  }

  const handleScan = (result: string | null) => {
    if (result) {
      setValue('toAddress', shortenAddress(result?.toString() ?? ''), { shouldValidate: false });
      setScannerShowing(false);
    }
  };

  const handleError = error => {
    console.log(error);
  };

  const setMaxAmount = () => {
    const maxAmount = Math.trunc((balance - 0.01) * 10) / 10;

    if (maxAmount > 0.01) {
      setValue('amount', maxAmount, { shouldValidate: false });
    }
  };

  const onFormSubmit = async (data: transferTokenFormData) => {
    const toAddress = new PublicKey(data.toAddress);
    const amount = data.amount * Math.pow(10, currentToken.decimals);
    const transaction = new Transaction();
    const bh = await connection.getLatestBlockhashAndContext();

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: toAddress,
        lamports: amount
      })
    );

    transaction.feePayer = publicKey;
    transaction.recentBlockhash = bh.value.blockhash;
    transaction.lastValidBlockHeight = bh.value.lastValidBlockHeight;

    signAndSendTransaction(transaction)
      .then(() => {
        toast.success(`Sent ${data.amount} ${currentToken.symbol} to ${data.toAddress}`);
      })
      .catch(e => {
        console.log(e);
        toast.error(`Error sending ${data.amount} ${currentToken.symbol} to ${data.toAddress}`);
      });
  };

  const onSubmitValid = async (data: transferTokenFormData) => {
    const error = validateTransferTokenFormData(data);

    if (error) {
      alert(error);
    } else {
      await onFormSubmit(data);
    }
  };

  const onSubmitInvalid = (errors: FieldErrors<transferTokenFormData>) => {
    console.log(errors);
  };

  const renderScanner = () => {
    const delay = 500;

    const previewStyle = {
      height: 200,
      width: 200
    };

    return (
      <>
        {scannerShowing ? (
          <div
            className={` }
        absolute left-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center bg-skin-fill/20 backdrop-blur-sm`}
          >
            <QrReader delay={delay} style={previewStyle} onError={handleError} onScan={handleScan} />

            <Button
              type="button"
              buttonType="cancel"
              className="btn mt-4"
              onClick={() => setScannerShowing(false)}
              text="Cancel"
            />
          </div>
        ) : (
          ''
        )}
      </>
    );
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmitValid, onSubmitInvalid)}>
        <div className="mx-auto mt-8 flex h-full w-full flex-col items-center justify-center">
          <Text className="mb-8 text-3xl font-bold"> Send {currentToken?.symbol}</Text>
          <div className="btn my-1 grid cursor-pointer grid-cols-5 grid-rows-2 content-center items-center justify-between rounded-md p-2 drop-shadow-md transition-all ease-linear ">
            <div className="col-span-1 row-span-2 mx-2 h-10 w-10 content-center items-center justify-center ">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt="Current Token Image" className="rounded-full" src={currentToken?.imgUrl} />
            </div>
            <Text className="col-span-3 col-start-2 row-start-1 flex content-start font-bold ">
              {currentToken?.name}
            </Text>
            <Text
              id="token-balance"
              className="col-span-3 col-start-2 row-start-2 flex content-start text-sm font-thin"
            >
              {balance.toFixed(5) + ' ' + currentToken?.symbol}
            </Text>
          </div>

          <div className="mt-4 flex w-72 flex-col gap-y-8">
            {renderScanner()}
            <TextInput.Root>
              <TextInput.Input
                autoComplete="off"
                requiredMessage="Please submit a Solana address to send to"
                maxLengthMessage="Address must be less than 44 chars"
                name="toAddress"
                maxLength={44}
                placeholder="To Address"
                className="placeholder:text-first-upercase my-auto w-80 resize-none bg-transparent text-sm outline-none placeholder:text-sm placeholder:font-bold placeholder:text-skin-inverted"
              />

              <TextInput.Icon asChild>
                <button type="button" onClick={() => setScannerShowing(!scannerShowing)}>
                  <Text className="w-10 p-0 text-sm">
                    <FontAwesomeIcon className="w-10 text-sm" icon={FAProSolid.faCamera} />
                  </Text>{' '}
                </button>
              </TextInput.Icon>
            </TextInput.Root>
            <TextInput.Root>
              <TextInput.Input
                autoComplete="off"
                requiredMessage="Please enter in amount to send"
                name="amount"
                type="number"
                step="any"
                placeholder="Amount"
                className="w-80 bg-transparent text-sm outline-none placeholder:text-sm placeholder:font-bold placeholder:text-skin-inverted"
              />
              <TextInput.Icon asChild>
                <button type="button" onClick={setMaxAmount}>
                  <Text className="w-10 p-0 text-sm">Max</Text>{' '}
                </button>
              </TextInput.Icon>
            </TextInput.Root>
          </div>
          <div className="mt-8 flex gap-4">
            <Button buttonType="submit" type="submit" className="btn w-32" text="Confirm" />

            <Button buttonType="cancel" id="cancel-btn" onClick={gotoHome} className="btn w-32" text="Cancel" />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}

export default WalletTransferSubpage;
