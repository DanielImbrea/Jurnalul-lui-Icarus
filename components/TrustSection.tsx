const points = [
  {
    title: "Cititorii lui Icarus",
    text: "Peste 200 de povești au ajuns deja în mâinile cititorilor — un univers care continuă dincolo de pagină."
  },
  {
    title: "Publicate oficial",
    text: "Sub Umbrele lui Blake — Sedcom Libris, 2024. Îmbrățișarea Durerii — 2023."
  },
  {
    title: "Comandă directă",
    text: "Fără intermediari. Cartea ajunge de la autor la tine, prin comandă simplă."
  },
  {
    title: "Plată securizată",
    text: "Procesare prin Stripe, cu criptare la nivel bancar și confirmare imediată."
  }
];

export default function TrustSection() {
  return (
    <section className="relative border-y border-bone/10 py-24">
      <div className="container-editorial">
        <h2 className="max-w-md font-serif text-3xl leading-tight text-bone sm:text-4xl">
          De ce direct de aici?
        </h2>

        <div className="mt-14 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {points.map((point) => (
            <div key={point.title} className="border-t border-bone/15 pt-5">
              <p className="font-serif text-xl text-bone">{point.title}</p>
              <p className="mt-3 font-sans text-sm leading-relaxed text-ash">{point.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
