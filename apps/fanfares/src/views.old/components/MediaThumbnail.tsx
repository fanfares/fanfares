import Image from 'next/image';
import { contentfulLoader } from '../../controllers/utils/image-loader';

export interface ThumbnailPropsProps {
  src: string;
  alt?: string;
}

export function ThumbnailProps(props: ThumbnailPropsProps) {
  const { src, alt } = props;

  return (
    <div className="aspect-square ">
      <Image loader={contentfulLoader} className={`rounded-xl`} src={src} alt={alt} />
    </div>
  );
}

export default ThumbnailProps;
