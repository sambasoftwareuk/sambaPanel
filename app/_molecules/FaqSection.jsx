"use client";
import { useState } from "react";
import faqs from "../mocks/faqSection";
import { AccordionSection } from "./AccordionSection";
import { ShowMoreButton } from "../_atoms/Buttons";

export const FAQSection = () => {
  const [showAll, setShowAll] = useState(false);
  const visibleCount = 3;

  const visibleFaqs = showAll ? faqs : faqs.slice(0, visibleCount);
  const hiddenCount = faqs.length - visibleCount;

  return (
    <section className="max-w-2xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Frequently asked questions
      </h2>

      <div className="space-y-0 border rounded-2xl shadow-lg bg-white p-7">
        {visibleFaqs.map((faq, index) => (
          <div
            key={index}
            className="border-t border-b border-gray-200 px-4 py-3"
          >
            <AccordionSection
              title={faq.title}
              links={faq.answer}
              linkColor="black"
            />
          </div>
        ))}

        <div className="text-center border-t border-gray-200">
          {hiddenCount > 0 && (
            <ShowMoreButton
              showAll={showAll}
              hiddenCount={hiddenCount}
              onClick={() => setShowAll(!showAll)}
            />
          )}
        </div>
      </div>
    </section>
  );
};
