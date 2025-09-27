"use client";

import React from "react";
import ContactForm from "../_molecules/contactForm";

const ContactFormWrapper = ({ kvkkLink, className }) => {
  const handleFormSubmit = (formData) => {
    // Do API call here (fetch or axios)
  };

  return (
    <ContactForm
      onSubmit={handleFormSubmit}
      kvkkLink={kvkkLink}
      className={className}
    />
  );
};

export default ContactFormWrapper;
