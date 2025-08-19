"use client";
import { useEffect, useState } from "react";
import { TabButton } from "../_atoms/buttons";
import Icon from "../_atoms/Icon";
import { DownArrowIcon, UpArrowIcon } from "../_atoms/Icons";

const TabMenu = ({
  tabs,
  orientation = "horizontal",
  onTabChange,
  responsiveVerticalBreakpoint = 0,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isResponsiveVertical, setIsResponsiveVertical] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (responsiveVerticalBreakpoint > 0) {
        setIsResponsiveVertical(window.innerWidth <= responsiveVerticalBreakpoint);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [responsiveVerticalBreakpoint]);

  const isVertical = orientation === "vertical" || isResponsiveVertical;

  const handleTabClick = (index) => {
    setActiveIndex(index);
    if (onTabChange) {
      onTabChange(tabs[index]);
    }
  };

  if (!tabs || tabs.length === 0) {
    return <div className="text-gray-500 text-sm text-center">No tabs available</div>;
  }

  return (
    <div className="w-full">
      {isVertical ? (
        <div className="flex flex-col gap-2">
          {tabs.map((tab, index) => (
            <div key={index}>
              <button
                className={`flex justify-between items-center px-4 py-3 w-full border-b rounded-md transition-colors duration-300 ${
                  index === activeIndex ? "bg-gray-100" : "bg-white"
                }`}
                onClick={() => handleTabClick(index)}
              >
                <span className="text-sm font-medium">{tab.title}</span>
                <Icon
                  variant={index === activeIndex ? UpArrowIcon : DownArrowIcon}
                  size={24}
                />
              </button>

              {index === activeIndex && tab.content && (
                <div className="px-4 py-3">
                  {tab.content}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2 justify-center mb-4">
          {tabs.map((tab, index) => (
            <TabButton
              key={index}
              label={tab.title}
              onClick={() => handleTabClick(index)}
              className={`px-4 py-2 text-sm border-b-2 transition-colors duration-300 ${
                activeIndex === index
                  ? "border-primary text-black font-bold bg-gray-100"
                  : "border-transparent text-gray-500"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TabMenu;
