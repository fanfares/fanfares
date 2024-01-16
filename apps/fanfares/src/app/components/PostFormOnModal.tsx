"use client"

import { ChangeEvent, useState } from "react"
import Button from "./Button"
import { Modal } from "./Modal"
import Upload from "../(routes)/upload/page"
import { BiPodcast } from "react-icons/bi"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGif, faImage } from "@fortawesome/pro-solid-svg-icons"

interface PostFormOnModalProps {
  onCancel?: () => void
}

export function PostFormOnModal(props: PostFormOnModalProps) {
  const { onCancel } = props
  const [isChecked, setIsChecked] = useState<boolean>(false)
  const [isCheckedAudio, setIsCheckedAudio] = useState<boolean>(false)

  // todo make it as a component to be reused both by pressing the Left post button and on Top header.
  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target
    setIsChecked(checked)
  }
  const handleCheckboxChangeAudio = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target
    setIsCheckedAudio(checked)
  }
  return (
    <form
      id="e2e-post-form-container"
      className="flex items-center flex-col justify-center w-80  px-3 py-2">
      <div className="w-full text-white rounded ">
        <div className="hidden mt-1 mb-2">
          <label className="block mb-2">Unlock Cost ( sats )</label>
          <input
            type="number"
            min={`1`}
            max={`1`}
            value={""}
            // onChange={e =>
            //   setFormData({ ...formData, cost: +e.target.value })
            // }
            className="w-full p-2 text-white border rounded border-buttonAccent"
          />
        </div>
        {isChecked ? (
          <>
            {" "}
            <div className="mt-1 mb-2">
              <label className="block mb-2">Post preview</label>
              <input
                type="text"
                placeholder={`Hey unlock my post for 123 sats!`}
                maxLength={1}
                value={""}
                // onChange={e =>
                //   setFormData({ ...formData, preview: e.target.value })
                // }
                className="w-full p-2 text-white bg-transparent border rounded border-buttonAccent"
              />
            </div>
            <div className="mt-1 mb-2">
              <label className="block mb-2">Unlock Cost ( sats )</label>
              <input
                type="number"
                min={``}
                max={``}
                value={""}
                // onChange={e =>
                //   setFormData({ ...formData, cost: +e.target.value })
                // }
                className="w-full p-2 text-white bg-transparent border rounded border-buttonAccent"
              />
            </div>
          </>
        ) : null}
        <div className="h-20 mt-1">
          <label className="hidden mb-2">Content</label>
          <textarea
            maxLength={213123}
            placeholder={`What is going on?`}
            // onChange={e =>
            //   setFormData({ ...formData, content: e.target.value })
            // }
            className="w-full h-full p-2 text-white bg-transparent border rounded resize-none border-buttonAccent"></textarea>
        </div>
        <div className="flex items-center w-full mt-4">
          {/* <Modal isOpen={isCheckedAudio}>
            {<Upload onClick={() => setIsCheckedAudio(!isCheckedAudio)} />}
          </Modal> */}

          {/* ----- Toggle Paid Content Main Feed Page ----- */}

          <label
            htmlFor="setAsGatedContentCheckbox"
            className="relative inline-flex items-center px-2 py-1 border rounded-full cursor-pointer border-buttonAccent">
            <input
              checked={isChecked}
              onChange={handleCheckboxChange}
              type="checkbox"
              value=""
              name="setAsGatedContentCheckbox"
              id="setAsGatedContentCheckbox"
              className="sr-only peer"
            />
            <div className="w-10 h-6 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-300 dark:peer-focus:ring-buttonAccent rounded-full peer dark:bg-skin-fill peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-2 after:bg-white after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-buttonAccentHover"></div>
            <span className="ml-3 text-xs font-medium text-gray-900 dark:text-gray-300">
              Gated Post?
            </span>
          </label>
        </div>
      </div>
      <div className="flex items-center justify-start w-full px-2 my-2 gap-4">
        <button>
          <FontAwesomeIcon icon={faImage} />{" "}
        </button>
        <FontAwesomeIcon icon={faGif} />
        <Button
          className="font-bold border border-buttonAccent ml-auto text-xs px-4"
          onClick={() => {}}
          label="Cancel"
        />
        <Button
          className="font-bold border border-buttonAccent text-xs px-4"
          onClick={onCancel}
          label="Post"
        />
      </div>
    </form>
  )
}
