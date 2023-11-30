import Link from 'next/link';

function Footer() {
  return (
    <div
      className="mt-20 flex h-fit w-full flex-col items-start border-t border-gray-50/10 bg-white/[2%] 
        p-4 py-8 text-center drop-shadow-2xl filter backdrop-blur-md ">
      <div className="flex flex-wrap gap-8 text-sm ">
        <div className="flex w-fit flex-col gap-2 text-start text-xs font-thin">
          <p className="mb-2 text-base font-semibold md:text-lg">Community</p>
          <Link passHref href="https://twitter.com/ExcaliburDao">
            <a className="text-sm md:text-base" target="_blank">
              Twitter
            </a>
          </Link>
          <Link passHref href="https://www.linkedin.com/company/excaliburdao/">
            <a className="text-sm md:text-base" target="_blank">
              LinkedIn
            </a>
          </Link>
          {/* <p>Discord</p> */}
        </div>
        <div className="flex w-fit flex-col gap-2 text-start text-xs font-thin ">
          <p className="mb-2 text-base font-semibold md:text-lg">Legal</p>
          <Link passHref href="https://docs.excalibur.fm/docs/Terms">
            <a className="text-sm md:text-base" target="_blank">
              Terms & Conditions
            </a>
          </Link>
          {/* <p>Privacy</p> */}
          <Link passHref href="mailto:support@excalibur.fm">
            <a className="text-sm md:text-base" href="mailto:support@excalibur.fm">
              Contact us
            </a>
          </Link>
        </div>{' '}
        <div className="flex w-fit flex-col gap-2 text-start text-xs font-thin ">
          <p className="mb-2 text-base font-semibold md:text-lg">Resources</p>
          <Link passHref href="https://docs.excalibur.fm/docs/Whitepaper">
            <a className="text-sm md:text-base" target="_blank">
              Whitepaper
            </a>
          </Link>
          <Link passHref href="https://docs.excalibur.fm/docs/Litepaper">
            <a className="text-sm md:text-base" target="_blank">
              Litepaper
            </a>
          </Link>
          {/* <p>Roadmap</p> */}
        </div>
      </div>
      <div className="mx-auto mt-12 text-sm ">ExcaliburFM, all rights reserved. 2022 </div>
    </div>
  );
}

export default Footer;
