import { FAProSolid, FontAwesomeIcon } from '@excalibur/config/fontawesome';

export interface ModalVideosProps {
  isOpen: boolean;

  src: string;
  onClose: () => void;
}

export function ModalVideos({ isOpen, src, onClose }: ModalVideosProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 z-50 flex h-screen w-screen items-center justify-center rounded-lg bg-black/80 backdrop-blur-md">
      <div className="fixed flex h-screen w-full max-w-6xl flex-col items-center justify-center px-8">
        <button id="e2e-modal-close" className="btn ml-auto h-4 w-fit gap-x-2 px-4 py-4" onClick={onClose}>
          Close
          <FontAwesomeIcon icon={FAProSolid.faClose} className={`flex w-4 justify-center text-xl  `} />
        </button>

        <iframe
          className="mt-4 aspect-video w-[800px]"
          src={src}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen></iframe>
      </div>
    </div>
  );
}

export default ModalVideos;
