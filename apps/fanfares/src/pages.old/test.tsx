import PageWrapper from 'src/views/components/PageWrapper';

import type { NextPage } from 'next';
import { useState } from 'react';
import {
  queryMediaMetadataByTimestamp,
  tickFirebaseCreatorUnsafe,
  tickFirebaseMediaUnsafe
} from 'src/controllers/firebase/firebase-functions';
import { useAppState } from 'src/controllers/state/use-app-state';

const PAGE_TITLE = 'Excalibur - Test Page';
const PAGE_DESCRIPTION = `Beep Boop, nothing to see here`;

const TestPage: NextPage = () => {
  const { connection, drmApi } = useAppState();
  const [data, setData] = useState([]);

  const onPress = async () => {
    setData(await queryMediaMetadataByTimestamp(new Date(0)));
  };

  const all = async () => {
    const accounts = await connection.getProgramAccounts(drmApi.program.program.programId, {
      dataSlice: { offset: 0, length: 0 }
    });

    accounts.forEach(account => {
      tickFirebaseMediaUnsafe(account.pubkey).then(() => {
        console.log('+1 Media');
      });
      tickFirebaseCreatorUnsafe(account.pubkey).then(() => {
        console.log('+1 Creator');
      });
    });
  };

  const renderData = () => {
    return data.map(media => {
      if (media.id) {
        return <p key={media.id}>{media.id}</p>;
      }
      return null;
    });
  };

  return (

    <PageWrapper pageTitle={PAGE_TITLE} pageDescription={PAGE_DESCRIPTION}>
      <button className="btn" onClick={onPress}>
        Fetch
      </button>
      <button className="btn" onClick={all}>
        All
      </button>
      <p>{data.length}</p>
      {renderData()}
    </PageWrapper>
  );
};

export default TestPage;
