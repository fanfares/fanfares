import { FAProSolid, FontAwesomeIcon } from '@excalibur/config/fontawesome';
import { useState } from 'react';
import { Text } from 'src/views/components/Text';
import ModalVideos from 'src/views/modals/ModalVideos';
import HeroSection from './HeroSection';

export enum ExcaliburVideos {
  whatIsExcalibur = 'What Is Excalibur',
  howExcaliburWorks = 'How Excalibur Works',
  theCommunity = 'The Community',
  excaliburHowTo = 'Excalibur How To',
  excaliburExplainer = 'Excalibur Explainer',
  null = 'null'
}

function AboutPageContent() {
  const [excaliburPlayer, setExcaliburPlayer] = useState<ExcaliburVideos>(ExcaliburVideos.null);

  const onClose = () => {
    setExcaliburPlayer(ExcaliburVideos.null);
  };

  const videoByState = () => {
    switch (excaliburPlayer) {
      case ExcaliburVideos.whatIsExcalibur:
        return 'https://www.youtube.com/embed/DLO_tRDIuwM?autoplay=0';
      case ExcaliburVideos.excaliburHowTo:
        return 'https://www.youtube.com/embed/abPQeoZpmTU?autoplay=0';
      case ExcaliburVideos.howExcaliburWorks:
        return 'https://www.youtube.com/embed/3y-PTX0L3RE?autoplay=0';
      case ExcaliburVideos.theCommunity:
        return 'https://www.youtube.com/embed/Zh4e90VOI18?autoplay=0';
      case ExcaliburVideos.excaliburExplainer:
        return 'https://www.youtube.com/embed/abPQeoZpmTU?autoplay=0';

      default:
        return 'null';
    }
  };

  const [showHowToVideo, setShowHowToVideo] = useState(false);

  const showHowToVideoToggle = () => {
    setShowHowToVideo(!showHowToVideo);
  };

  // const renderLarge = () => {
  //   return (
  //     <ReactPlayer
  //       width={1080}
  //       height={720}
  //       config={{
  //         youtube: {
  //           playerVars: { showinfo: 1 }
  //         }
  //       }}
  //       light
  //       url="https://www.youtube.com/embed/abPQeoZpmTU?autoplay=0"
  //       playing={showHowToVideo}
  //     />
  //   );
  // };

  // const renderMedium = () => {
  //   return (
  //     <ReactPlayer
  //       width={640}
  //       height={480}
  //       config={{
  //         youtube: {
  //           playerVars: { showinfo: 1 }
  //         }
  //       }}
  //       light
  //       url="https://www.youtube.com/embed/abPQeoZpmTU?autoplay=0"
  //       playing={showHowToVideo}
  //     />
  //   );
  // };

  // const renderSmall = () => {
  //   return (
  //     <ReactPlayer
  //       width={480}
  //       height={360}
  //       config={{
  //         youtube: {
  //           playerVars: { showinfo: 1 }
  //         }
  //       }}
  //       light
  //       url="https://www.youtube.com/embed/abPQeoZpmTU?autoplay=0"
  //       playing={showHowToVideo}
  //     />
  //   );
  // };

  return (
    <>
      <ModalVideos
        onClose={onClose}
        isOpen={excaliburPlayer === ExcaliburVideos.null ? false : true}
        src={videoByState()}
      ></ModalVideos>
      <HeroSection onClick={showHowToVideoToggle} />
      <div
        className={`defaultBackground absolute left-[50%] top-96 z-50 flex h-fit w-fit -translate-x-[50%] flex-col flex-wrap items-center  rounded-lg  border-2 border-buttonMuted p-4 text-center backdrop-blur-sm transition-all duration-500 ${
          showHowToVideo ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <button
          onClick={showHowToVideoToggle}
          className="ml-auto mb-4 flex h-5 w-5 items-center justify-center rounded bg-buttonAccentHover text-xs font-bold text-white drop-shadow-lg active:scale-95"
        >
          X
        </button>
        {/* <Media
          queries={{
            small: '(min-width: 264px) and (max-width: 767px)',
            medium: '(min-width: 768px) and (max-width: 1023px)',
            large: '(min-width: 1024px)'
          }}>
          {matches => (
            <div>
              <Fragment>{matches.large && renderLarge()}</Fragment>
              <Fragment>{matches.medium && renderMedium()}</Fragment>
              <Fragment>{matches.small && renderSmall()}</Fragment>
            </div>
          )}
        </Media> */}
        <p className="mt-4 flex flex-wrap">
          Here you can watch an explainer video with a step by step how to use the platform!
        </p>
      </div>
      <div className="relative mx-auto h-full px-4 pb-40">
        <div className="flex flex-col  items-center justify-center md:columns-2  ">
          <div className="  ">
            <div className="h-full rounded-lg bg-skin-button-accent/20 p-8 drop-shadow-md backdrop-blur">
              <span
                onClick={() => setExcaliburPlayer(ExcaliburVideos.whatIsExcalibur)}
                className="bg- mb-10 flex h-14 w-14 cursor-pointer items-center justify-center rounded-lg bg-skin-button-accent"
              >
                <FontAwesomeIcon icon={FAProSolid.faPlay} className={`  hidden w-8 justify-center text-xl  `} />
              </span>

              <Text className="mt-12 mb-8 font-bold text-white md:text-2xl">WHAT IS EXCALIBUR? </Text>
              <Text className="text-md mt-4 block text-justify text-gray-200 md:text-lg">
                Excalibur is a Web 3 Audio Platform where creators can monetize their audio content by receiving
                contributions from listeners. Additionally, it’s a decentralized space where creators can build a loyal
                and engaged community. Excalibur provides an additional revenue stream for creators in an industry where
                other revenue sources can at times be unpredictable. Blockchain technology is used to make payments
                quick and easy with incredibly low transaction fees, and where 95% of the revenue goes to the creator.
              </Text>
            </div>
          </div>
          <div className="mt-10">
            <div className="h-full rounded-lg bg-skin-button-accent/20 p-8 drop-shadow-md backdrop-blur">
              <span
                onClick={() => setExcaliburPlayer(ExcaliburVideos.howExcaliburWorks)}
                className="bg- mb-10 flex h-14 w-14 cursor-pointer items-center justify-center rounded-lg bg-skin-button-accent"
              >
                <FontAwesomeIcon icon={FAProSolid.faPlay} className={`  hidden w-8 justify-center text-xl  `} />
              </span>

              <Text className="mt-12 mb-8 font-bold text-white md:text-2xl">HOW DOES EXCALIBUR WORK </Text>
              <Text className="text-md mt-4 block text-justify text-gray-200 md:text-lg">
                Creators upload their audio content to Excalibur, this content could be ad-free, exclusive, or
                pre-release. The platform generates a link that they can send directly to their listeners. This can be
                done in many different ways but some suggestions are; via their email subscribers, placing the link on
                their website, and embedding it in the content description across all listening platforms. Clicking on
                the link will take the listener to a page where they can decide to make a contribution to the content.
                The content itself is open source, in addition to contributing, the listener can also choose to generate
                a link and share the content with others.
              </Text>
            </div>
          </div>

          <div className="mt-10">
            <div className="h-full rounded-lg bg-skin-button-accent/20 p-8 drop-shadow-md backdrop-blur">
              <span
                onClick={() => setExcaliburPlayer(ExcaliburVideos.theCommunity)}
                className="bg- mb-10 flex h-14 w-14 cursor-pointer items-center justify-center rounded-lg bg-skin-button-accent"
              >
                <FontAwesomeIcon icon={FAProSolid.faPlay} className={`  hidden w-8 justify-center text-xl  `} />
              </span>
              <Text className="mt-12 mb-8 font-bold text-white md:text-2xl">THE COMMUNITY </Text>
              <Text className="text-md mt-4 block text-justify text-gray-200 md:text-lg">
                The Excalibur community can own a digital membership card by making a contribution to podcasts,
                audiobooks, or other audio content they enjoy and want to support. Your digital membership card gives
                you access to a community of like-minded people who also enjoyed that specific piece of audio content
                enough to contribute. The digital membership card gives you entry to a platform where you can speak to
                other membership holders, and even the creator themselves.
              </Text>
            </div>
          </div>

          <div className="mt-10">
            <div className="h-full rounded-lg bg-skin-button-accent/20 p-8 drop-shadow-md backdrop-blur">
              <span className="bg- mb-10 flex h-14 w-14 items-center justify-center rounded-lg bg-skin-button-accent"></span>

              <Text className="mt-12 mb-8 font-bold text-white md:text-2xl">THE NETWORK EFFECT </Text>
              <Text className="text-md mt-4 block text-justify text-gray-200 md:text-lg">
                The Excalibur community is incentivized to become affiliates by sharing their favorite content via a
                unique link. This will include their crypto wallet in the future revenue stream. The community can earn
                an income by distributing podcasts to people whom they think will appreciate them. Smart contracts
                enable the revenue to be automatically split between the creators and the affiliates from the community.
                This is Web 3, no legal contracts are required, no accounts department, no invoicing, and no chasing
                people for money.
              </Text>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AboutPageContent;
