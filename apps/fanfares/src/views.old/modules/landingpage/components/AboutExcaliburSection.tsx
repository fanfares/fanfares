import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import '../style/style.module.css';
const AboutExcaliburSection = () => {
  const ref1 = useRef<HTMLDivElement | null>(null);
  const ref2 = useRef<HTMLDivElement | null>(null);
  const ref3 = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('showAnimation');
          } else {
            entry.target.classList.remove('showAnimation');
          }
        });
      });

      const node1 = ref1.current;
      const node2 = ref2.current;
      const node3 = ref3.current;

      if (node1) observer.observe(node1);
      if (node2) observer.observe(node2);
      if (node3) observer.observe(node3);

      return () => {
        if (node1) observer.unobserve(node1);
        if (node2) observer.unobserve(node2);
        if (node3) observer.unobserve(node3);
      };
    }
  }, []);

  return (
    <div className="relative z-50 flex flex-col max-w-4xl gap-20 px-4 mx-auto mt-20 text-sm text-justify md:px-8">
      <div className="absolute -left-60  h-[400px] w-[400px] bg-[url('/assets/featureSection1.svg')] bg-[length:400px_400px] bg-center bg-no-repeat md:-left-1/2 md:translate-x-1/2" />
      <div
        ref={ref1}
        className={clsx(
          'featureSectionAnimated relative flex flex-col items-center gap-8 transition-all duration-1000 md:flex-row'
        )}>
        <div id="podcasts-image" className="relative h-[200px] w-[200px]">
          <Image
            className="rounded drop-shadow-md"
            src={'/assets/podcast.webp'}
            alt=""
            layout="fill"
            objectFit="contain"
          />
        </div>
        <div className="">
          <h2 className="text-xl text-center md:text-start md:text-2xl">DECENTRALISED PODCASTS</h2>
          <p className="max-w-sm mt-8 text-sm md:max-w-lg md:text-base">
            Podcasts, each NFT is an Episode, each collection is a season. With Excalibur.FM, you can mint your audio
            podcast as an NFT within minutes. When the mint is complete, will be provided with a link that you can share
            so your content can be streamed, or minted by your audience, enabling you to monetise your content more
            effectively using web3 technology.
          </p>
        </div>
      </div>
      <div
        ref={ref2}
        className={clsx(
          'featureSectionAnimated flex flex-col-reverse items-center gap-8 transition-all duration-1000 md:flex-row'
        )}>
        {' '}
        <div>
          <h2 className="flex text-xl text-center md:text-start md:text-2xl">
            WEB<span className="-mt-[2px] mr-2">3 </span> AUDIOBOOKS
          </h2>
          <p className="max-w-sm mt-8 text-sm md:max-w-lg md:text-base">
            Audio books can be distributed on Excalibur. Each NFT is a chapter, each collection is a book. Upload your
            entire audio book in one, OR, you can release each chapter individually, as a separate audio NFT with a
            limited supply for each chapter, increasing its scarcity. You can also use Excalibur to manage where the
            royalties are sent, e.g., 50% goes to you and 50% goes to your co-creator.
          </p>
        </div>
        <div className="relative h-[200px] w-[200px]">
          <Image
            className="rounded drop-shadow-md"
            src={'/assets/audiobook.webp'}
            alt=""
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>{' '}
      <div
        ref={ref3}
        className={clsx(
          'featureSectionAnimated relative flex flex-col items-center gap-8 transition-all duration-1000 md:flex-row'
        )}>
        <div className="relative h-[200px] w-[200px]">
          <Image className="rounded drop-shadow-md" src={'/assets/dao.webp'} alt="" layout="fill" objectFit="contain" />
        </div>
        <div>
          <h2 className="text-xl text-center uppercase md:text-start md:text-2xl">
            Decentralised Autonomous Organisation (DAO)
          </h2>
          <p className="max-w-sm mt-8 text-sm sm:mx-auto md:mx-0 md:max-w-lg md:text-base">
            Every item of audio that is minted on Excalibur is DAO. Anyone that mints a copy of the audio NFT will gain
            access to the gated chat room. A creator can build a community and reward their members for attendance and
            participation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutExcaliburSection;
