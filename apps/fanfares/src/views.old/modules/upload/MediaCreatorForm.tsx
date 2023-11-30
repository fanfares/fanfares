import Popover from '@components/ToolTip';
import { FAProSolid, FontAwesomeIcon } from '@excalibur/config/fontawesome';
import { useEffect } from 'react';
import { FieldArrayWithId, useFieldArray, useFormContext } from 'react-hook-form';
import { useAppState } from 'src/controllers/state/use-app-state';
import { E2EID } from 'src/controllers/utils/e2e-ids';
import { MAX_TITLE_LENGTH, shortenWalletAddress } from 'src/controllers/utils/nft-metadata';
import { TextInput } from 'src/views/components/TextInput';
import { MediaUploadFormData } from './media-upload-validation';

export interface MediaCreatorFormProps {
  onConnectDialog: () => void;
  shouldOpenConnectDialog: boolean;
}

export function MediaCreatorForm(props: MediaCreatorFormProps) {
  const { onConnectDialog, shouldOpenConnectDialog } = props;
  const { register, control } = useFormContext();
  const { currentCreatorName, publicKey, currentCreatorHasUserAccount } = useAppState();

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: 'creators'
  });

  const addCreator = () => {
    if (shouldOpenConnectDialog) {
      onConnectDialog();
    } else {
      if (fields.length >= 8) return;
      append({
        wallet: '',
        name: '',
        percentage: 5
      });
    }
  };

  const deleteCreator = (index: number) => {
    remove(index);
  };

  useEffect(() => {
    return () => {
      remove();
    };
  }, []); //eslint-disable-line

  useEffect(() => {
    if (!publicKey) {
      setTimeout(() => {
        remove();
      }, 100);
    }
  }, [publicKey]); //eslint-disable-line

  useEffect(() => {
    if (fields.length === 0 && publicKey && currentCreatorHasUserAccount !== null) {
      append({
        wallet: publicKey,
        name: currentCreatorName?.substring(0, 32) ?? shortenWalletAddress(publicKey),
        percentage: 100
      });
    }
  }, [fields.length, currentCreatorHasUserAccount, append, currentCreatorName, publicKey]);

  const creatorLine = (field: FieldArrayWithId<MediaUploadFormData, 'creators', 'id'>, index: number) => {
    return (
      <div key={field.id} className="flex flex-col w-full gap-4 mt-4 md:flex-row md:items-center md:justify-start">
        <label className="w-full p-2 text-sm font-bold text-center text-white rounded-lg md:max-w-md min-w-fit md:w-1/2 bg-skin-fill">
          Creator Name{' '}
          <Popover
            className="text-xs text-center w-80 md:text-sm"
            text="The name of the creator of the episode. This can be a person, a group, or a brand."
          />
          <TextInput.Input
            id={`${E2EID.uploadCreatorNameInputX}${index}`}
            autoComplete="off"
            className="left-[36px] mt-4 block w-full border-b-2 border-buttonAccent bg-transparent  text-sm font-thin outline-none placeholder:text-sm placeholder:font-bold placeholder:text-skin-muted/40 text-center "
            placeholder="Enter Creator Name"
            name={`creators.${index}.name`}
            maxLength={MAX_TITLE_LENGTH}
          />
        </label>
        <label className="w-full p-2 text-sm font-bold text-center text-white rounded-lg md:max-w-md bg-skin-fill">
          {' '}
          Wallet Creator Address <span className="text-skin-muted">(Solana) </span>
          <Popover
            className="text-xs text-center w-80 md:text-sm"
            text="The Solana wallet address of the creator of the episode."
          />
          <TextInput.Input
            id={`${E2EID.uploadCreatorWalletInputX}${index}`}
            autoComplete="off"
            className="left-[36px] mt-4 block w-full border-b-2 border-buttonAccent bg-transparent text-sm  font-thin outline-none placeholder:text-sm placeholder:font-bold placeholder:text-skin-muted/40 md:text-center placeholder:text-center text-center"
            placeholder="Enter Creator Wallet Address"
            name={`creators.${index}.wallet`}
            maxLength={48} // 44 seems to be the max
          />
        </label>
        <div className="flex flex-col items-center justify-center md:w-48 md:min-w-[160px] gap-y-3 bg-skin-fill rounded-lg p-2">
          <label className="w-full text-sm font-bold text-center text-white md:max-w-md md:text-center ">
            Revenue Share %{' '}
            <Popover
              className="text-xs text-center w-80 md:text-sm"
              text="The percentage of revenue that will be shared with this creator."
            />
          </label>
          <input
            id={`${E2EID.uploadCreatorSplitInputX}${index}`}
            defaultValue={100}
            max={100}
            min={1}
            type="number"
            className="w-full text-sm font-thin text-center bg-transparent border-b-2 outline-none border-buttonAccent"
            {...register(`creators.${index}.percentage`, {
              valueAsNumber: true
            })}>
            {/* <option value="5">5%</option>
            <option value="10">10%</option>
            <option value="15">15%</option>
            <option value="20">20%</option>
            <option value="25">25%</option>
            <option value="30">30%</option>
            <option value="35">35%</option>
            <option value="40">40%</option>
            <option value="45">45%</option>
            <option value="50">50%</option>
            <option value="55">55%</option>
            <option value="60">60%</option>
            <option value="65">65%</option>
            <option value="70">70%</option>
            <option value="75">75%</option>
            <option value="80">80%</option>
            <option value="85">85%</option>
            <option value="90">90%</option>
            <option value="95">95%</option>
            <option value="100">100%</option>
            <option>
              <textarea />
            </option> */}
          </input>
        </div>

        <button
          id={`${E2EID.uploadCreatorRemoveButtonX}${index}`}
          type="button"
          disabled={fields.length === 1}
          className={`flex items-center h-16 gap-2 px-4 cursor-pointer md:ml-auto md:w-20 btn
          ${fields.length === 1 && 'hidden'}`}
          onClick={() => {
            deleteCreator(index);
          }}>
          <FontAwesomeIcon className="text-xl" icon={FAProSolid.faMinusCircle} />
          {/* <p>Remove</p> */}
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="relative flex items-center w-full mt-4">
        <p className="text-2xl">Co-Creators</p>
        <button
          disabled={fields.length >= 8}
          id={E2EID.uploadCreatorAddButton}
          type="button"
          className="flex items-center gap-2 px-4 mt-auto  ml-auto cursor-pointer md:w-[78px]  md:flex-col md:h-full btn"
          onClick={addCreator}>
          Add Creator
        </button>
      </div>

      {fields.map(creatorLine)}
    </>
  );
}
