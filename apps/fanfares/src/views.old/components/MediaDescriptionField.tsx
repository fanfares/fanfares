import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { E2EID } from 'src/controllers/utils/e2e-ids';
import { Text } from './Text';
import { TextInput } from './TextInput';

export interface MediaDescriptionFieldProps {
  maxLength: number;
}

export function MediaDescriptionField({ maxLength }: MediaDescriptionFieldProps) {
  const [mediaDescriptionLength, setMediaDescriptionLength] = useState(0);
  const { watch } = useFormContext();
  const maxMediaDescriptionLength = maxLength;

  const description = watch('description');

  useEffect(() => {
    setMediaDescriptionLength(description?.length || 0);
  }, [description]);

  const charsLeft = maxMediaDescriptionLength - mediaDescriptionLength;

  return (
    <div className="relative">
      <TextInput.InputEditable
        id={E2EID.uploadDescriptionInput}
        placeholder="Description"
        className="w-full h-40 bg-transparent border-b-2 outline-none resize-none notes active border-buttonAccent placeholder:text-xl placeholder:font-thin placeholder:text-skin-muted"
        maxLength={maxMediaDescriptionLength}
        name="description"
      />
      <Text
        className={`absolute -bottom-4 right-0 text-sm font-bold  ${
          charsLeft < 8 ? 'text-red-500' : 'text-skin-inverted'
        }`}>
        {' '}
        {charsLeft}
      </Text>
    </div>
  );
}
