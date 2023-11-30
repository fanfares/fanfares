import Button from '@components/Button';
import { EditARMediaState } from 'src/controllers/state/create-edit-ar-media-slice';
import { useAppState } from 'src/controllers/state/use-app-state';
import Modal from './Modal';

export interface EditPodcastModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: (completed: boolean) => void;
}

function EditPodcastModal({ isOpen, onClose, onConfirm }: EditPodcastModalProps) {
  const { editARMediaState, editARMediaStateDescription, editARMediaRetry, editARMediaClear } = useAppState();
  const { currencySliceGetCurrencyString } = useAppState();

  const onModalClose = () => {
    const completed = editARMediaState === EditARMediaState.done;
    editARMediaClear();
    onClose(completed);
  };

  const renderIdle = () => {
    return (
      <div
        id="edit-podcast-modal-idle-state"
        className="relative flex flex-col items-center max-w-3xl max-h-full px-6 py-2 mx-auto h-fit min-h-fit rounded-xl bg-skin-fill md:py-4 md:px-0">
        <p className="mt-2 text-xl font-bold md:mt-8 md:text-2xl">Confirm Changes</p>
        <hr className="my-4 w-[90%] border-buttonDisabled" />
        <p className="mt-2 text-sm font-thin text-center md:w-4/5 md:text-base">
          Press the confirm button below to save your changes or cancel to return to previous window.
        </p>

        <p className="mt-4 text-sm font-thin text-center md:w-4/5 ">
          This transaction will cost a small transaction fee <span className="text-skin-muted">{'< 0.001 SOL'}</span>{' '}
          <span className="text-skin-muted"> (~{currencySliceGetCurrencyString(0.001)})</span>.
        </p>
        <hr className="mt-8 w-[90%] border-buttonDisabled" />

        <div className="flex gap-2 mt-2 mb-8 text-xl font-bold md:mt-8 md:text-2xl">
          <Button text="Cancel" id="e2e-modal-close" className="btn" onClick={onModalClose} />

          <Button text="Confirm" id="e2e-modal-confirm" className="btn" onClick={onConfirm} />
        </div>
      </div>
    );
  };

  const renderDone = () => {
    return (
      <div
        id="e2e-edit-podcast-modal-done-state"
        className="relative flex flex-col items-center w-full max-w-3xl max-h-full px-6 py-2 mx-auto h-fit min-h-fit rounded-xl bg-skin-fill md:py-4 md:px-0">
        <p className="mt-2 text-xl font-bold md:mt-8 md:text-2xl">Confirm Changes</p>
        <hr className="my-4 w-[90%] border-buttonDisabled" />
        <p className="mt-2 text-sm font-thin text-center md:w-4/5 md:text-base">Your Metadata has been updated!</p>
        <hr className="mt-8 w-[90%] border-buttonDisabled" />

        <div className="flex gap-2 mt-2 mb-8 text-xl font-bold md:mt-8 md:text-2xl">
          <button id="e2e-modal-done" className="btn" onClick={onModalClose}>
            Done
          </button>
        </div>
      </div>
    );
  };

  const renderError = () => {
    return (
      <div className="relative flex flex-col items-center w-full max-w-3xl max-h-full px-6 py-2 mx-auto h-fit min-h-fit rounded-xl bg-skin-fill md:py-4 md:px-0">
        <p className="mt-2 text-xl font-bold md:mt-8 md:text-2xl">Confirm Changes</p>
        <hr className="my-4 w-[90%] border-buttonDisabled" />
        <p className="mt-2 text-sm font-thin text-center md:w-4/5 md:text-base">
          There was an error updating your metadata: {editARMediaStateDescription ?? 'Unknown Error'}
        </p>
        <hr className="mt-8 w-[90%] border-buttonDisabled" />

        <div className="flex gap-2 mt-2 mb-8 text-xl font-bold md:mt-8 md:text-2xl">
          <button className="btn" onClick={editARMediaRetry}>
            Retry
          </button>
          <button className="btn" onClick={onModalClose}>
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const renderWorking = () => {
    return (
      <div
        id="e2e-edit-podcast-modal-working-state"
        className="relative flex flex-col items-center w-full max-w-3xl max-h-full px-6 py-2 mx-auto h-fit min-h-fit rounded-xl bg-skin-fill md:py-4 md:px-0">
        <p className="mt-2 text-xl font-bold md:mt-8 md:text-2xl">Confirm Changes</p>
        <hr className="my-4 w-[90%] border-buttonDisabled" />
        <svg className="... mr-3 h-5 w-5 animate-spin" viewBox="0 0 24 24"></svg>
        <p className="mt-2 text-sm font-thin text-center animate-pulse md:w-4/5 md:text-base">
          State: {editARMediaState}
        </p>
        <br />
      </div>
    );
  };

  const renderFromState = () => {
    switch (editARMediaState) {
      case EditARMediaState.idle:
        return renderIdle();
      case EditARMediaState.done:
        return renderDone();
      case EditARMediaState.error:
        return renderError();
      default:
        return renderWorking();
    }
  };

  return <Modal isOpen={isOpen}>{renderFromState()}</Modal>;
}

export default EditPodcastModal;
