import type { NextPage } from 'next';
import PageWrapper from 'src/views/components/PageWrapper';
import DiscoverPageContent from 'src/views/modules/discover/DiscoverPageContent';

const PAGE_TITLE = 'Excalibur - Discover Page';
const PAGE_DESCRIPTION =
  'Discover the ultimate online experience for audio lovers, and explore a variety of genres of podcasts, and exclusive content for a truly web3 auditory journey!';

const DiscoverPage: NextPage = () => {
  return (
    <PageWrapper pageTitle={PAGE_TITLE} pageDescription={PAGE_DESCRIPTION}>
      <DiscoverPageContent />
    </PageWrapper>
  );
};

export default DiscoverPage;
