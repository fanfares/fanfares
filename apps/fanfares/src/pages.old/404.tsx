import Button from "@/views.old/components/Button"
import PageWrapper from "@/views.old/components/PageWrapper"
import Link from "next/link"

const PAGE_TITLE = "404 - Page Not Found"
const PAGE_DESCRIPTION = "The page you are looking for does not exist."

const Default404 = () => {
  return (
    <PageWrapper
      noIndex
      pageTitle={PAGE_TITLE}
      pageDescription={PAGE_DESCRIPTION}>
      <div className="flex flex-col items-center h-screen mx-auto text-center ">
        <div className="relative flex flex-col items-center w-full ">
          <h1
            className="text-center text-[150px] font-black opacity-20 md:text-[250px]
">
            404
          </h1>
          <div className="absolute flex flex-col items-center w-full mx-auto text-center top-20 md:top-36">
            <p className="text-xl font-black md:text-4xl">Page not found</p>
            <p className="text-sm font-thin w-80 md:text-base">
              Houston, we have a problem!
            </p>
            <p className="text-sm font-thin w-80 md:text-base">
              We can&apos;t find the page you&apos;re looking for!
            </p>
            <Link href="/">
              <Button
                className="mt-8 md:mt-16"
                buttonType="default"
                text="Go back home"
              />
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}

export default Default404
