"use client";

import React from "react";
import ContactForm from "../_molecules/ContactForm";

const ContactFormWrapper = ({ kvkkLink, className }) => {
  const handleFormSubmit = async (formData) => {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || "Mesaj gönderilemedi. Lütfen daha sonra tekrar deneyiniz.");
    }
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
