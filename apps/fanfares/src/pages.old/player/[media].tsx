import PageWrapper from '@components/PageWrapper';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { NextPage } from 'next';
import { MEDIA_COLLECTION, firestore } from 'src/controllers/firebase/firebase';
import { PageWrapperProps } from 'src/views/components/PageWrapper';
import PlayerPageContent from 'src/views/modules/player/PlayerPageContent';

interface PlayerPageProps extends Omit<PageWrapperProps, 'children'> {
  mediaKeyString: string;
}

const PlayerPage: NextPage = (props: PlayerPageProps) => {
  // const router = useRouter();
  // const mediaKeyString = router.query.media as string;
  // const { pageTitle, pageDescription, pagePhotoUrl } = props;
  const { pageTitle, pageDescription, pagePhotoUrl, mediaKeyString, pageAuthor, pagePublishDateUnix } = props;

  return (
    <PageWrapper
      pageTitle={pageTitle}
      pageDescription={pageDescription}
      pagePhotoUrl={pagePhotoUrl}
      pageAuthor={pageAuthor}
      pagePublishDateUnix={pagePublishDateUnix}
    >
      <PlayerPageContent mediaKeyString={mediaKeyString} />
    </PageWrapper>
  );
};

export async function getStaticProps({ params }) {
  let mediaKeyString = (params?.media ?? 'demo') as string;

  if (mediaKeyString == 'demo') {
    mediaKeyString = process.env.NEXT_PUBLIC_DEFAULT_MEDIA;
  }

  try {
    const mediaCollection = collection(firestore, MEDIA_COLLECTION);
    const docRefrence = doc(firestore, `${mediaCollection.path}/${mediaKeyString}`);
    const document = await getDoc(docRefrence);
    const data = document.data();

    return {
      props: {
        mediaKeyString,
        pageTitle: data.name,
        pageDescription: data.description,
        pagePhotoUrl: data.image,
        pageAuthor: data.owner_key,
        pagePublishDateUnix: data.creation_date_unix
      } as PlayerPageProps,
      revalidate: 5 * 60 * 1000
    };
  } catch (e) {
    return {
      props: {
        mediaKeyString,
        revalidate: 5 * 60 * 1000
      } as PlayerPageProps
    };
  }
}

export async function getStaticPaths() {
  try {
    const mediaCollection = collection(firestore, MEDIA_COLLECTION);
    const snapshot = await getDocs(mediaCollection);
    const paths = snapshot.docs.map(doc => {
      return {
        params: {
          media: doc.id
        }
      };
    });

    return {
      paths,
      fallback: 'blocking'
    };
  } catch (e) {
    return {
      paths: [],
      fallback: 'blocking'
    };
  }
}

export default PlayerPage;
