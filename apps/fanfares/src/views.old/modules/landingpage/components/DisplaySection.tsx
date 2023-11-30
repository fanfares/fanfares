import { FAProSolid, FontAwesomeIcon } from '@excalibur/config/fontawesome';
import React, { Suspense, useEffect, useState } from 'react';
const LazyIframe = React.lazy(() => import('./LazyIframe'));

const displayIcons = [
  { icon: FAProSolid.faPodcast, text: 'Podcasts & Audiobook' },
  { icon: FAProSolid.faMoneyBillTransfer, text: 'Royalties distribution' },
  { icon: FAProSolid.faCommentsDollar, text: 'Crowdfunding' },
  { icon: FAProSolid.faPeople, text: 'DAO Creation' }
];

const DisplaySection = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const iconElements = displayIcons.map(({ icon, text }) => (
    <div className="w-20 flex-col text-center" key={text}>
      <FontAwesomeIcon className="text-4xl" icon={icon} />
      <p className="mt-2 text-xs">{text}</p>
    </div>
  ));

  return (
    <div className="mt-12 py-12">
      <div className="mx-auto flex w-full max-w-xl flex-col items-center justify-center">
        {isMounted && (
          <Suspense
            fallback={
              <div className="mt-4 flex h-80 w-[300px] items-center justify-center md:w-[800px]">
                <FontAwesomeIcon className="animate-spin text-4xl" icon={FAProSolid.faSpinnerThird} />
              </div>
            }>
            <LazyIframe src="https://www.youtube.com/embed/aWPJbuhwOxc?rel=0" title="Excalibur Explainer Video" />
          </Suspense>
        )}
      </div>

      <div className="mx-auto mt-16 flex w-56 flex-wrap items-start justify-center justify-items-center gap-16 md:w-full md:gap-16 ">
        {iconElements}
      </div>
    </div>
  );
};

export default DisplaySection;
