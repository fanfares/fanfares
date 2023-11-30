import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { E2EID } from 'src/controllers/utils/e2e-ids';
import { Text } from './Text';
import { TextInput } from './TextInput';

export interface MediaNameFieldProps {
  maxLength?: number;
}

export function MediaNameField({ maxLength }: MediaNameFieldProps) {
  const [mediaNameLength, setMediaNameLength] = useState(0);
  const { watch } = useFormContext();
  const maxMediaNameLength = maxLength ?? 32;

  const nameValue = watch('name');

  useEffect(() => {
    setMediaNameLength(nameValue?.length || 0);
  }, [nameValue]);

  const charsLeft = maxMediaNameLength - mediaNameLength;

  return (
    <div className="relative">
      <label>
        <TextInput.Input
          id={E2EID.uploadTitleInput}
          placeholder="Title"
          className="left-[36px] w-full  border-b-2 border-buttonAccent  bg-transparent outline-none placeholder:text-xl placeholder:font-thin placeholder:text-skin-muted"
          // requiredMessage="Please enter the Episode name"
          maxLength={maxMediaNameLength}
          maxLengthMessage="Max 32 characters for the name"
          name="name"
        />
        <Text
          className={`absolute right-0 top-8 text-sm font-bold  ${
            charsLeft < 8 ? 'text-red-500' : 'text-skin-inverted'
          }`}
        >
          {' '}
          {charsLeft}
        </Text>
      </label>
    </div>
  );
}
