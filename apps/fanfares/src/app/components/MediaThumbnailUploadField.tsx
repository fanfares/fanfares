export function MediaThumbnailUploadField() {
  return (
    <div className="flex flex-col border border-buttonAccent px-2 py-1 rounded-md items-center justify-around w-full space-y-4 ">
      <p className="mt-2 text-sm">Upload Cover Image</p>
      <label
        htmlFor="thumbnailUpload"
        className={`mx-auto bg-slate-900 px-2 py-1 rounded-md ${
          "fileURL" ? "opacity-80" : ""
        }`}>
        <input
          className="hidden"
          type="file"
          id="thumbnailUpload"
          aria-label="Thumbnail Upload"
          // {...getInputProps()}
        />
        {"fileURL" ? "Change" : "Browse"}
      </label>

      {/* {"fileURL" ? (
        <div className="">
          {" "}
          <Image
              loader={contentfulLoader}
              src={fileURL}
              layout="fill"
              alt=""
              className="absolute inset-0 z-10 object-cover object-center border-2 aspect-square rounded-xl border-buttonDefault/20"
            />
        </div>
      ) : null} */}
      <div className="text-center text-skin-muted">
        {/* MAKE THIS AS TOOLTIP */}
        <div className=" w-40 text-xs text-center">
          JPG / PNG with 1:1 size ratio (min. 528x528 px) and 2 MB max file size
        </div>
      </div>
    </div>
  )
}
