import Popover from '@components/ToolTip';
import { getTransactionCost } from '@utils';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useAppState } from 'src/controllers/state/use-app-state';
import { E2EID } from 'src/controllers/utils/e2e-ids';
import { Text } from 'src/views/components/Text';

export interface UploadCostsProps {
  costChangeCallback: (cost: number) => void;
}

export function UploadCosts(props: UploadCostsProps) {
  const { costChangeCallback } = props;
  const { currentCreatorHasUserAccount } = useAppState();
  const { watch } = useFormContext();
  const { currencySliceGetCurrencyString } = useAppState();

  const additionalCreatorCount = Math.max((watch().creators?.length ?? 1) - 1, 0);
  const creatorInitCost = getTransactionCost('create-creator-user-account');
  const cost = getTransactionCost('upload-media') + getTransactionCost('additional-creator') * additionalCreatorCount;

  useEffect(() => {
    costChangeCallback(cost);
  }, [costChangeCallback, cost]);

  const renderDoesNotHasAccount = () => {
    const firstCost = currencySliceGetCurrencyString(cost + creatorInitCost);
    const uploadCost = currencySliceGetCurrencyString(cost);

    return (
      <div>
        <div>
          <Text className="text-xs text-skin-base">
            Your first upload will cost roughly {cost + creatorInitCost} SOL{' '}
            <span id={E2EID.uploadFirstCost} className="font-bold text-skin-muted">
              (~{currencySliceGetCurrencyString(cost + creatorInitCost)}){'  '}
            </span>
          </Text>
          <Popover
            className="w-40 text-xs text-center "
            text={`This upload will cost roughly ${firstCost}. This cost covers perminent storage costs ( Arweave ) and on-chain storage costs ( Solana ). Your first upload is slightly more, because we create and store a one-time 'Creator Account' on-chain`}
          />
        </div>
        <div>
          <Text className="text-xs text-skin-base">
            All future uploads will cost roughly {cost} SOL
            <span id={E2EID.uploadCost} className="font-bold text-skin-muted">
              {' '}
              (~{currencySliceGetCurrencyString(cost)}){' '}
            </span>
          </Text>
          <Popover
            className="w-40 text-xs text-center "
            text={`Every additional upload should cost roughly ${uploadCost}. This cost covers perminent storage costs ( Arweave ) and on-chain storage costs ( Solana )`}
          />
        </div>
      </div>
    );
  };

  const renderAlreadyHasAccount = () => {
    const uploadCost = currencySliceGetCurrencyString(cost);

    return (
      <div>
        <Text className="text-xs text-skin-base">
          Uploading a 100MB file will cost roughly {cost.toFixed(5)} SOL
          <span id={E2EID.uploadCost} className="font-bold text-skin-muted">
            {' '}
            (~{uploadCost})
          </span>
        </Text>
        <Popover
          className="w-40 text-xs text-center "
          text={`This upload will cost roughly ${uploadCost}. This cost covers perminent storage costs ( Arweave ) and on-chain storage costs ( Solana )`}
        />
      </div>
    );
  };

  if (currentCreatorHasUserAccount) {
    return renderAlreadyHasAccount();
  } else {
    return renderDoesNotHasAccount();
  }
}
