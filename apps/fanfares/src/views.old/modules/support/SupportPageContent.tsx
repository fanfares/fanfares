import Link from 'next/link';
import ContactForm from './ContactForm';

function SupportPageContent() {
  return (
    <div className="items-start justify-center h-full pb-4 mx-auto mb-12 overflow-y-auto text-left md:mx-0 md:w-11/12 md:pb-0">
      <h1 className="mt-12 text-xl font-black text-gray-100 uppercase font-font1 md:mt-4 md:text-4xl">
        Excalibur Support
      </h1>
      <div className="flex gap-x-2">
        <Link passHref href="https://docs.excalibur.fm/docs/Terms">
          <a className="p-2 mt-8 uppercase btn" target="_blank">
            Terms & Conditions
          </a>
        </Link>
        <Link passHref href="https://docs.excalibur.fm/docs/Litepaper">
          <a className="p-2 mt-8 uppercase btn" target="_blank">
            Litepaper
          </a>
        </Link>
        <Link passHref href="https://docs.excalibur.fm/docs/Whitepaper">
          <a className="p-2 mt-8 uppercase btn" target="_blank">
            Whitepaper
          </a>
        </Link>
      </div>
      {/* <ContactUs /> */}
      <ContactForm />
    </div>
  );
}

export default SupportPageContent;
