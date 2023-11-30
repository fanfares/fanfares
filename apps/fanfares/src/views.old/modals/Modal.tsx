import { ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  children?: ReactNode;
}
export function Modal({ isOpen, children }: ModalProps) {
  // if (!isOpen) return null;

  return (
    <div
      className={`modalContainer fixed left-0 top-0 z-50 flex h-full w-screen flex-col items-center justify-center overflow-hidden backdrop-blur-[2px] transition-all duration-300 ease-in-out  ${
        isOpen
          ? 'scale-120 pointer-events-auto -translate-y-[0%]  opacity-100'
          : 'pointer-events-none translate-y-[100%] scale-0 opacity-0'
      }`}>
      <div className="relative flex flex-col items-center justify-center h-screen px-6 py-2 mx-auto border border-buttonAccent bg-skin-fill drop-shadow-xl md:h-fit md:max-h-full md:min-h-fit md:max-w-3xl md:rounded-xl md:px-8 md:py-4">
        {children}
      </div>
    </div>
  );
}

export default Modal;
