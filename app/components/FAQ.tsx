"use client";

import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { faqs } from "../lib/content";

/**
 * Layout family: accordion. Answers are always in the DOM (collapsed via
 * grid-template-rows) so search engines and AI assistants read them even
 * when a panel is visually closed. The same array feeds the FAQPage JSON-LD
 * in page.tsx, so the two can never drift apart.
 *
 * Each question has its own anchor, /#faq-kosten and so on. That makes a
 * single answer linkable from an email or an article, and gives search and
 * AI systems a target to point at instead of the whole page. Question-answer
 * pairs are the shape those systems quote most readily, so it is worth the
 * few extra lines.
 */
export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Open the panel someone arrived for, whether the hash was in the URL on
  // load or set by a click while already here.
  useEffect(() => {
    const openFromHash = () => {
      const slug = window.location.hash.replace("#faq-", "");
      if (!slug) return;
      const index = faqs.findIndex((faq) => faq.slug === slug);
      if (index !== -1) setOpenIndex(index);
    };

    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return (
    <section id="faq" className="border-t border-border bg-surface/30">
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
                  <div
                    key={faq.slug}
                    id={`faq-${faq.slug}`}
                    className="scroll-mt-28 border-b border-border"
                  >
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${faq.slug}`}
                        id={`faq-trigger-${faq.slug}`}
                        className="group flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-accent-text"
                      >
                        <span className="text-base font-medium md:text-lg">
                          {faq.question}
                        </span>
                        <span className="flex shrink-0 items-center gap-3">
                          {/* Copyable link to this one answer. Only shows on
                              hover and focus so the row stays quiet. */}
                          <span
                            aria-hidden
                            className="font-mono text-xs text-muted opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                          >
                            #
                          </span>
                          <span
                            aria-hidden
                            className={`relative block h-3 w-3 text-accent-text transition-transform duration-300 ${
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
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`faq-panel-${faq.slug}`}
                      role="region"
                      aria-labelledby={`faq-trigger-${faq.slug}`}
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
