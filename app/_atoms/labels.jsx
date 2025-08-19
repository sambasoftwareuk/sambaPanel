import React from "react";
import Icon from "./Icon";

export const LabelPrimary = ({ children, icon, className = "" }) => {
  return (
    <div
      className={`flex items-center text-sm w-fit rounded-md px-2 py-0.5  bg-primary text-white ${className} `}
    >
      {icon ? <Icon variant={icon} size="16" className="mr-1" /> : ""}
      {children}
    </div>
  );
};

export const LabelSecondary = ({ children, className = "" }) => {
  return (
    <div
      className={`text-sm w-fit rounded-md px-2 py-0.5  bg-secondary text-white ${className}`}
    >
      {children}
    </div>
  );
};

export const LabelTertiary = ({ children, icon, className = "" }) => {
  return (
    <div
      className={`flex items-center text-sm w-fit rounded-md px-2 py-0.5  bg-white text-gray-500 border border-1  ${className}`}
    >
      {icon ? (
        <Icon
          variant={icon}
          size="16"
          color="text-amber-500"
          className="mr-1 text-amber-500 fill-amber-500"
        />
      ) : (
        ""
      )}
      {children}
    </div>
  );
};
