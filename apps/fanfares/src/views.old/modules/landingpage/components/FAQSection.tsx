import clsx from 'clsx';
import { ReactNode, useEffect, useRef, useState } from 'react';
import SectionTitle from './SectionTitle';

export interface FaqBoxProps {
  boxNumber: number;
  boxState: number;
  setBoxState: (boxNumber: number) => void;
  boxTitle: string;
  boxTitleId?: string;
  boxButtonId?: string;
  children: ReactNode;
}

function FaqBox(props: FaqBoxProps) {
  const { boxNumber, boxState, setBoxState, boxTitle, boxButtonId, boxTitleId, children } = props;
  const [isOpening, setIsOpening] = useState(false);
  const isOpen = boxNumber === boxState;

  const setBox = () => {
    setIsOpening(true);
    if (!isOpen) {
      setBoxState(boxNumber);
    } else {
      setBoxState(null);
    }
  };

  const renderArrows = () => {
    return (
      <button
        className={clsx('svgUp transition duration-300', {
          'rotate-180': isOpen,
          'rotate-0': !isOpen,
          'opacity-0': isOpening,
          'opacity-100': !isOpening
        })}>
        <svg
          width="10"
          role="button"
          aria-label="open dropdown"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1L5 5L9 1" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    );
  };
  // const renderUpArrow = () => {
  //   return (
  //     <button className="svgUp">
  //       <svg
  //         role="button"
  //         aria-label="close dropdown"
  //         width="10"
  //         height="6"
  //         viewBox="0 0 10 6"
  //         fill="none"
  //         xmlns="http://www.w3.org/2000/svg">
  //         <path d="M1 5L5 1L9 5" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  //       </svg>
  //     </button>
  //   );
  // };

  // const renderDownArrow = () => {
  //   return (
  //     <button className="svgDown">
  //       <svg
  //         width="10"
  //         role="button"
  //         aria-label="open dropdown"
  //         height="6"
  //         viewBox="0 0 10 6"
  //         fill="none"
  //         xmlns="http://www.w3.org/2000/svg">
  //         <path d="M1 1L5 5L9 1" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  //       </svg>
  //     </button>
  //   );
  // };

  const descriptionRef = useRef<HTMLDivElement>(null);

  const renderDescription = () => {
    return (
      <div
        ref={descriptionRef}
        className={clsx('mt-8 overflow-hidden leading-normal text-white transition-all duration-500 ease-in-out', {
          'mt-0 h-0': !isOpen
        })}>
        {children}
      </div>
    );
  };

  useEffect(() => {
    if (isOpen) {
      const actualHeight = descriptionRef.current?.scrollHeight || 0;
      descriptionRef.current.style.height = `${actualHeight}px`;
    } else {
      descriptionRef.current.style.height = '0';
    }
    const timeout = setTimeout(() => setIsOpening(false), 500);
    return () => clearTimeout(timeout);
  }, [isOpen]);

  return (
    <div
      id={boxButtonId}
      onClick={setBox}
      className={clsx(
        'mt-2 cursor-pointer rounded  border border-gray-50/10 p-4 shadow drop-shadow-2xl filter backdrop-blur-md transition-all duration-500 ',
        {
          'bg-white/[5%]': isOpen,
          'bg-white/[2%]': !isOpen
        }
      )}>
      <div className="flex h-2 items-center justify-between ">
        <div>
          <h2 id={boxTitleId} className="text-base font-semibold leading-none md:text-lg">
            {boxTitle}
          </h2>
        </div>
        <div
          className={clsx(
            'arrow cursor-pointer ring-offset-white transition-opacity duration-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
          )}>
          {/* {isOpen && !isOpening ? renderUpArrow() : renderDownArrow()} */}
          {renderArrows()}
        </div>
      </div>
      <div
        className={clsx('h-full transition-[height] delay-1000 duration-500 ease-in-out', {
          ' h-full ': isOpen,
          '  h-0': !isOpen
        })}>
        {renderDescription()}
      </div>
      {/* {renderDescription()} */}
    </div>
  );
}

export default function FAQSection() {
  const [boxState, setBoxState] = useState<number | null>(null);

  return (
    <div className="relative mx-auto mt-32 flex w-full flex-col content-center items-center justify-center px-8">
      {/* <span aria-disabled className="z-0 faq-svg-bl" />
      <span aria-disabled className="z-0 faq-svg-tr" /> */}
      <div className="mx-auto w-full ">
        <SectionTitle title="F.A.Q" />
      </div>
      <div className="w-full lg:w-3/4">
        <h2 id="e2e-general-heading" className="mt-8 block text-xl font-semibold md:text-2xl">
          General
        </h2>
        <FaqBox
          boxTitleId="e2e-how-it-works-heading"
          boxButtonId="e2e-how-it-works-box"
          boxNumber={0}
          setBoxState={setBoxState}
          boxState={boxState}
          boxTitle={'How does Excalibur work?'}>
          <p id="e2e-how-it-works-text" className="mt-2 block transition-all duration-1000">
            Excalibur is a Web 3 Audio Platform where creators can monetize their audio content by receiving
            contributions from listeners. Additionally, it&apos;s a decentralized space where creators can build a loyal
            and engaged community. Excalibur provides an additional revenue stream for podcasters in an industry where
            other revenue sources can be unpredictable. The listeners and community members have the chance to own a
            digital membership card by making contributions to the creator of their favorite content whether that&apos;s
            a podcast, audiobook, or something else.
          </p>
        </FaqBox>
        <FaqBox
          boxNumber={1}
          setBoxState={setBoxState}
          boxState={boxState}
          boxTitle={'What is a Digital Membership Card?'}>
          <p className="mt-2 block">
            It’s a unique digital membership card in the form of a Non Fungible Token that cannot be copied or
            substituted. It is recorded on the blockchain, which is used to certify its authenticity and ownership.
          </p>
        </FaqBox>
        <FaqBox
          boxNumber={2}
          setBoxState={setBoxState}
          boxState={boxState}
          boxTitle={'What does the Digital Membership Card get me?'}>
          <p className="mt-2 block">
            Your digital membership card gives you access to a community of like-minded people who also enjoyed a
            specific piece of audio content enough to make a contribution and obtain a digital collectible that acts as
            a membership card for that particular community. The digital membership card gives you entry to a platform
            where you can speak to other membership holders, and the creator themselves.
          </p>
        </FaqBox>
        <h2 className="mt-8 block text-xl font-semibold md:text-2xl">For Creators</h2>
        <FaqBox boxNumber={3} setBoxState={setBoxState} boxState={boxState} boxTitle={'Why would I use Excalibur?'}>
          <ol>
            <li>
              <p className="">
                - As a creator Excalibur is an additional revenue stream that allows creators to earn 95% of the revenue
                earned vs the usual 50% in the audio industry.
              </p>
            </li>
            <li>
              <p className="">
                - Excalibur also acts as a gateway to Web3 for creators who want to get into the space.
              </p>
            </li>
            <li>
              <p className="">
                - Another benefit is the opportunity to build a decentralized, engaged community around your content.
              </p>
            </li>
          </ol>
        </FaqBox>
        <FaqBox
          boxNumber={4}
          setBoxState={setBoxState}
          boxState={boxState}
          boxTitle={'Why does it cost 0.01489 SOL to publish an audio file?'}>
          <p className="mt-2 block">
            This is a transaction fee, known as a gas fee, which is standard to Web3. This gas fee facilitates the
            actual upload and is what allows any platform to be decentralized.
          </p>
        </FaqBox>
        <h2 className="mt-8 block text-xl font-semibold md:text-2xl">For Listeners and Community Members</h2>
        <FaqBox boxNumber={5} setBoxState={setBoxState} boxState={boxState} boxTitle={'Why would I use Excalibur?'}>
          <ol>
            <li>
              <p className="">
                - Excalibur gives you access to a community of like-minded people who also enjoyed a specific piece of
                audio content enough to make a contribution and obtain a digital collectible that acts as a membership
                card for that particular community.
              </p>
            </li>
            <li>
              <p className="">
                - Your digital membership card gives you entry to a platform where you can speak to other membership
                holders, and the creator themselves.
              </p>
            </li>
            <li>
              <p className="">
                - As a community member, you have influence, an opinion, and ownership of a part of the content you
                love.
              </p>
            </li>
          </ol>
        </FaqBox>
        <FaqBox
          boxNumber={6}
          setBoxState={setBoxState}
          boxState={boxState}
          boxTitle={'Can I use Excalibur if I am not familiar with Web3, NFTs, or Crypto?'}>
          <p className="mt-2 block">
            Yes, absolutely! To ensure our platform is accessible to all community members and listeners we have
            Web3auth sign in and set up which is easy and straightforward for everyone to use.
          </p>
        </FaqBox>
        <h2 className="mt-8 block text-xl font-semibold md:text-2xl">Your Wallet</h2>
        <FaqBox boxNumber={7} setBoxState={setBoxState} boxState={boxState} boxTitle={'What is a crypto wallet?'}>
          <p className="">A self-custody wallet that the person has full autonomy over the funds and transactions.</p>
        </FaqBox>
        <FaqBox
          boxNumber={8}
          setBoxState={setBoxState}
          boxState={boxState}
          boxTitle={'What type of crypto wallet do I need to use Excalibur?'}>
          <p className="">
            You can use Excalibur without a crypto-native wallet. However, if you want the whole Web3 experience,
            Excalibur runs on the Solana blockchain and the preferred wallet is Glow wallet, which can be downloaded at
            glow.app.
          </p>
        </FaqBox>
        <FaqBox boxNumber={9} setBoxState={setBoxState} boxState={boxState} boxTitle={'How do I create a Glow wallet?'}>
          <p className="">
            Glow, can be downloaded at Glow.app, make sure to write down (non-digitally) your 12-word seed phrase and
            keep it in a safe place.
          </p>
        </FaqBox>
        <FaqBox boxNumber={10} setBoxState={setBoxState} boxState={boxState} boxTitle={'How can we help you further?'}>
          <p className="">
            Email us at&nbsp;
            <a className="underline" href="mailto:support@excalibur.fm">
              support@excalibur.fm
            </a>
          </p>
        </FaqBox>
      </div>
    </div>
  );
}
