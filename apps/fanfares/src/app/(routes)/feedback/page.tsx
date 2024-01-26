import ContactForm from "@/app/components/ContactForm"

export default function Page() {
  return (
    <section className="flex flex-col w-full">
      <h1 className="font-black text-center text-gray-100 text-xl/4 md:mt-4 md:text-start md:text-4xl">
        Earn Sats for Feedback
      </h1>
      <div className="items-start justify-center h-full pb-4 mx-auto mb-12 overflow-y-auto text-left md:mx-0 md:w-11/12 md:pb-0">
        <ContactForm feedback />
      </div>{" "}
    </section>
  )
}
