import SectionTitle from './SectionTitle';

const Cards = [
  {
    id: 1,
    title: 'No Code & Easy Setup',
    description: 'Upload your first podcast in 5min.',
    image: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-code-off"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="green"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M7 8l-4 4l4 4"></path>
        <path d="M17 8l4 4l-2.5 2.5"></path>
        <path d="M14 4l-1.201 4.805m-.802 3.207l-2 7.988"></path>
        <path d="M3 3l18 18"></path>
      </svg>
    )
  },
  {
    id: 2,
    title: 'You own it!',
    description: ' $1 for your first upload, then 50 cents each subsequent upload.',
    image: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-thumb-up"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="red"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3"></path>
      </svg>
    )
  },
  {
    id: 3,
    title: 'Keep your Money',
    description: 'You receive 95% of all donations/mints.',
    image: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-businessplan"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="cyan"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M16 6m-5 0a5 3 0 1 0 10 0a5 3 0 1 0 -10 0"></path>
        <path d="M11 6v4c0 1.657 2.239 3 5 3s5 -1.343 5 -3v-4"></path>
        <path d="M11 10v4c0 1.657 2.239 3 5 3s5 -1.343 5 -3v-4"></path>
        <path d="M11 14v4c0 1.657 2.239 3 5 3s5 -1.343 5 -3v-4"></path>
        <path d="M7 9h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5"></path>
        <path d="M5 15v1m0 -8v1"></path>
      </svg>
    )
  },
  {
    id: 4,
    title: 'Leave a Legacy',
    description: 'Since we use Arweave, your media will live on a decentralised storage platform.',
    image: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-cloud-data-connection"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="lightBlue"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M5 9.897c0 -1.714 1.46 -3.104 3.26 -3.104c.275 -1.22 1.255 -2.215 2.572 -2.611c1.317 -.397 2.77 -.134 3.811 .69c1.042 .822 1.514 2.08 1.239 3.3h.693a2.42 2.42 0 0 1 2.425 2.414a2.42 2.42 0 0 1 -2.425 2.414h-8.315c-1.8 0 -3.26 -1.39 -3.26 -3.103z"></path>
        <path d="M12 13v3"></path>
        <path d="M12 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
        <path d="M14 18h7"></path>
        <path d="M3 18h7"></path>
      </svg>
    )
  },
  {
    id: 5,
    title: 'Energy Efficient',
    description: 'Minting an NFT on solana takes the same amount of energy as 10 google searches.',
    image: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-bolt"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="Yellow"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M13 3l0 7l6 0l-8 11l0 -7l-6 0l8 -11"></path>
      </svg>
    )
  },
  {
    id: 6,
    title: 'Meeting Minutes',
    description: "Store your organization's meeting minutes.",
    image: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-notes"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="lightgreen"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M5 3m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z"></path>
        <path d="M9 7l6 0"></path>
        <path d="M9 11l6 0"></path>
        <path d="M9 15l4 0"></path>
      </svg>
    )
  },
  {
    id: 7,
    title: 'Collaborative Audio',
    description: 'Make an episode and let your holder’s vote on what comes next.',
    image: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-affiliate"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="darkgreen"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M5.931 6.936l1.275 4.249m5.607 5.609l4.251 1.275"></path>
        <path d="M11.683 12.317l5.759 -5.759"></path>
        <path d="M5.5 5.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0"></path>
        <path d="M18.5 5.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0"></path>
        <path d="M18.5 18.5m-1.5 0a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0"></path>
        <path d="M8.5 15.5m-4.5 0a4.5 4.5 0 1 0 9 0a4.5 4.5 0 1 0 -9 0"></path>
      </svg>
    )
  },
  {
    id: 8,
    title: 'Create-A-DAO',
    description: 'Yeah, that is right, every upload is technically a DAO.',
    image: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-users"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="pink"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
        <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"></path>
      </svg>
    )
  },
  {
    id: 9,
    title: 'Voice Notes/Ideas',
    description: 'Want to ensure any audio ideas don’t get lost? Take a few minutes to upload them to Excaliur.',
    image: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-tabler icon-tabler-record-mail"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="magenta"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M7 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
        <path d="M17 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"></path>
        <path d="M7 15l10 0"></path>
      </svg>
    )
  }
];

function CardsSection() {
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const cards = Array.from(document.getElementsByClassName('card')) as HTMLElement[];
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }
  };

  return (
    <div className="mx-auto cursor-default ">
      <SectionTitle title="Why Excalibur ?" className="mb-8 mt-20" />
      <div id="cards" onMouseMove={handleMouseMove} className="mx-auto">
        {Cards.map((card, index) => {
          return (
            <div className="card h-fit min-h-[190px] w-80 rounded-lg text-center md:w-64">
              <div key={index} className="card-content">
                <div className="card-image mx-auto mt-8 flex items-center justify-center">{card.image}</div>
                <div className="card-inf-title mt-4">
                  <h3 className="font-bold uppercase">{card.title}</h3>
                  <h4 className="mt-4 text-sm font-thin md:text-base">{card.description}</h4>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CardsSection;
