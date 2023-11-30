import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import QRCode from 'react-qr-code';
import { toast } from 'react-toastify';
import { useAppState } from 'src/controllers/state/use-app-state';
import { Text } from 'src/views/components/Text';
import { TextInput } from 'src/views/components/TextInput';

export interface WalletDepositSubpageProps {
  gotoHome: () => void;
}

export interface WalletDepositFormData {
  toAddress: string;
}

export function WalletDepositSubpage(props: WalletDepositSubpageProps) {
  const { gotoHome } = props;
  const { publicKey } = useAppState();
  const methods = useForm<WalletDepositFormData>();

  const address = publicKey?.toString() ?? 'Not Connected';

  const [copied, setCopied] = useState(false);
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    toast.success('Copied to clipboard!', {
      position: 'bottom-center',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined
    });
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <FormProvider {...methods}>
      <div className="mx-auto mt-8 flex w-full flex-col items-center justify-center">
        <Text className="mb-8 text-3xl font-bold"> Deposit </Text>
        <Text className="w-72 text-center text-skin-muted">
          {' '}
          This address can only be used to receive compatible SOL tokens.
        </Text>
        <div className="m-5 rounded border-2 bg-white">
          <QRCode size={120} className="" value={address} />
        </div>
        <p className="text-xs	text-skin-muted">{address}</p>
        <div className="mt-4 flex  w-72 flex-col gap-y-8">
          <TextInput.Root>
            <TextInput.Input
              disabled={true}
              autoComplete="off"
              type="text"
              // tood
              // onChange={() => setRecipient(result?.data.toString() ?? '')}
              defaultValue={address}
              maxLength={44}
              name="toAddress"
              maxLengthMessage="Address must be less than 44 chars"
              requiredMessage="To address is requiredd"
              placeholder="To Address"
              className="placeholder:text-first-upercase my-auto w-80 resize-none  bg-transparent text-sm outline-none placeholder:text-sm placeholder:font-bold placeholder:text-skin-inverted"
            />

            <TextInput.Icon asChild>
              <button onClick={copyToClipboard}>
                <Text className="w-12 p-0 text-sm">{copied ? 'Copied' : 'Copy'}</Text>{' '}
              </button>
            </TextInput.Icon>
          </TextInput.Root>
        </div>
        <div className="mt-8 flex gap-4">
          <button onClick={gotoHome} className="btn w-40">
            Return
          </button>
        </div>
      </div>
    </FormProvider>
  );
}
