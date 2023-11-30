import { PublicKey } from '@solana/web3.js';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import type { NextPage } from 'next';
import { CREATOR_COLLECTION, firestore } from 'src/controllers/firebase/firebase';
import PageWrapper, { PageWrapperProps } from 'src/views/components/PageWrapper';
import CreatorChannelPageContent from 'src/views/modules/creator-channel/CreatorChannelPageContent';

interface CreatorPageProps extends Omit<PageWrapperProps, 'children'> {
  creatorKeyString: string;
}

const CreatorPage: NextPage = (props: CreatorPageProps) => {
  // const router = useRouter();
  // const creatorKeyString = router.query.creator as string;
  // const { pageTitle, pageDescription, pagePhotoUrl } = props;
  const { pageTitle, pageDescription, pagePhotoUrl, creatorKeyString, pageAuthor, pagePublishDateUnix } = props;

  return (
    <PageWrapper
      noIndex
      pageTitle={pageTitle}
      pageDescription={pageDescription}
      pagePhotoUrl={pagePhotoUrl}
      pageAuthor={pageAuthor}
      pagePublishDateUnix={pagePublishDateUnix}
    >
      <CreatorChannelPageContent creatorKeyString={creatorKeyString} />
    </PageWrapper>
  );
};

export async function getStaticProps({ params }) {
  let creatorKeyString = (params?.creator ?? 'demo') as string;

  if (creatorKeyString == 'demo') {
    creatorKeyString = process.env.NEXT_PUBLIC_DEFAULT_CREATOR;
  }

  try {
    const ownerKey = new PublicKey(creatorKeyString);

    const creatorCollection = collection(firestore, CREATOR_COLLECTION);
    const docRefrence = doc(firestore, `${creatorCollection.path}/${ownerKey}`);
    const document = await getDoc(docRefrence);
    const data = document.data();

    return {
      props: {
        creatorKeyString,
        pageTitle: data.name,
        pageDescription: data.description,
        pagePhotoUrl: data.image,
        pageAuthor: data.owner_key,
        pagePublishDateUnix: data.creation_date_unix
      } as CreatorPageProps,
      revalidate: 5 * 60 * 1000
    };
  } catch (e) {
    return {
      props: {
        creatorKeyString
      } as CreatorPageProps,
      revalidate: 5 * 60 * 1000
    };
  }
}

export async function getStaticPaths() {
  try {
    const creatorCollection = collection(firestore, CREATOR_COLLECTION);
    const snapshot = await getDocs(creatorCollection);
    const paths = snapshot.docs.map(doc => {
      return {
        params: {
          creator: doc.id
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

export default CreatorPage;
