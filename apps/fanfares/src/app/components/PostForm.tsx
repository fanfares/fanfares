"use client";

import { ChangeEvent, useState } from "react";
import Button from "./Button";
import { Modal } from "./Modal";
import Upload from "../(routes)/upload/page";
import { BiPodcast } from "react-icons/bi";

export function PostForm() {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isCheckedAudio, setIsCheckedAudio] = useState<boolean>(false);

  // todo make it as a component to be reused both by pressing the Left post button and on Top header.
  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setIsChecked(checked);
  };
  const handleCheckboxChangeAudio = (event: ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setIsCheckedAudio(checked);
  };
  return (
    <form
      id="e2e-post-form-container"
      className="my-4 flex w-full items-center justify-center "
    >
      <div className="border-buttonAccent w-full rounded border p-5 text-white shadow-lg">
        <div className="mb-2 mt-1 hidden">
          <label className="mb-2 block">Unlock Cost ( sats )</label>
          <input
            type="number"
            min={`1`}
            max={`1`}
            value={""}
            // onChange={e =>
            //   setFormData({ ...formData, cost: +e.target.value })
            // }
            className="border-buttonAccent w-full rounded border p-2 text-white"
          />
        </div>
        {isChecked ? (
          <>
            {" "}
            <div className="mb-2 mt-1">
              <label className="mb-2 block">Post preview</label>
              <input
                type="text"
                placeholder={`Hey unlock my post for 123 sats!`}
                maxLength={1}
                value={""}
                // onChange={e =>
                //   setFormData({ ...formData, preview: e.target.value })
                // }
                className="border-buttonAccent w-full rounded  border bg-transparent p-2 text-white"
              />
            </div>
            <div className="mb-2 mt-1">
              <label className="mb-2 block">Unlock Cost ( sats )</label>
              <input
                type="number"
                min={``}
                max={``}
                value={""}
                // onChange={e =>
                //   setFormData({ ...formData, cost: +e.target.value })
                // }
                className="border-buttonAccent w-full rounded border bg-transparent p-2 text-white"
              />
            </div>
          </>
        ) : null}
        <div className="mb-2 mt-1 h-20">
          <label className="mb-2 hidden">Content</label>
          <textarea
            maxLength={213123}
            placeholder={`What is going on?`}
            // onChange={e =>
            //   setFormData({ ...formData, content: e.target.value })
            // }
            className="border-buttonAccent h-full w-full resize-none rounded border bg-transparent p-2 text-white"
          ></textarea>
        </div>
        <div className="mt-12 flex w-full items-center gap-4">
          {/* <Modal isOpen={isCheckedAudio}>
            {<Upload onClick={() => setIsCheckedAudio(!isCheckedAudio)} />}
          </Modal> */}

          {/* ----- Toggle Paid Content Main Feed Page ----- */}
          {/*
          <label
            htmlFor="setAsGatedContentCheckbox"
            className="relative inline-flex items-center px-4 py-2 border rounded-full cursor-pointer w-44 border-buttonAccent">
            <input
              checked={isChecked}
              onChange={handleCheckboxChange}
              type="checkbox"
              value=""
              name="setAsGatedContentCheckbox"
              id="setAsGatedContentCheckbox"
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-buttonAccent rounded-full peer dark:bg-skin-fill peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-4 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-buttonAccentHover"></div>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Paid content?
            </span>
          </label> */}

          {/* ----- Toggle Paid Audio Main Feed Page ----- */}

          {/* <label
            htmlFor="setAsGatedContentCheckboxAudio"
            className="relative inline-flex items-center px-4 py-2 border rounded-full cursor-pointer w-44 border-buttonAccent">
            <input
              checked={isCheckedAudio}
              onChange={handleCheckboxChangeAudio}
              type="checkbox"
              value=""
              name="setAsGatedContentCheckboxAudio"
              id="setAsGatedContentCheckboxAudio"
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-buttonAccent rounded-full peer dark:bg-skin-fill peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-4 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-buttonAccentHover"></div>
            <span className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
              Podcast?
            </span>
          </label> */}

          <Button
            className="border-buttonAccent ml-auto w-20 border font-bold"
            onClick={() => {}}
            label="Submit"
          />
        </div>
      </div>
    </form>
  );
}
