import { FAProSolid, FontAwesomeIcon } from '@excalibur/config/fontawesome';
import Link from 'next/link';

export interface HeroSectionProps {
  onClick?: () => void;
}

function HeroSection(props: HeroSectionProps) {
  //This is how routing works in Next.js

  return (
    <div className=" relative mx-auto overflow-hidden ">
      <div className="relative mx-auto max-w-2xl py-16 px-4 text-center sm:py-20 sm:px-6 lg:px-8">
        <h1 className="block text-3xl font-black text-skin-base md:text-6xl">EXCALIBUR (Beta)</h1>
        <p className="mt-8 block text-xl leading-6 text-skin-muted md:text-2xl ">Web3 Audio</p>
        <p className="mt-2 block text-xl leading-6 text-skin-muted md:text-2xl">
          Join the Largest Community of Web3 Storytellers
        </p>

        <div className="mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center">
          <div className="mx-auto space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0 md:space-x-2 ">
            <Link href="/upload">
              <a className="btn w-full md:w-36">Create</a>
            </Link>
            <Link href="/player/">
              <a className="btn w-full md:w-36">Listen</a>
            </Link>
            <button className="btn hidden w-full md:w-36" onClick={props.onClick}>
              How to use <FontAwesomeIcon className="ml-1" icon={FAProSolid.faQuestion} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
