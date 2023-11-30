import { FontAwesomeIcon, IconDefinition } from '@excalibur/config/fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import * as Popover from '@radix-ui/react-popover';

interface PopOverProps {
  text: string;
  iconClassName?: string;
  className?: string;
  iconTrigger?: IconDefinition;
}

const PopOver = (props: PopOverProps) => {
  return (
    <>
      <Popover.Root>
        <Popover.Trigger className="PopoverTrigger">
          <FontAwesomeIcon
            className={`${props.iconClassName}`}
            icon={props.iconTrigger ? props.iconTrigger : faInfoCircle}
          />
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            side="top"
            className={`PopoverContent duration-1000 transition-all border border-buttonDisabled p-2 rounded bg-skin-fill/90 ${props.className}`}
            sideOffset={5}>
            {props.text}
            <Popover.Arrow className="PopoverArrow fill-white" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  );
};

export default PopOver;
