import { faLacrosseStickBall } from "@fortawesome/pro-solid-svg-icons"
import { FormLabelCreators } from "./LabelForm"

export interface MediaCreatorFormProps {
  onConnectDialog?: () => void
  shouldOpenConnectDialog?: boolean

  lud16: string
  setLud16: (event: any) => void

  cost: number
  setCost: (event: any) => void
}

export function MediaCreatorForm(props: MediaCreatorFormProps) {
  const { lud16, setLud16, cost, setCost } = props

  const creatorLine = () => {
    return (
      <div
        key={"field.id"}
        className="flex flex-col w-full md:gap-4 md:flex-row md:items-center md:justify-start mt-4 space-y-4 md:space-y-0">
        <FormLabelCreators>
          {" "}
          <p>
            LUD16 Address {/* THIS SHOULD BE A POPOVER */}
            <span className="text-skin-muted hidden">() </span>
          </p>{" "}
          <input
            id={"`${E2EID.uploadCreatorWalletInputX}${index}`"}
            autoComplete="off"
            className="border-b-2 border-buttonAccent bg-transparent text-sm font-thin outline-none placeholder:text-sm placeholder:font-semibold mt-2 placeholder:text-skin-muted/40 text-start"
            placeholder="Enter Creator LUD16 Address"
            name={"`creators.${index}.wallet`"}
            maxLength={48} // 44 seems to be the max
            value={lud16}
            onChange={setLud16}
          />
        </FormLabelCreators>
        <FormLabelCreators>
          {" "}
          <p>
            Unlock cost {/* THIS SHOULD BE A POPOVER */}
            <span className="text-skin-muted">( in Sats )</span>
          </p>{" "}
          <input
            type="number"
            id={"`${E2EID.uploadCreatorWalletInputX}${index}`"}
            autoComplete="off"
            className="border-b-2 border-buttonAccent bg-transparent text-sm font-thin outline-none placeholder:text-sm placeholder:font-semibold mt-2 placeholder:text-skin-muted/40 text-start"
            placeholder="Unlock cost"
            name={"`creators.${index}.wallet`"}
            maxLength={48} // 44 seems to be the max
            value={cost}
            onChange={setCost}
          />
        </FormLabelCreators>

        <FormLabelCreators className="hidden">
          Revenue Share %
          <input
            id={"`${E2EID.uploadCreatorSplitInputX}${index}`"}
            defaultValue={100}
            max={100}
            min={1}
            type="number"
            className="border-b-2 border-buttonAccent bg-transparent text-sm font-thin outline-none placeholder:text-sm placeholder:font-semibold mt-2 placeholder:text-skin-muted/40 text-start"></input>
        </FormLabelCreators>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col w-full mt-4">
      <div className="flex justify-between w-full">
        <p className="text-2xl">Parameters</p>
        <button
          disabled={false}
          id={"E2EID.uploadCreatorAddButton"}
          type="button"
          className="hidden items-center md:px-4 mt-auto text-xs bg-buttonDefault rounded-md px-2 py-1"
          onClick={() => {}}>
          Add Creator
        </button>
      </div>
      <div className="w-full">
        {" "}
        <div
          key={"field.id"}
          className="flex flex-col w-full md:gap-4 md:flex-row md:items-center md:justify-start mt-4 space-y-4 md:space-y-0">
          <FormLabelCreators>
            {" "}
            <p>
              LUD16 Address {/* THIS SHOULD BE A POPOVER */}
              <span className="text-skin-muted hidden">() </span>
            </p>{" "}
            <input
              type="text"
              id={"`${E2EID.uploadCreatorWalletInputX}${index}`"}
              autoComplete="off"
              className="border-b-2 border-buttonAccent bg-transparent text-sm font-thin outline-none placeholder:text-sm placeholder:font-semibold mt-2 placeholder:text-skin-muted/40 text-start"
              placeholder="Enter Creator LUD16 Address"
              name={"`creators.${index}.wallet`"}
              maxLength={48} // 44 seems to be the max
              value={lud16}
              onChange={setLud16}
            />
          </FormLabelCreators>
          <FormLabelCreators>
            {" "}
            <p>
              Unlock cost {/* THIS SHOULD BE A POPOVER */}
              <span className="text-skin-muted">( in Sats )</span>
            </p>{" "}
            <input
              type="number"
              id={"`${E2EID.uploadCreatorWalletInputX}${index}`"}
              autoComplete="off"
              className="border-b-2 border-buttonAccent bg-transparent text-sm font-thin outline-none placeholder:text-sm placeholder:font-semibold mt-2 placeholder:text-skin-muted/40 text-start"
              placeholder="Unlock cost"
              name={"`creators.${index}.wallet`"}
              maxLength={48} // 44 seems to be the max
              value={cost}
              onChange={setCost}
            />
          </FormLabelCreators>

          <FormLabelCreators className="hidden">
            Revenue Share %
            <input
              id={"`${E2EID.uploadCreatorSplitInputX}${index}`"}
              defaultValue={100}
              max={100}
              min={1}
              type="number"
              className="border-b-2 border-buttonAccent bg-transparent text-sm font-thin outline-none placeholder:text-sm placeholder:font-semibold mt-2 placeholder:text-skin-muted/40 text-start"></input>
          </FormLabelCreators>
        </div>
      </div>
    </div>
  )
}
