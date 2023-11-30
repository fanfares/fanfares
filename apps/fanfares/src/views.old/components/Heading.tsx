import { Slot } from '@radix-ui/react-slot';
import { clsx } from 'clsx';
import { ReactNode } from 'react';

export interface HeadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
  asChild?: boolean;
  className?: string;
  id?: string;
}

export function Heading({ size = 'md', children, asChild, className, id }: HeadingProps) {
  const Comp = asChild ? Slot : 'h2';
  return (
    <Comp
      id={id}
      className={clsx(
        'font-sans font-bold text-gray-100 ',
        {
          'text-lg': size === 'sm',
          'text-xl': size === 'md',
          'text-2xl': size === 'lg',
          'text-4xl': size === 'xl'
        },
        className
      )}>
      {children}
    </Comp>
  );
}
