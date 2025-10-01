import React from "react";
import learnItems from "../constants/learnCard";

export const LearnCard = () => {
  const { leftItems, rightItems } = learnItems;
  return (
    <div className="border p-6 rounded-md max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-secondary">
        What you"ll learn
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 text-gray-800">
        {leftItems.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <span>✓</span>
            <p>{item}</p>
          </div>
        ))}
        {rightItems.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <span>✓</span>
            <p>{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
