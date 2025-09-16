import React from "react";

export const Header1 = ({ children, className = "" }) => {
  return (
    <h1 className={`text-3xl font-bold text-primary ${className}`}>
      {children}
    </h1>
  );
};

export const Header2 = ({ children, className = "" }) => {
  return (
    <h2 className={`text-2xl font-bold text-primary ${className}`}>
      {children}
    </h2>
  );
};

export const Header3 = ({ children, className = "" }) => {
  return (
    <h3 className={`text-xl font-bold text-primary ${className}`}>
      {children}
    </h3>
  );
};
