import { ReactNode, useState } from 'react';
import { Heading } from 'src/views/components/Heading';
import { Text } from 'src/views/components/Text';

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

  const isOpen = boxNumber === boxState;

  const setBox = () => {
    if (!isOpen) {
      setBoxState(boxNumber);
    } else {
      setBoxState(null);
    }
  };

  const renderUpArrow = () => {
    return (
      <button className="svgUp">
        <svg
          role="button"
          aria-label="close dropdown"
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M1 5L5 1L9 5" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    );
  };

  const renderDownArrow = () => {
    return (
      <button className="svgDown">
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

  const renderDescription = () => {
    return (
      <ul className="">
        <li>
          <div className="mt-4 text-base leading-normal text-skin-muted ">{children}</div>
        </li>
      </ul>
    );
  };

  return (
    <>
      <div id={boxButtonId} onClick={setBox} className="mt-2 cursor-pointer rounded bg-skin-fill/20 p-8 shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 id={boxTitleId} className="text-base font-semibold leading-none text-skin-base">
              {boxTitle}
            </h2>
          </div>
          <div className="arrow cursor-pointer ring-offset-white focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2">
            {isOpen ? renderUpArrow() : renderDownArrow()}
          </div>
        </div>
        {isOpen ? renderDescription() : null}
      </div>
    </>
  );
}

export default function FaqTest() {
  const [boxState, setBoxState] = useState<number | null>(null);

  return (
    <div className="relative z-20 flex w-full flex-col items-start justify-center px-6 pb-32 sm:px-0">
      <div className="mt-4">
        <Heading id="e2e-faq-heading" className="text-xl font-bold leading-10 text-white md:text-2xl xl:text-3xl">
          Frequently asked questions
        </Heading>
      </div>
      <div className="w-full lg:w-3/4">
        <Heading id="e2e-general-heading" size="md" className="mt-8 block">
          General
        </Heading>
        <FaqBox
          boxTitleId="e2e-how-it-works-heading"
          boxButtonId="e2e-how-it-works-box"
          boxNumber={0}
          setBoxState={setBoxState}
          boxState={boxState}
          boxTitle={'How does Excalibur work?'}>
          <Text id="e2e-how-it-works-text" className="mt-2 block text-lg">
            Excalibur is a Web 3 Audio Platform where creators can monetize their audio content by receiving
            contributions from listeners. Additionally, it&apos;s a decentralized space where creators can build a loyal
            and engaged community. Excalibur provides an additional revenue stream for podcasters in an industry where
            other revenue sources can be unpredictable. The listeners and community members have the chance to own a
            digital membership card by making contributions to the creator of their favorite content whether that&apos;s
            a podcast, audiobook, or something else.
          </Text>
        </FaqBox>
        <FaqBox
          boxNumber={1}
          setBoxState={setBoxState}
          boxState={boxState}
          boxTitle={'What is a Digital Membership Card?'}>
          <Text className="mt-2 block text-lg">
            It’s a unique digital membership card in the form of a Non Fungible Token that cannot be copied or
            substituted. It is recorded on the blockchain, which is used to certify its authenticity and ownership.
          </Text>
        </FaqBox>
        <FaqBox
          boxNumber={2}
          setBoxState={setBoxState}
          boxState={boxState}
          boxTitle={'What does the Digital Membership Card get me?'}>
          <Text className="mt-2 block text-lg">
            Your digital membership card gives you access to a community of like-minded people who also enjoyed a
            specific piece of audio content enough to make a contribution and obtain a digital collectible that acts as
            a membership card for that particular community. The digital membership card gives you entry to a platform
            where you can speak to other membership holders, and the creator themselves.
          </Text>
        </FaqBox>
        <Heading size="md" className="mt-8 block ">
          For Creators
        </Heading>
        <FaqBox boxNumber={3} setBoxState={setBoxState} boxState={boxState} boxTitle={'Why would I use Excalibur?'}>
          <ol>
            <li>
              <Text className="">
                - As a creator Excalibur is an additional revenue stream that allows creators to earn 95% of the revenue
                earned vs the usual 50% in the audio industry.
              </Text>
            </li>
            <li>
              <Text className="">
                - Excalibur also acts as a gateway to Web3 for creators who want to get into the space.
              </Text>
            </li>
            <li>
              <Text className="">
                - Another benefit is the opportunity to build a decentralized, engaged community around your content.
              </Text>
            </li>
          </ol>
        </FaqBox>
        <FaqBox
          boxNumber={4}
          setBoxState={setBoxState}
          boxState={boxState}
          boxTitle={'Why does it cost 0.01489 SOL to publish an audio file?'}>
          <Text className="mt-2 block text-lg">
            This is a transaction fee, known as a gas fee, which is standard to Web3. This gas fee facilitates the
            actual upload and is what allows any platform to be decentralized.
          </Text>
        </FaqBox>
        <Heading size="md" className="mt-8 block ">
          For Listeners and Community Members
        </Heading>
        <FaqBox boxNumber={5} setBoxState={setBoxState} boxState={boxState} boxTitle={'Why would I use Excalibur?'}>
          <ol>
            <li>
              <Text className="">
                - Excalibur gives you access to a community of like-minded people who also enjoyed a specific piece of
                audio content enough to make a contribution and obtain a digital collectible that acts as a membership
                card for that particular community.
              </Text>
            </li>
            <li>
              <Text className="">
                - Your digital membership card gives you entry to a platform where you can speak to other membership
                holders, and the creator themselves.
              </Text>
            </li>
            <li>
              <Text className="">
                - As a community member, you have influence, an opinion, and ownership of a part of the content you
                love.
              </Text>
            </li>
          </ol>
        </FaqBox>
        <FaqBox
          boxNumber={6}
          setBoxState={setBoxState}
          boxState={boxState}
          boxTitle={'Can I use Excalibur if I am not familiar with Web3, NFTs, or Crypto?'}>
          <Text className="mt-2 block text-lg">
            Yes, absolutely! To ensure our platform is accessible to all community members and listeners we have
            Web3auth sign in and set up which is easy and straightforward for everyone to use.
          </Text>
        </FaqBox>
        <Heading size="md" className="mt-8 block ">
          Your Wallet
        </Heading>
        <FaqBox boxNumber={7} setBoxState={setBoxState} boxState={boxState} boxTitle={'What is a crypto wallet?'}>
          <Text className="">
            A self-custody wallet that the person has full autonomy over the funds and transactions.
          </Text>
        </FaqBox>
        <FaqBox
          boxNumber={8}
          setBoxState={setBoxState}
          boxState={boxState}
          boxTitle={'What type of crypto wallet do I need to use Excalibur?'}>
          <Text className="">
            You can use Excalibur without a crypto-native wallet. However, if you want the whole Web3 experience,
            Excalibur runs on the Solana blockchain and the preferred wallet is Glow wallet, which can be downloaded at
            Glow.app.
          </Text>
        </FaqBox>
        <FaqBox boxNumber={9} setBoxState={setBoxState} boxState={boxState} boxTitle={'How do I create a Glow wallet?'}>
          <Text className="">
            Glow can be downloaded at Glow.app, make sure to write down (non-digitally) your 12-word seed phrase and
            keep it in a safe place.
          </Text>
        </FaqBox>
        <FaqBox boxNumber={10} setBoxState={setBoxState} boxState={boxState} boxTitle={'How can we help you further?'}>
          <Text className="">
            Email us at&nbsp;
            <a className="underline" href="mailto:support@excalibur.fm">
              support@excalibur.fm
            </a>
          </Text>
        </FaqBox>
      </div>
    </div>
  );
}
