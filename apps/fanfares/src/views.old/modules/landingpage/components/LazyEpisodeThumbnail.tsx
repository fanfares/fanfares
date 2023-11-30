import clsx from 'clsx';
import Image from 'next/image';

const LazyEpisodeThumbnail = ({ src, transitioning }) => {
  return (
    <div
      className={clsx(
        'group relative my-auto ml-auto h-[100px] w-[100px] cursor-pointer  duration-500 hover:scale-105 md:h-[200px] md:w-[200px]',
        { 'opacity-0': transitioning, 'opacity-100': !transitioning }
      )}>
      <Image className="rounded" src={src} layout="fill" objectFit="cover" alt="Episode Thumbnail" />;
    </div>
  );
};

export default LazyEpisodeThumbnail;
