"use client"

import { useState } from "react"
import Button from "./Button"
import { Modal } from "./Modal"
import { PostForm } from "./PostForm"
import Upload from "../(routes)/upload/page"

export function ActionButtonsPost() {
  // Refactor this section to use Enums?
  const [noteModal, setNoteModal] = useState(false)
  const [gatedNoteModal, setGatedNoteModal] = useState(false)
  const [gatedPodModal, setGatedPodModal] = useState(false)
  const [genericNoteModal, setGenericNoteModal] = useState(false)

  const setModalOff = () => {
    setNoteModal(false)
    setGatedNoteModal(false)
    setGatedPodModal(false)
    setGenericNoteModal(true)
  }

  const renderGatedNoteContent = () => {
    return (
      <>
        <form
          id="e2e-post-form-container"
          className="flex items-center justify-center w-[380px] my-4 ">
          <div className="w-full p-5 text-white border rounded shadow-lg border-buttonAccent">
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

            <div className="h-20 mt-1 mb-2">
              <label className="hidden mb-2">Content</label>
              <textarea
                maxLength={213123}
                placeholder={`What is going on?`}
                // onChange={e =>
                //   setFormData({ ...formData, content: e.target.value })
                // }
                className="w-full h-full p-2 text-white bg-transparent border rounded resize-none border-buttonAccent"></textarea>
            </div>
            <div className="flex items-center w-full mt-12 gap-4">
              <Button
                className="font-bold border border-buttonAccent ml-auto w-20"
                onClick={() => {}}
                label="Submit"
              />
            </div>
          </div>
        </form>
      </>
    )
  }

  const renderGenericContent = () => {
    return (
      <div className="relative">
        <div className="absolute -rotate-90 flex bg-black -left-44">
          <Button onClick={() => setNoteModal(!noteModal)} label="Note" />
          <Button
            onClick={() => setGatedNoteModal(!gatedNoteModal)}
            label="Gated Note"
          />
          <Button
            onClick={() => setGatedPodModal(!gatedPodModal)}
            label="Gated Pod"
          />
          <Button
            onClick={() => setGenericNoteModal(!genericNoteModal)}
            label="Generic"
          />
        </div>
        {!noteModal && !gatedNoteModal && !gatedPodModal && <PostForm />}
      </div>
    )
  }

  return (
    <div className="bg-black rounded mb-4 flex flex-col py-4 px-2 gap-2">
      <Modal
        isOpen={
          noteModal || gatedNoteModal || gatedPodModal || genericNoteModal
        }>
        <div>
          {noteModal && <PostForm />}
          {gatedNoteModal && renderGatedNoteContent()}
          {gatedPodModal && <Upload />}
          {genericNoteModal && renderGenericContent()}
          <Button onClick={setModalOff} label="Close" />
        </div>
      </Modal>
      <Button onClick={() => setNoteModal(!noteModal)} label="Note" />
      <Button
        onClick={() => setGatedNoteModal(!gatedNoteModal)}
        label="Gated Note"
      />
      <Button
        onClick={() => setGatedPodModal(!gatedPodModal)}
        label="Gated Pod"
      />
      <Button
        onClick={() => setGenericNoteModal(!genericNoteModal)}
        label="Post Something"
      />
    </div>
  )
}
