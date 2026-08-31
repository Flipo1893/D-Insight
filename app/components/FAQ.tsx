"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Wie lange dauert ein Refactoring-Projekt?",
    answer:
      "Je nach Umfang zwischen zwei und sechs Wochen. Nach der Analyse erhalten Sie einen konkreten Zeitplan.",
  },
  {
    question: "Muss die Website währenddessen offline sein?",
    answer:
      "Nein. Wir arbeiten in einer separaten Umgebung und stellen erst live, wenn alles geprüft ist.",
  },
  {
    question: "Was bedeutet „KI-SEO“ konkret?",
    answer:
      "Inhalte und Struktur werden so aufbereitet, dass sie sowohl von klassischen Suchmaschinen als auch von KI-Suchassistenten gut verstanden und zitiert werden.",
  },
  {
    question: "Was kostet ein Refactoring?",
    answer:
      "Das hängt vom Umfang Ihrer Website ab. Nach der Analyse erhalten Sie ein individuelles, unverbindliches Angebot.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">
          FAQ
        </p>
        <div className="mt-8 divide-y divide-border border-t border-border">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 py-6 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg font-medium">{faq.question}</span>
                  <span
                    className={`shrink-0 text-2xl leading-none text-accent transition-transform ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <p className="max-w-2xl pb-6 text-muted">{faq.answer}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
