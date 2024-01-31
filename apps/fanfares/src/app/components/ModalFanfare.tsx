import { Modal } from "./Modal"

interface ModalFanfareProps {
  isOpen: boolean
  onClick: () => void
}

function ModalFanfare(props: ModalFanfareProps) {
  const { isOpen, onClick } = props
  return (
    <Modal isOpen={isOpen}>
      <div className="w-80 flex flex-col gap-4 p-2 ">
        <div className="w-full flex justify-between items-center">
          <p>Coming Soon</p>
          <button onClick={onClick}>X</button>
        </div>
        <p className="text-sm text-center">
          Thanks for showing interest in our platform, this feature is not
          working yet, but it's coming soon!
        </p>
      </div>
    </Modal>
  )
}

export default ModalFanfare
