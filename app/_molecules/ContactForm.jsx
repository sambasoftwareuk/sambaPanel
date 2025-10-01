'use client';
import React, { useState } from 'react';
import { Header2 } from '../_atoms/Headers';
import { InputBasic } from '../_atoms/Inputs';
import { Checkbox } from '../_atoms/Checkbox';
import { PrimaryButton } from '../_atoms/Buttons';

const ContactForm = ({ 
  title = "Bize Ulaşın",
  kvkkLink = "#",
  onSubmit,
  className = "" 
}) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: '',
    kvkkAccepted: false
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Hata mesajını temizle
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    setFormData(prev => ({
      ...prev,
      kvkkAccepted: e.target.checked
    }));
    if (errors.kvkkAccepted) {
      setErrors(prev => ({
        ...prev,
        kvkkAccepted: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Ad alanı zorunludur';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Soyad alanı zorunludur';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-posta alanı zorunludur';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Mesaj alanı zorunludur';
    }

    if (!formData.kvkkAccepted) {
      newErrors.kvkkAccepted = 'KVKK ve Aydınlatma Metni\'ni kabul etmelisiniz';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (onSubmit) {
        onSubmit(formData);
      } else {
        alert('Mesajınız başarıyla gönderildi!');
        
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: '',
          kvkkAccepted: false
        });
      }
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <Header2 className="text-center mb-6 text-primary">{title}</Header2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <InputBasic
              type="text"
              name="firstName"
              placeholder="Adınız *"
              value={formData.firstName}
              onChange={handleInputChange}
              className={errors.firstName ? 'border-red-500' : ''}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          
          <div>
            <InputBasic
              type="text"
              name="lastName"
              placeholder="Soyadınız *"
              value={formData.lastName}
              onChange={handleInputChange}
              className={errors.lastName ? 'border-red-500' : ''}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <InputBasic
            type="email"
            name="email"
            placeholder="E-posta adresiniz *"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <InputBasic
            type="tel"
            name="phone"
            placeholder="Telefon numaranız"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <textarea
            name="message"
            placeholder="Mesajınız *"
            value={formData.message}
            onChange={handleInputChange}
            rows={5}
            className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none ${
              errors.message ? 'border-red-500' : ''
            }`}
          />
          {errors.message && (
            <p className="text-red-500 text-xs mt-1">{errors.message}</p>
          )}
        </div>

        <div>
          <Checkbox
            id="kvkk"
            label={
              <span>
                <a 
                  href={kvkkLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  KVKK ve Aydınlatma Metni
                </a>
                'ni okudum ve kabul ediyorum.
              </span>
            }
            checked={formData.kvkkAccepted}
            onChange={handleCheckboxChange}
          />
          {errors.kvkkAccepted && (
            <p className="text-red-500 text-xs mt-1">{errors.kvkkAccepted}</p>
          )}
        </div>

        <div className="text-center">
          <PrimaryButton
            type="submit"
            label="Gönder"
            className="px-8 py-3 text-base"
          />
        </div>
      </form>
    </div>
  );
};

export default ContactForm; 
