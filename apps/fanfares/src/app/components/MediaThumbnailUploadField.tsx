export interface MediaThumbnailUploadFieldProps {
  onChange: (event: any) => void
}

export function MediaThumbnailUploadField(props: MediaThumbnailUploadFieldProps) {
  const { onChange } = props
  return (
    <div className="flex flex-col border border-buttonAccent px-2 py-1 rounded items-center justify-around w-full space-y-4 ">
      <p className="mt-2 text-sm">Upload Cover Image</p>
      <label
        htmlFor="thumbnailUpload"
        className={`mx-auto bg-buttonAccentHover hover:bg-opacity-70 px-3 py-1 rounded-full ${
          "fileURL" ? "opacity-80" : ""
        }`}>
        <input
          className="hidden"
          type="file"
          id="thumbnailUpload"
          aria-label="Thumbnail Upload"
          onChange={onChange}

        />
        {"fileURL" ? "Change" : "Browse"}
      </label>

         <div className="text-center text-skin-muted">
        {/* MAKE THIS AS TOOLTIP */}
        <div className=" w-40 text-xs text-center">
          JPG / PNG with 1:1 size ratio (min. 528x528 px) and 2 MB max file size
        </div>
      </div>
    </div>
  )
}
