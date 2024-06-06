export interface MediaCreatorFormProps {
  onChange: (event: any) => void
}

export function MediaAudioUploadField(props: MediaCreatorFormProps) {
  const { onChange } = props

  return (
    <div
      id={"E2EID.uploadAudioInput"}
         className="relative flex items-center w-full mt-8 border border-buttonAccent px-2 py-3 rounded">
         <p className="text-xs">Select Audio File</p>
      <label
        htmlFor="audioUpload"
        className="mx-auto py-1 rounded-full cursor-pointer px-3 bg-buttonDefault">
        <input
          type="file"
          id="audioUpload"
          className="hidden"
          onChange={onChange}
        />
        {"filename" ? "Change" : "Browse"}
      </label>
      <p className="text-xs w-24">Formats allowed: AAC / M4A / MP3</p>

    </div>
  )
}
