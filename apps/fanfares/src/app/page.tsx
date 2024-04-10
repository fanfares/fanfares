import { redirect } from "next/navigation"

export default function Home() {
  // ------------------- STATES -------------------------

  // ------------------- FUNCTIONS -------------------------

  // ------------------- RENDERERS -------------------------

  // ------------------- MAIN -------------------------

  // redirect('/discover');

  //TODO make this the Discover page
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 ">Welcome to FanFares</h1>
      <p className="text-lg mb-6">
        A premier Nostr client optimized for podcast monetization and curation.
      </p>
      <div className=" shadow-lg p-6 mb-6">
        <p className="text-lg ">
          Bitcoin Lightning is the breakthrough micropayment technology many
          have eagerly awaited for decades, and now it's finally here. At
          FanFares, we're harnessing this technology to liberate creators and
          their audiences from the influence of advertisers.
        </p>
        <p className="text-lg  mt-4">
          The internet has long been a catalyst for disintermediation of systems
          where middlemen have control and siphon off the majority of the value
          created. With Bitcoin Lightning and Nostr, we're taking another stride
          towards empowering peer-to-peer communication and the exchange of
          value.
        </p>
      </div>
      <div className=" shadow-lg p-6 mb-6">
        <p className="text-lg ">
          We understand human nature, and it is a true fact that most people are
          basically lazy. We all tend to take the most convenient route wherever
          possible. While we all believe in compensating creators for their
          efforts, in a world accustomed to free access, many simply don't pay
          unless prompted.
        </p>
        <p className="text-lg  mt-4">
          On FanFares, the creators of a podcast can set a fee for accessing a
          podcast. Listeners get to enjoy every episode without being
          interrupted with ads. They get back those few minutes of their lives,
          which is worth the value of the sats to most of us because our time is
          even more scarce than bitcoin!
        </p>
      </div>
    </div>
  )
}
/* <h1><{NIP_108_KINDS.gate}></h1> */
