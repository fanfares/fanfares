import Script from 'next/script';
import { getConfig } from 'src/controllers/utils';

export enum GoogleActionType {
  mintNft = 'mint_nft',
  createUserAccount = 'create_user_account',
  connectWallet = 'connect_wallet',
  createMedia = 'create_media',
  donate = 'donate'
}
export interface GoogleAction {
  action: GoogleActionType;
  params?: {
    user_wallet?: string;
    media_key?: string;
    sol_price?: string;
  };
}

// log the pageview with their URL
export function reportGooglePageview(url: string) {
  const { googleAnalytics, devMode } = getConfig();
  if (devMode) return null;

  /* eslint-disable-next-line */
  (window as any).gtag('config', googleAnalytics, {
    page_path: url
  });
}

// log specific events happening.
export function reportGoogleEvent(event: GoogleAction) {
  const { devMode } = getConfig();
  if (devMode) return null;

  /* eslint-disable-next-line */
  (window as any).gtag('event', event.action, event.params);
}

export function GoogleAnalytics() {
  const { googleAnalytics, devMode } = getConfig();

  if (devMode) return null;

  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalytics}`} />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${googleAnalytics}', {
            page_path: window.location.pathname,
            });
        `
        }}
      />
    </>
  );
}
