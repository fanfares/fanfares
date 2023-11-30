import { Heading } from '@components/Heading';

function ContactUs() {
  return (
    <div className="relative z-20 flex w-full flex-col items-start justify-center px-6 pb-32 sm:px-0">
      <Heading
        id="e2e-whitepaper-heading"
        className="mt-4 text-xl font-bold leading-10 text-white md:text-2xl xl:text-3xl"
      >
        Contact Us{' '}
      </Heading>
      <section className="mt-4">
        <p className="mt-4">
          If you need any help, want to give any feedback, or want to upload your first audio, please reach out to us
          at:
        </p>
        <a className="underline" href="mailto:support@excalibur.fm">
          support@excalibur.fm
        </a>
      </section>
    </div>
  );
}

export default ContactUs;
