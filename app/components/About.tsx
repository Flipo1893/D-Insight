import PlaceholderImage from "./PlaceholderImage";
import Reveal from "./Reveal";

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
    <div className="grid gap-10 md:grid-cols-2">
      {team.map((person, index) => (
        <Reveal key={person.name} delay={index * 120}>
          <PlaceholderImage
            label={`Foto: ${person.name}`}
            hint="wird nachgeliefert"
          />
          <h3 className="mt-4 text-xl font-semibold">{person.name}</h3>
          <p className="text-sm text-muted">{person.role}</p>
          <p className="mt-3 max-w-md text-muted">{person.bio}</p>
        </Reveal>
      ))}
    </div>
  );
}
