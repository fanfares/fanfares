import { Slot } from '@radix-ui/react-slot';
import { InputHTMLAttributes, ReactNode, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

export interface TextInputRootProps {
  children: ReactNode;
}

function TextInputRoot(props: TextInputRootProps) {
  return (
    <div className="flex items-center w-full h-12 gap-3 px-3 py-4 bg-transparent rounded ring-buttonAccentHover focus-within:ring-1 ">
      {props.children}
    </div>
  );
}

TextInputRoot.displayName = 'TextInput.Root';

export interface TextInputIconProps {
  children: ReactNode;
  asChild?: boolean;
}

function TextInputIcon({ children, asChild }: TextInputIconProps) {
  const Comp = asChild ? Slot : 'button';
  return <Comp className="p-2 btn">{children}</Comp>;
}

TextInputIcon.displayName = 'TextInput.Icon';

export interface TextInputInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  requiredMessage?: string;
  maxLength?: number;
  maxLengthMessage?: string;
  type?: string;
}

function TextInputInput(props: TextInputInputProps) {
  const { register, unregister } = useFormContext();
  const { name, requiredMessage, maxLength, maxLengthMessage, type } = props;

  const otherProps = {
    ...props
  };
  delete otherProps['requiredMessage'];
  delete otherProps['maxLengthMessage'];

  useEffect(() => {
    register(name);
    return () => {
      unregister(name);
    };
  }, [register, unregister, name]);

  let maxLengthProps = {};
  if (maxLength) {
    maxLengthProps = {
      maxLength: maxLength,
      max: {
        value: maxLength,
        message: maxLengthMessage
      }
    };
  }

  return (
    <input
      type={type ?? 'text'}
      autoComplete="off"
      className="flex-1 p-2 text-xs bg-transparent outline-none text-skin-base placeholder:text-gray-400"
      {...register(name, {
        required: requiredMessage,
        ...maxLengthProps
      })}
      {...otherProps}
    />
  );
}

TextInputInput.displayName = 'TextInput.Input';

export interface TextInputEditableProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  maxLength: number;
}

function TextInputEditable(props: TextInputEditableProps) {
  const { register, unregister } = useFormContext();
  const { name, maxLength, className } = props;

  const otherProps = {
    ...props
  };
  delete otherProps['requiredMessage'];
  delete otherProps['maxLengthMessage'];
  delete otherProps['className'];

  const combinedClassName = `w-full resize-none flex-col bg-transparent text-start lg:h-full ${className}`;

  useEffect(() => {
    register(name);
    return () => {
      unregister(name);
    };
  }, [register, unregister, name]);

  return (
    <textarea
      {...register(name, {
        maxLength: maxLength
      })}
      autoComplete="off"
      className={combinedClassName}
      {...otherProps}
    />
  );
}

TextInputEditable.displayName = 'TextInput.Editable';

export const TextInput = {
  Root: TextInputRoot,
  Input: TextInputInput,
  InputEditable: TextInputEditable,
  Icon: TextInputIcon
};
