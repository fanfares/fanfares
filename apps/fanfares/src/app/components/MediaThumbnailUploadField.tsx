export function MediaThumbnailUploadField() {
  return (
    <div className="flex flex-col border border-buttonAccent px-2 py-1 rounded-md items-center justify-center w-full space-y-4 ">
      <p className="mt-2 text-sm">Upload Cover Image</p>
      <label className={`h-10 mx-auto w-14   ${"fileURL" ? "opacity-80" : ""}`}>
        <input
          type="file"
          // {...getInputProps()}
        />
        {"fileURL" ? "Change" : "Browse"}
      </label>

      {"fileURL" ? (
        <div className="">
          {" "}
          {/* <Image
              loader={contentfulLoader}
              src={fileURL}
              layout="fill"
              alt=""
              className="absolute inset-0 z-10 object-cover object-center border-2 aspect-square rounded-xl border-buttonDefault/20"
            /> */}
        </div>
      ) : null}
      <div className="text-center text-skin-muted">
        {/* MAKE THIS AS TOOLTIP */}
        <div className=" w-40 text-xs text-center">
          text="JPG / PNG with 1:1 size ratio (min. 528x528 px) and 2 MB max
          file size "
        </div>
      </div>
    </div>
  )
}
