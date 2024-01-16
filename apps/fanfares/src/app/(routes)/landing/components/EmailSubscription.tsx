// import ButtonDefault from "@/components/Button"
import Script from "next/script"
import Button from "./Button"
// import AnimatedMenuButton from "@/components/AnimatedButton"

function EmailSubscription() {
  return (
    <div className="mx-auto mt-20 flex h-fit w-full max-w-xs flex-col gap-y-8 rounded-lg border border-gray-50/10 bg-white/[2%] p-4 px-8 py-8 text-center drop-shadow-2xl filter backdrop-blur-md md:w-full md:max-w-xl">
      <p className="font-semibold md:text-2xl">Stay up-to-date!</p>
      <div className="w-full ">
        <form
          method="post"
          action="https://sendfox.com/form/19w6yv/1y4v7e"
          className="sendfox-form flex w-full flex-col items-center gap-4 md:flex-row"
          id="1y4v7e"
          data-async="true"
          data-recaptcha="false">
          <input
            className="border-gray-50/10placeholder:text-center h-10 w-full rounded-md border bg-transparent text-center text-white placeholder:text-zinc-400 focus:outline-buttonAccentHover active:outline-none"
            type="email"
            id="sendfox_form_email"
            placeholder="example@example.com"
            name="email"
            required
          />

          <div className="text-sm font-medium bg-white hover:text-white rounded-full text-black">
            {/* <AnimatedMenuButton label="Submit" /> */}
          </div>
        </form>
        <Script src="https://sendfox.com/js/form.js"></Script>
      </div>
    </div>
  )
}

export default EmailSubscription
