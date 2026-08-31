"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { faqs } from "../lib/content";

/**
 * Layout family: accordion. Answers are always in the DOM (collapsed via
 * grid-template-rows) so search engines and AI assistants read them even
 * when a panel is visually closed. The same array feeds the FAQPage JSON-LD
 * in page.tsx, so the two can never drift apart.
 */
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="border-t border-border bg-surface/30">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-20">
          <Reveal>
            <SectionHeading>Häufige Fragen.</SectionHeading>
          </Reveal>

          <Reveal index={1}>
            <div className="border-t border-border">
              {faqs.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={faq.question} className="border-b border-border">
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${index}`}
                        id={`faq-trigger-${index}`}
                        className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-accent-text-text"
                      >
                        <span className="text-base font-medium md:text-lg">
                          {faq.question}
                        </span>
                        <span
                          aria-hidden
                          className={`relative block h-3 w-3 shrink-0 text-accent-text transition-transform duration-300 ${
                            isOpen ? "rotate-90" : ""
                          }`}
                        >
                          <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-current" />
                          <span
                            className={`absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-current transition-opacity duration-300 ${
                              isOpen ? "opacity-0" : "opacity-100"
                            }`}
                          />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`faq-panel-${index}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${index}`}
                      className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-out ${
                        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="min-h-0">
                        <p className="max-w-2xl pb-6 leading-relaxed text-muted">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
