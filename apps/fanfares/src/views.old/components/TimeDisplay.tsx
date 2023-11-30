import { FC } from 'react';

export interface TimeDisplayProps {
  timeInSeconds: number;
}

export const TimeDisplay: FC<TimeDisplayProps> = ({ timeInSeconds }: TimeDisplayProps) => {
  if (!timeInSeconds) {
    return null;
  } else if (timeInSeconds < 60) {
    return <span className="lowercase">{Math.floor(timeInSeconds)}s</span>;
  } else if (timeInSeconds < 60 * 60) {
    return <span className="lowercase">{Math.floor(timeInSeconds / 60)}min {Math.floor(timeInSeconds % 60)}s </span>;
  } else {
    const hrs = Math.floor(timeInSeconds / (60 * 60));
    const mins = Math.floor((timeInSeconds - (hrs * 60 * 60)) / 60);
    return <span className="lowercase">{hrs}hrs {mins}mins</span>;
  }
};
