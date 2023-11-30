import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from 'react-hook-form';
import { toast } from 'react-toastify';
import { E2EID } from 'src/controllers/utils/e2e-ids';
import { Text } from './Text';
import Popover from './ToolTip';

export function MediaAudioUploadField() {
  const { setValue, register } = useFormContext();

  const [filename, setFilename] = useState<string | null>();
  const [audioUrl, setAudioUrl] = useState<string | null>();
  const [duration, setDuration] = useState<string | null>();

  useEffect(() => {
    let audio: HTMLAudioElement;
    const listener = () => {
      const durationString = audio.duration.toFixed(1) + 's';
      setValue('duration', durationString, {});
      setDuration(durationString);
    };

    if (audioUrl) {
      audio = new Audio(audioUrl);
      audio.addEventListener('loadedmetadata', listener);
      return () => {
        if (audio) {
          audio.removeEventListener('loadedmetadata', listener);
        }
      };
    }
  }, [setValue, audioUrl]);

  const onAccept = useCallback(
    (files: File[]) => {
      if (files.length > 0) {
        setAudioUrl(URL.createObjectURL(files[0]));
        setFilename(files[0].name);
        setValue('media', files[0]);
      }
    },
    [setAudioUrl, setFilename, setValue]
  );

  const onReject = () => {
    toast.error('Make sure you are uploading an audio file and that it is less than 1GB');
  };

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    noClick: true,
    accept: {
      'audio/mpeg': ['*.mp3'],
      'audio/aac': ['*.aac'],
      'audio/wav': ['*.wav'],
      'audio/webm': ['*.webm'],
      'audio/*': ['*.mp3', '*.aac', '*.wav', '*.webm', '*.m4a']
    },
    maxFiles: 1,
    onDropAccepted: onAccept,
    onDropRejected: onReject
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
    <>
      <div
        id={E2EID.uploadAudioInput}
        {...getRootProps({ style })}
        className="relative flex items-center w-full h-20 gap-4 mt-8 rounded-xl bg-skin-fill/80 md:justify-center">
        {filename ? (
          <div className="absolute left-0">
            <Text className="w-32 ml-4 text-xs font-thin text-left truncate md:w-1/6 ">{filename}</Text>
            <Text className="ml-2 text-xs font-thin text-left truncate">({duration})</Text>
          </div>
        ) : (
          <div className="absolute left-0 flex items-center w-40 gap-2 md:w-full">
            <Text className="ml-2 mr-2 text-xs font-thin text-left md:w-32 ">
              Upload the <Text className="font-bold">audio file </Text>
              here by dragging
            </Text>
            <Text className="mr-auto">or</Text>
          </div>
        )}

        <label className="btn absolute left-1/2 mx-auto w-[80px] -translate-x-1/2 cursor-pointer px-2 ">
          <input type="file" {...getInputProps({ className: '' })} />
          {filename ? 'Change' : 'Browse'}
        </label>
        <input className="hidden" {...register('duration')} />
        <div className="absolute right-4">
          <Popover className="text-xs" text="Formats allowed: AAC / M4A / MP3" />
        </div>
        {/* <p className="absolute right-0 w-1/3 mr-2 text-xs font-thin text-right text-skin-muted md:w-1/4">
          Formats allowed: AAC / M4A / MP3
        </p> */}
      </div>
    </>
  );
}
