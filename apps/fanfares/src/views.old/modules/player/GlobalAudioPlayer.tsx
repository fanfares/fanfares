import { useAppState } from 'src/controllers/state/use-app-state';
import DonationModal from 'src/views/modals/DonationModal';
import MintNftModal from 'src/views/modals/MintNftModal';
import { SocialShareModal } from 'src/views/modals/SocialShareModal';
import { AudioPlayer } from './AudioPlayer';

function GlobalAudioPlayer() {
  const { playerAudioUrl } = useAppState();

  const renderContent = () => {
    return (
      <>
        <AudioPlayer />
        <DonationModal />
        <MintNftModal />
        <SocialShareModal />
      </>
    );
  };

  const renderNotLoaded = () => {
    return null;
  };

  const renderFromState = () => {
    if (!playerAudioUrl) {
      return renderNotLoaded();
    } else {
      return renderContent();
    }
  };

  return renderFromState();
}

export default GlobalAudioPlayer;
