import PlaceholderImage from "./PlaceholderImage";

const team = [
  {
    name: "Dominic Felder",
    role: "Web Developer",
    bio: "Verantwortlich für Technik und Performance — von der Code-Architektur bis zur Ladezeit-Optimierung jeder Seite.",
  },
  {
    name: "Beg Sherifi",
    role: "Web Developer",
    bio: "Verantwortlich für Konzept und Umsetzung — von der visuellen Neugestaltung bis zur technischen SEO-Struktur.",
  },
];

export default function About() {
  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">
          Über uns
        </p>
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          {team.map((person) => (
            <div key={person.name}>
              <PlaceholderImage
                label={`Foto: ${person.name}`}
                hint="wird nachgeliefert"
              />
              <h3 className="mt-4 text-xl font-semibold">{person.name}</h3>
              <p className="text-sm text-muted">{person.role}</p>
              <p className="mt-3 max-w-md text-muted">{person.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
