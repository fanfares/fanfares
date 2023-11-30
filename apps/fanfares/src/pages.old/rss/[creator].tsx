import { PublicKey } from '@solana/web3.js';
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore';
import { CREATOR_COLLECTION, MEDIA_COLLECTION, firestore } from 'src/controllers/firebase/firebase';
import { generateCreatorRSSFeedFromFirebase } from 'src/controllers/rss/generate-rss-feed';

const XmlRssPage = () => <div />;

export async function getServerSideProps(context) {
  let creatorKeyString = (context.params?.creator ?? 'demo') as string;

  if (creatorKeyString == 'demo') {
    creatorKeyString = process.env.NEXT_PUBLIC_DEFAULT_CREATOR;
  }

  // Set the content type to 'application/xml' in the response header
  context.res.setHeader('Content-Type', 'application/xml');
  let xmlContent = null;

  try {
    const ownerKey = new PublicKey(creatorKeyString);

    // Get Creator
    const creatorCollection = collection(firestore, CREATOR_COLLECTION);
    const docRefrence = doc(firestore, `${creatorCollection.path}/${ownerKey}`);
    const document = await getDoc(docRefrence);
    const creatorData = document.data();

    // Get Episodes
    const mediaCollection = collection(firestore, MEDIA_COLLECTION);
    const creatorQuery = query(
      mediaCollection,
      where('owner_key', '==', ownerKey.toString()),
      orderBy('creation_date_unix', 'desc')
    );

    const querySnapshot = await getDocs(creatorQuery);
    const episodeData = [];

    querySnapshot.forEach(doc => {
      episodeData.push(doc.data());
    });

    xmlContent = generateCreatorRSSFeedFromFirebase(creatorData, episodeData);
  } catch (e) {
    xmlContent = `<?xml version="1.0" encoding="UTF-8"?><error><message>Error Fetching RSS Feed for Creator Key ${creatorKeyString}: ${e}</message></error>`;
  }

  // Send the XML content as the response
  context.res.write(xmlContent);
  context.res.end();

  // Return an empty object as props
  return { props: {} };
}

export default XmlRssPage;
