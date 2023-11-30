import Head from "next/head"
import { useRouter } from "next/navigation"
import { ReactNode } from "react"
import { Navbar } from "./Navbar"
import Footer from "./Footer"
// import { unixToPublishDate } from 'src/controllers/utils/time-helpers';

export const DEFAULT_PAGE_TITLE = "Excalibur FM"
export const DEFAULT_PAGE_DESCRIPTION = "Unleash your story with Excalibur FM."

export interface PageWrapperProps {
  children: ReactNode
  pageTitle?: string
  pageDescription?: string
  pagePhotoUrl?: string
  pageAuthor?: string
  pagePublishDateUnix?: number
  noIndex?: boolean
}

const PageWrapper = (props: PageWrapperProps) => {
  const {
    children,
    pageTitle,
    pageDescription,
    pagePhotoUrl,
    pageAuthor,
    noIndex,
    pagePublishDateUnix,
  } = props
  const config = getConfig()
  const router = useRouter()
  const title = pageTitle ?? DEFAULT_PAGE_TITLE
  const author = pageAuthor
  const publishDate = pagePublishDateUnix
  const description = pageDescription ?? DEFAULT_PAGE_DESCRIPTION
  const photoUrl = pagePhotoUrl ?? config.defaultMediaThumbnailUrl
  const url = "https://excalibur.fm" + router.asPath

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        {noIndex ? <meta name="robots" content="noindex" /> : null}
        <meta key="description" name="description" content={description} />
        <link rel="canonical" href={url} />
        {author ? <meta name="author" content={author} /> : null}
        {publishDate ? (
          <meta
            name="publish_date"
            property="og:publish_date"
            content={unixToPublishDate(publishDate)}
          />
        ) : null}
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:site_name" content="Excalibur FM" />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={photoUrl} />
        <meta
          property="og:image:alt"
          content={config.defaultMediaThumbnailUrl}
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@ExcaliburDao" />
        <meta name="twitter:creator" content="@ExcaliburDao" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={photoUrl} />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <div className="flex w-full App">
        <Navbar />
        <div className="w-full min-h-screen px-2 mx-auto overflow-y-auto bg-skin-button-accent-hover/10 md:mx-4 md:ml-52 md:mt-5 md:rounded-3xl md:px-4 md:pt-8">
          <div className="w-full h-full pt-8 pb-20 mx-auto overflow-y-scroll max-w-7xl md:mb-0 md:pt-0 ">
            {children}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default PageWrapper
