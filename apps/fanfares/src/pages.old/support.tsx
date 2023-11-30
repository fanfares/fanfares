import PageWrapper from 'src/views/components/PageWrapper';

import type { NextPage } from 'next';
import SupportPageContent from 'src/views/modules/support/SupportPageContent';

const PAGE_TITLE = 'Excalibur - Support Page';
const PAGE_DESCRIPTION = 'Learn about how Excalibur works and contact the team if necessary!';

const SupportPage: NextPage = () => {
  return (
    <PageWrapper noIndex pageTitle={PAGE_TITLE} pageDescription={PAGE_DESCRIPTION}>
      <SupportPageContent />
    </PageWrapper>
  );
};

export default SupportPage;
