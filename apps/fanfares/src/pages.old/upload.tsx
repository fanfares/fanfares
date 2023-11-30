import { NextPage } from 'next';
import PageWrapper from 'src/views/components/PageWrapper';
import UploadPageContent from 'src/views/modules/upload/UploadPageContent';

const PAGE_TITLE = 'Excalibur Upload';
const PAGE_DESCRIPTION = 'Upload your audio to the Excalibur FM network.';

const Upload: NextPage = () => {
  return (
    <PageWrapper noIndex pageTitle={PAGE_TITLE} pageDescription={PAGE_DESCRIPTION}>
      <UploadPageContent />
    </PageWrapper>
  );
};

export default Upload;
