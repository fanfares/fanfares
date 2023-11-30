import { TextInput } from 'src/views/components/TextInput';

export interface EditableDescriptionFieldProps {
  id: string;
  maxLength: number;
  isEditable?: boolean;
  className?: string;
}

export function EditableDescriptionField(props: EditableDescriptionFieldProps) {
  const { id, className, maxLength, isEditable } = props;
  const maxDescriptionLength = maxLength;

  return (
    <div className="w-full h-32 mt-4 align-top">
      {isEditable ? (
        <>
          <TextInput.InputEditable
            maxLength={maxDescriptionLength}
            name="description"
            className="flex w-full h-full p-2 mt-4 font-thin break-words resize-none editable-input overflow-x-clip text-start"
          />
        </>
      ) : (
        <>
          <TextInput.Input
            aria-label="Episode description edit field"
            disabled={!isEditable}
            id={id}
            className={
              className ??
              'editable-input mt-4 flex h-full w-full resize-none  overflow-x-clip break-words text-start font-thin '
            }
            name="description"
            requiredMessage="Description is required"
            maxLength={maxDescriptionLength}
          />
        </>
      )}
    </div>
  );
}
