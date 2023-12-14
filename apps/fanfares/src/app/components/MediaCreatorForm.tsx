// import {
//   FieldArrayWithId,
//   useFieldArray,
//   useFormContext,
// } from "react-hook-form"

import { faLacrosseStickBall } from "@fortawesome/pro-solid-svg-icons"
import FormLabelCreators from "./LabelForm"

export interface MediaCreatorFormProps {
  onConnectDialog?: () => void
  shouldOpenConnectDialog?: boolean
}

export function MediaCreatorForm(props: MediaCreatorFormProps) {
  // const { onConnectDialog, shouldOpenConnectDialog } = props
  // const { register, control } = useFormContext()
  // const { currentCreatorName, publicKey, currentCreatorHasUserAccount } =
  //   useAppState()

  // const { fields, append, remove } = useFieldArray({
  //   control: control,
  //   name: "creators",
  // })

  // const addCreator = () => {
  //   if (shouldOpenConnectDialog) {
  //     onConnectDialog()
  //   } else {
  //     if (fields.length >= 8) return
  //     append({
  //       wallet: "",
  //       name: "",
  //       percentage: 5,
  //     })
  //   }
  // }

  // const deleteCreator = (index: number) => {
  //   remove(index)
  // }

  // useEffect(() => {
  //   return () => {
  //     remove()
  //   }
  // }, []) //eslint-disable-line

  // useEffect(() => {
  //   if (!publicKey) {
  //     setTimeout(() => {
  //       remove()
  //     }, 100)
  //   }
  // }, [publicKey]) //eslint-disable-line

  // useEffect(() => {
  //   if (
  //     fields.length === 0 &&
  //     publicKey &&
  //     currentCreatorHasUserAccount !== null
  //   ) {
  //     append({
  //       wallet: publicKey,
  //       name:
  //         currentCreatorName?.substring(0, 32) ??
  //         shortenWalletAddress(publicKey),
  //       percentage: 100,
  //     })
  //   }
  // }, [
  //   fields.length,
  //   currentCreatorHasUserAccount,
  //   append,
  //   currentCreatorName,
  //   publicKey,
  // ])

  const creatorLine = () =>
    // field: FieldArrayWithId<MediaUploadFormData, "creators", "id">,
    // index: number
    {
      return (
        <div
          key={"field.id"}
          className="flex flex-col w-full md:gap-4 md:flex-row md:items-center md:justify-start mt-4 space-y-4 md:space-y-0">
          <FormLabelCreators>
            <p> Creator Name:</p> {/* THIS P SHOULD BE A POPOVER */}
            {/* <p className="text-xs text-center w-80 md:text-sm hidden">
              "The name of the creator of the episode. This can be a person, a
              group, or a brand."
            </p> */}
            <input
              id={"`${E2EID.uploadCreatorNameInputX}${index}`"}
              autoComplete="off"
              className="border-b-2 border-buttonAccent bg-transparent text-sm font-thin outline-none placeholder:text-sm placeholder:font-semibold mt-2 placeholder:text-skin-muted/40 text-start"
              placeholder="Enter Creator Name"
              name={"`creators.${index}.name`"}
              maxLength={999}
            />
          </FormLabelCreators>
          <FormLabelCreators>
            {" "}
            <p>
              Wallet Creator Address {/* THIS P SHOULD BE A POPOVER */}
              <span className="text-skin-muted">(Solana) </span>
            </p>{" "}
            {/* <p className="text-xs text-center w-80 md:text-sm hidden">
              "The Solana wallet address of the creator of the episode."
            </p> */}
            <input
              id={"`${E2EID.uploadCreatorWalletInputX}${index}`"}
              autoComplete="off"
              className="border-b-2 border-buttonAccent bg-transparent text-sm font-thin outline-none placeholder:text-sm placeholder:font-semibold mt-2 placeholder:text-skin-muted/40 text-start"
              placeholder="Enter Creator Wallet Address"
              name={"`creators.${index}.wallet`"}
              maxLength={48} // 44 seems to be the max
            />
          </FormLabelCreators>
          {/* <div className="flex flex-col items-center justify-center md:w-48 md:min-w-[160px] gap-y-3 bg-skin-fill rounded-lg p-2"> */}
          <FormLabelCreators>
            Revenue Share %{/* THIS P SHOULD BE A POPOVER */}
            {/* <p className="text-xs text-center w-80 md:text-sm">
                text="The percentage of revenue that will be shared with this
                creator."
              </p> */}
            <input
              id={"`${E2EID.uploadCreatorSplitInputX}${index}`"}
              defaultValue={100}
              max={100}
              min={1}
              type="number"
              className="border-b-2 border-buttonAccent bg-transparent text-sm font-thin outline-none placeholder:text-sm placeholder:font-semibold mt-2 placeholder:text-skin-muted/40 text-start"
              // {...register(`creators.${index}.percentage`, {
              //   valueAsNumber: true,
              // }
              // )}
            >
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
          </FormLabelCreators>
          {/* </div> */}

          <button
            id={"`${E2EID.uploadCreatorRemoveButtonX}${index}`"}
            type="button"
            disabled={false}
            className={`flex items-center h-16 gap-2 px-4 cursor-pointer md:ml-auto md:w-20 btn
          ${"fields.length === 1" && "hidden"}`}
            onClick={() => {}}>
            {/* <FontAwesomeIcon
              className="text-xl"
              icon={FAProSolid.faMinusCircle}
            /> */}
            {/* <p>Remove</p> */}
          </button>
        </div>
      )
    }

  return (
    <div className="relative flex flex-col w-full mt-4">
      <div className="flex justify-between w-full">
        <p className="text-2xl">Co-Creators</p>
        <button
          disabled={false}
          id={"E2EID.uploadCreatorAddButton"}
          type="button"
          className="flex items-center md:px-4 mt-auto text-xs bg-buttonDefault rounded-md px-2 py-1"
          onClick={() => {}}>
          Add Creator
        </button>
      </div>
      <div className="w-full">{creatorLine()}</div>
    </div>
  )
}
