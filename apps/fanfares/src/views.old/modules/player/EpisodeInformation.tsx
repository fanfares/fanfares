import moment from 'moment';
import { DrmMediaAccount } from 'src/controllers/drm-api';
import { Text } from 'src/views/components/Text';

export interface EpisodeInformationProps {
  mediaAccount: DrmMediaAccount | undefined;
}

export function EpisodeInformation(props: EpisodeInformationProps) {
  const { mediaAccount } = props;

  const momentDate = moment(mediaAccount?.creationDate ?? Date.now());
  const date = momentDate.format('DD MMM, YYYY');

  return (
    <div className="mt-4 flex w-40 items-center gap-x-2 text-center  text-[12px] font-semibold text-skin-base">
      <Text className="">{date}</Text>
      <Text className="text-skin-inverted">•</Text>
      <Text className="">{mediaAccount?.durationString ?? ''}</Text>
      <Text className="ml-auto text-skin-inverted">{`#${mediaAccount?.episode ?? 0}`}</Text>
    </div>
  );
}

export default EpisodeInformation;
