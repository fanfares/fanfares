import Image from 'next/image';
import { useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { E2EID } from 'src/controllers/utils/e2e-ids';
import { contentfulLoader } from '../../controllers/utils/image-loader';
import { Text } from './Text';
import Popover from './ToolTip';

export function MediaThumbnailUploadField() {
  const [fileURL, setFileURL] = useState<string | null>();
  const { setValue } = useFormContext();

  const onAccept = (files: File[]) => {
    if (files.length > 0) {
      setFileURL(URL.createObjectURL(files[0]));
      setValue('thumbnail', files[0]);
    }
  };

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    noClick: true,
    maxFiles: 1,
    accept: {
      'image/jpeg': [],
      'image/jpg': [],
      'image/png': [],
      'image/*': ['.jpeg', '.png', '.jpg']
    },
    multiple: false,
    onDropAccepted: onAccept
  });

  const style = useMemo(
    () => ({
      borderWidth: 2,
      borderRadius: 15,
      borderColor: '#494A6E',
      borderStyle: 'dotted',
      outline: 'none',
      transition: 'border .24s ease-in-out',
      ...(isFocused ? { borderColor: '#5F70FF' } : {}),
      ...(isDragAccept ? { borderColor: '#00e676' } : {}),
      ...(isDragReject ? { borderColor: '#ff1744' } : {})
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  return (
    <div className="flex flex-col ">
      <div
        id={E2EID.uploadArtworkInput}
        {...getRootProps({ style })}
        className="relative flex h-[160px] w-[160px] flex-col items-center  rounded-xl bg-skin-fill/80
      text-center">
        <Text className="mt-2 text-sm">Upload Cover Image</Text>
        <Text className="px-1 text-sm font-thin mt-">
          Please <Text className=""> drag here or </Text>
        </Text>
        <label
          className={`btn absolute inset-0 top-1/2 -translate-y-1/2 h-10  z-20 mx-auto w-14   ${
            fileURL ? 'opacity-80' : ''
          }`}>
          <input type="file" {...getInputProps()} />

          {fileURL ? 'Change' : 'Browse'}
        </label>

        {fileURL ? (
          <div className="h-[160px] w-[160px]">
            {' '}
            <Image
              loader={contentfulLoader}
              src={fileURL}
              layout="fill"
              alt=""
              className="absolute inset-0 z-10 object-cover object-center border-2 aspect-square rounded-xl border-buttonDefault/20"
            />
          </div>
        ) : null}
        <div className="absolute z-20 text-center bottom-1 text-skin-muted right-4">
          <Popover
            className="z-50 w-40 text-xs text-center"
            text="JPG / PNG with 1:1 size ratio (min. 528x528 px) and 2 MB max file size
          "
          />
        </div>
      </div>
    </div>
  );
}
