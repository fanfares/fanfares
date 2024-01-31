import Button from "./Button"
import { Modal } from "./Modal"

interface ModalZapProps {
  isOpen: boolean
  onClick: () => void
}

function ModalZap(props: ModalZapProps) {
  const { isOpen, onClick } = props
  return (
    <Modal isOpen={isOpen}>
      <div className="flex flex-col px-2 py-1 w-96 gap-y-5">
        <p className="font-bold text-lg"> Select Sats</p>
        <div className="flex w-full">
          <p>
            Zap{" "}
            <span className="font-thin text-buttonMuted text-sm">
              %UserNamePlaceholder%
            </span>
          </p>
          <button onClick={onClick} className="ml-auto">
            Ⅹ
          </button>
        </div>{" "}
        <div className="flex-wrap justify-between flex gap-4">
          <button className="bg-buttonDefault px-3 py-2 hover:bg-buttonAccentHover rounded-full w-24 flex items-center gap-1 text-sm">
            <p className="font-bold">10</p>a
            <span className="text-xs font-thin">sats</span>
          </button>
          <button className="bg-buttonDefault px-3 py-2 hover:bg-buttonAccentHover rounded-full w-24 flex items-center gap-1 text-sm">
            {" "}
            <p className="font-bold">100</p>
            <span className="text-xs font-thin">sats</span>
          </button>
          <button className="bg-buttonDefault px-3 py-2 hover:bg-buttonAccentHover rounded-full w-24 flex items-center gap-1 text-sm">
            {" "}
            <p className="font-bold">1000</p>
            <span className="text-xs font-thin">sats</span>
          </button>
          <button className="bg-buttonDefault px-3 py-2 hover:bg-buttonAccentHover rounded-full w-24 flex items-center gap-1 text-sm">
            {" "}
            <p className="font-bold">10K</p>
            <span className="text-xs font-thin">sats</span>
          </button>
          <button className="bg-buttonDefault px-3 py-2 hover:bg-buttonAccentHover rounded-full w-24 flex items-center gap-1 text-sm">
            {" "}
            <p className="font-bold">100K</p>
            <span className="text-xs font-thin">sats</span>
          </button>
          <button className="bg-buttonDefault px-3 py-2 hover:bg-buttonAccentHover rounded-full w-24 flex items-center gap-1 text-sm">
            {" "}
            <p className="font-bold">1M</p>
            <span className="text-xs font-thin">sats</span>
          </button>
        </div>
        <div className="w-full border-b-2 border-buttonAccent" />
        <Button label="Confirm" className="mb-4" />
      </div>
    </Modal>
  )
}

export default ModalZap
