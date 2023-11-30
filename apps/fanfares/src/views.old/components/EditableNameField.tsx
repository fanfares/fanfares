import { TextInput } from 'src/views/components/TextInput';

export interface EditableNameFieldProps {
  id: string;
  maxLength: number;
  isEditable?: boolean;
  currentValue?: string;
  className?: string;
}

export function EditableNameField(props: EditableNameFieldProps) {
  const { id, className, maxLength, isEditable } = props;
  const maxNameLength = maxLength;

  return (
    <div className="flex items-center gap-x-2">
      <TextInput.Input
        aria-label="Episode name edit field"
        disabled={!isEditable}
        id={id}
        requiredMessage="Name is required"
        className={className ?? 'editable-input text-md h-8 p-2 font-bold line-clamp-2 md:text-lg lg:text-2xl'}
        maxLength={maxNameLength}
        maxLengthMessage="Max 32 characters for the name"
        name="name"
      />
    </div>
  );
}
