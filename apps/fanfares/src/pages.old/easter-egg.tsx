import Image from 'next/image';
import { contentfulLoader } from 'src/controllers/utils/image-loader';
import PageWrapper from 'src/views/components/PageWrapper';

const PAGE_TITLE = 'Excalibur - Easter Egg';
const PAGE_DESCRIPTION = 'This is a secret page that you found! Congrats!';

const EasterEgg = () => {
  // Has anyone found this yet?
  return (
    <PageWrapper noIndex pageTitle={PAGE_TITLE} pageDescription={PAGE_DESCRIPTION}>
      <div className="flex h-screen w-full items-center justify-center">
        <Image
          loader={contentfulLoader}
          width={320}
          layout={'fill'}
          alt="Devs hard at work"
          src="https://shdw-drive.genesysgo.net/Hodp413SWuWtfzuYZd247GaAGBmMbALD4cAMTDf45hc2/team-photo-2.png"
        ></Image>
      </div>
    </PageWrapper>
  );
};

export default EasterEgg;
