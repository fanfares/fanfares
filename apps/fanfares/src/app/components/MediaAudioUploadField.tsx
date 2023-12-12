export function MediaAudioUploadField() {
  return (
    <div
      id={"E2EID.uploadAudioInput"}
      // {...getRootProps({ style })}
      className="relative flex items-center w-full h-20 gap-4 mt-8 rounded-xl bg-skin-fill/80 md:justify-center">
      {"filename" ? (
        <div className="absolute left-0">
          <p className="w-32 ml-4 text-xs font-thin text-left truncate md:w-1/6 ">
            {"filename"}
          </p>
          <p className="ml-2 text-xs font-thin text-left truncate">
            ({"duration"})
          </p>
        </div>
      ) : (
        <div className="absolute left-0 flex items-center w-40 gap-2 md:w-full">
          <p className="ml-2 mr-2 text-xs font-thin text-left md:w-32 ">
            Upload the <p className="font-bold">audio file </p>
            here by dragging
          </p>
          <p className="mr-auto">or</p>
        </div>
      )}

      <label className="btn absolute left-1/2 mx-auto w-[80px] -translate-x-1/2 cursor-pointer px-2 ">
        <input
          type="file"
          //  {...getInputProps({ className: "" })}
        />
        {"filename" ? "Change" : "Browse"}
      </label>
      <input
        className="hidden"
        //  {...register("duration")}
      />
      <div className="absolute right-4">
        {/* THIS HOULD BE A POPOVER */}
        <p className="text-xs">text="Formats allowed: AAC / M4A / MP3"</p>
      </div>
      {/* <p className="absolute right-0 w-1/3 mr-2 text-xs font-thin text-right text-skin-muted md:w-1/4">
          Formats allowed: AAC / M4A / MP3
        </p> */}
    </div>
  )
}
