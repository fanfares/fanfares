import PageWrapper from '@components/PageWrapper';
import type { NextPage } from 'next';
import { WalletPageContent } from 'src/views/modules/wallet/WalletPageContent';

const WalletPage: NextPage = () => {
  // const router = useRouter();
  // const { publicKey } = useAppState();

  // useEffect(() => {
  //   if (!publicKey) {
  //     router.push(`/`);
  //   }
  // }, [publicKey, router]);

  return (
    // <PageWrapper>{publicKey ? <WalletPageContent /> : null}</PageWrapper>
    <PageWrapper>
      <WalletPageContent />
    </PageWrapper>

    // <div className="flex w-full">
    //   <Navbar />
    //   <div className="w-full h-screen min-h-screen px-1 mt-2 mb-40 overflow-y-scroll scroll-smooth md:mt-12 md:px-4">
    //     <div className="fixed h-full w-full rounded-2xl bg-skin-button-accent-hover/10 px-4 md:mt-0 md:max-w-[87.5%]">
    //       {publicKey ? <WalletPageContent /> : null}
    //     </div>
    //   </div>
    // </div>
  );
};

export default WalletPage;
