import { getDefaultMediaKey } from '@excalibur/drm';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import PageWrapper from 'src/views/components/PageWrapper';

const Player = () => {
  const router = useRouter();
  const mediaKey = getDefaultMediaKey();

  useEffect(() => {
    router.push(`/player/${mediaKey?.toString()}`).then();
  }, [router, mediaKey]);

  return (
    <PageWrapper noIndex>
      <div />
    </PageWrapper>
  );
};

export default Player;
