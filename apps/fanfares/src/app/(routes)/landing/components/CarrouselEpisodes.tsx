// import { FAProSolid, FontAwesomeIcon } from '@excalibur/config/fontawesome';
import clsx from "clsx"
import Image from "next/image"
import Link from "next/link"
import { Suspense, useEffect, useState } from "react"
import LazyEpisodeThumbnail from "./LazyEpisodeThumbnail"
import SectionTitle from "./SectionTitle"

function CarrouselEpisodes() {
  return <></>
  // const [activeCarrousel, setActiveCarrousel] = useState(0);
  // const [transitioning, setTransitioning] = useState(false);
  // const [isThumbnailMounted, setIsThumbnailMounted] = useState(false);

  // useEffect(() => {
  //   setIsThumbnailMounted(true);
  // }, []);

  // const episodes = [
  //   {
  //     creator: 'Excalibur',
  //     title: 'AI Special Guest',
  //     description: 'Today we have a special guest who works closely with AI, what will we find out?.',
  //     link: 'https://excalibur.fm/player/H5BwguCnsafaQfdi3KFrSggxvHsb18DLH5pEmt7ScV7V',
  //     logo: '/assets/excalibur.png',
  //     episodeThumbnail: 'https://arweave.net/YUi3QnPy72Zbu-k7LLYgMQG_rOxaHseY3O20Ki4Ok_0?w=1920'
  //   },
  //   {
  //     creator: 'Excalibur',
  //     title: 'Can AI Use Crypto?',
  //     description: 'Today we talk about what would happen if an AI got a hold of a crypto wallet.',
  //     link: 'https://excalibur.fm/player/BAZdPW5gRjy8vvDBrYTy4NGfdDWSgXUWqzG29mUuePzT',
  //     logo: '/assets/excalibur.png',
  //     episodeThumbnail: 'https://arweave.net/YUi3QnPy72Zbu-k7LLYgMQG_rOxaHseY3O20Ki4Ok_0?w=1920'
  //   },
  //   {
  //     creator: 'Nephology',
  //     title: '22: Italian Crypto Tax Regime',
  //     description:
  //       'Jamie is joined by Michele Ferrari, who has returned to the podcast to discuss the new tax regime for crypto in Italy. If you live in Italy or if you have ever considered moving there, this episode explores everyhitng you need to know about moving, trading and holdings your crypto.',
  //     link: 'https://excalibur.fm/player/Ds2Mdvd7Vkyg6vK6YAZn1QCZc9GW8qnbNz8rzWNRd9y1',
  //     logo: 'https://arweave.net/D2xg8FapEqX4Of_DRDmv8V1HN12lB6nQicJIpqsuyk8?w=2048',
  //     episodeThumbnail: 'https://arweave.net/D2xg8FapEqX4Of_DRDmv8V1HN12lB6nQicJIpqsuyk8?w=2048'
  //   },
  //   {
  //     creator: 'Excalibur',
  //     title: 'Crypto & Government',
  //     description: 'Today we talk about how crypto and government can co-exsist!',
  //     link: 'https://excalibur.fm/player/FUHxQ8f6YnXqEfbrEEp4buV98a263bMKvSv2Ewr5Ud96',
  //     logo: '/assets/excalibur.png',
  //     episodeThumbnail: 'https://arweave.net/YUi3QnPy72Zbu-k7LLYgMQG_rOxaHseY3O20Ki4Ok_0?w=1920'
  //   }
  // ];

  // const handleNextCarrousel = () => {
  //   setTransitioning(true);
  //   if (activeCarrousel < episodes.length - 1) {
  //     setActiveCarrousel(activeCarrousel + 1);
  //   } else {
  //     setActiveCarrousel(0);
  //   }
  // };

  // const handlePreviousCarrousel = () => {
  //   setTransitioning(true);
  //   if (activeCarrousel > 0) {
  //     setActiveCarrousel(activeCarrousel - 1);
  //   } else {
  //     setActiveCarrousel(episodes.length - 1);
  //   }
  // };

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     if (activeCarrousel < episodes.length - 1) {
  //       setActiveCarrousel(activeCarrousel + 1);
  //     } else {
  //       setActiveCarrousel(0);
  //     }
  //     setTransitioning(true);
  //   }, 5000);
  //   return () => clearTimeout(timeout);
  // }, [activeCarrousel, episodes.length]);

  // useEffect(() => {
  //   const timeout = setTimeout(() => setTransitioning(false), 500);
  //   return () => clearTimeout(timeout);
  // }, [activeCarrousel, episodes.length]);

  // const renderLeftContent = () => {
  //   return (
  //     <div className="mt-2 flex w-[205px] flex-col md:w-[400px] lg:w-[620px]">
  //       <div className="flex items-center gap-2 md:gap-4">
  //         {renderPodcastLogo()}

  //         {renderPodcastTitle()}
  //       </div>
  //       {renderEpisodeDescription()}
  //     </div>
  //   );
  // };
  // const renderRightContent = () => {
  //   return (
  //     <div className="mb-auto ml-auto mt-2 flex flex-col justify-start text-start">
  //       <Link passHref href={episodes[activeCarrousel].link}>
  //         {renderEpisodeThumbnail()}
  //       </Link>
  //       {renderEpisodeSmallTitle()}
  //       <p
  //         className={clsx('text-xs font-thin md:text-sm', {
  //           'opacity-0': transitioning,
  //           'opacity-100 ': !transitioning
  //         })}>
  //         Mint 0.1 Sol
  //       </p>
  //     </div>
  //   );
  // };
  // const renderPodcastLogo = () => {
  //   return (
  //     <div
  //       className={clsx('relative h-8 w-8 md:h-16 md:w-16', {
  //         'opacity-0': transitioning,
  //         'opacity-100 ': !transitioning
  //       })}>
  //       <Image src={!transitioning && episodes[activeCarrousel].logo} layout="fill" objectFit="cover" alt="" />
  //     </div>
  //   );
  // };
  // const renderPodcastTitle = () => {
  //   return (
  //     <>
  //       <p
  //         className={clsx('w-[150px] truncate text-start text-sm font-semibold uppercase md:w-[400px] md:text-4xl', {
  //           'opacity-0': transitioning,
  //           'opacity-100': !transitioning
  //         })}>
  //         {!transitioning && episodes[activeCarrousel].title}
  //       </p>
  //     </>
  //   );
  // };
  // const renderEpisodeDescription = () => {
  //   return (
  //     <div
  //       className={clsx(
  //         'mt-2 h-[85px] w-full overflow-scroll text-start text-xs md:h-[174px] md:text-base lg:text-lg ',
  //         { 'opacity-0': transitioning, 'opacity-100': !transitioning }
  //       )}>
  //       {!transitioning && episodes[activeCarrousel].description}
  //     </div>
  //   );
  // };
  // const renderEpisodeThumbnail = () => {
  //   return (
  //     <a target="_blank" aria-label={episodes[activeCarrousel].title}>
  //       {isThumbnailMounted && (
  //         <Suspense
  //           fallback={
  //             <div className="h-[100px] w-[100px] bg-skin-fill md:h-[200px] md:w-[200px]">
  //               <FontAwesomeIcon className="animate-spin text-4xl" icon={FAProSolid.faSpinnerThird} />
  //             </div>
  //           }>
  //           <LazyEpisodeThumbnail
  //             src={!transitioning && episodes[activeCarrousel].episodeThumbnail}
  //             transitioning={transitioning}
  //           />
  //         </Suspense>
  //       )}
  //     </a>
  //   );
  // };
  // const renderEpisodeSmallTitle = () => {
  //   return (
  //     <p
  //       className={clsx('w-[100px] truncate text-xs font-medium md:mt-2 md:w-[200px] md:text-sm', {
  //         'opacity-0': transitioning,
  //         'opacity-100': !transitioning
  //       })}>
  //       {episodes[activeCarrousel].title}
  //     </p>
  //   );
  // };
  // const renderPreviousButton = () => {
  //   return (
  //     <button aria-label="previous episode" onClick={handlePreviousCarrousel}>
  //       <FontAwesomeIcon
  //         className="mt-1 text-xl font-extrabold hover:scale-105 active:scale-95"
  //         icon={FAProSolid.faLessThan}
  //       />
  //     </button>
  //   );
  // };
  // const renderEpisodesDots = () => {
  //   function handleDotPress(index: number) {
  //     setActiveCarrousel(index);
  //     setTransitioning(true);
  //   }
  //   return (
  //     <div className="flex items-center gap-4">
  //       {episodes.map((_, index) => (
  //         <span
  //           aria-label={`Episode ${index + 1}`}
  //           onClick={() => handleDotPress(index)}
  //           key={index}
  //           className={clsx('cursor-pointer text-2xl font-bold text-white transition-all duration-500', {
  //             'text-buttonAccentHover': activeCarrousel == index
  //           })}>
  //           •
  //         </span>
  //       ))}
  //     </div>
  //   );
  // };
  // const renderNextButton = () => {
  //   return (
  //     <button aria-label="next episode" onClick={handleNextCarrousel}>
  //       <FontAwesomeIcon
  //         className="mt-1 text-xl font-extrabold hover:scale-105 active:scale-95"
  //         icon={FAProSolid.faGreaterThan}
  //       />
  //     </button>
  //   );
  // };

  // return (
  //   <div
  //     className={clsx(
  //       'carrouselEpisodesSection mt-24 flex flex-col items-center py-4 drop-shadow-2xl transition-opacity duration-500  ',
  //       {
  //         'delay-200 ease-out': transitioning,
  //         'delay-200 ease-in': !transitioning
  //       }
  //     )}>
  //     <SectionTitle title="Featuring now !" />
  //     <div className="md:px8 mx-auto mt-12 flex w-full flex-col items-center justify-center px-4 md:max-w-2xl lg:max-w-4xl">
  //       <div
  //         className="flex h-fit max-h-[18rem] rounded-lg
  //       border border-gray-50/10 bg-white/[2%] p-4 text-center drop-shadow-2xl filter backdrop-blur-md">
  //         {renderLeftContent()}
  //         {renderRightContent()}
  //       </div>
  //     </div>
  //     <div className="mt-2 flex h-10 items-center justify-center gap-8">
  //       {renderPreviousButton()}
  //       {renderEpisodesDots()}
  //       {renderNextButton()}
  //     </div>
  //   </div>
  // );
}

export default CarrouselEpisodes
