import React from 'react';
import { Header3 } from '../_atoms/Headers';
import { Phone, WhatsAppIcon, LocationOn, Email } from '../_atoms/Icons';

const ContactCard = ({ 
  title, 
  address, 
  phones = [], 
  emails = [], 
  mapUrl, 
  rightImage,
  children,
  className = "" 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sol taraf - İletişim bilgileri */}
        <div className="flex-1">
          <Header3 className="mb-4 text-primary">{title}</Header3>
          
          {/* Adres */}
          {address && (
            <div className="mb-4">
              <div className="flex items-start gap-3">
                <LocationOn 
                  className="text-primary mt-1 flex-shrink-0" 
                  style={{ width: 20, height: 20 }}
                />
                <p className="text-gray-700 text-sm leading-relaxed">{address}</p>
              </div>
            </div>
          )}
          
          {/* Telefonlar */}
          {phones.length > 0 && (
            <div className="mb-4">
              {phones.map((phone, index) => (
                <div key={index} className="flex items-center gap-3 mb-2">
                  {phone.type === 'whatsapp' ? (
                    <WhatsAppIcon 
                      className="text-primary flex-shrink-0" 
                      style={{ width: 20, height: 20 }}
                    />
                  ) : (
                    <Phone 
                      className="text-primary flex-shrink-0" 
                      style={{ width: 20, height: 20 }}
                    />
                  )}
                  <div>
                    <a 
                      href={phone.type === 'whatsapp' ? `https://wa.me/${phone.number.replace(/\D/g, '')}` : `tel:${phone.number}`}
                      className="text-gray-700 hover:text-primary transition-colors text-sm"
                    >
                      {phone.number}
                    </a>
                    {phone.label && (
                      <span className="text-xs text-gray-500 ml-2">({phone.label})</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Email adresleri */}
          {emails.length > 0 && (
            <div className="mb-4">
              {emails.map((email, index) => (
                <div key={index} className="flex items-center gap-3 mb-2">
                  <Email 
                    className="text-primary flex-shrink-0" 
                    style={{ width: 20, height: 20 }}
                  />
                  <a 
                    href={`mailto:${email}`}
                    className="text-gray-700 hover:text-primary transition-colors text-sm"
                  >
                    {email}
                  </a>
                </div>
              ))}
            </div>
          )}
          
          {/* Custom content - sadece adres, telefon veya email yoksa göster */}
          {!address && phones.length === 0 && emails.length === 0 && children}
        </div>
        
        {/* Sağ taraf - Harita veya Resim */}
        {(mapUrl || rightImage) && (
          <div className="lg:w-1/2 md:h-60">
            {mapUrl ? (
              <div className="bg-gray-200 rounded-lg h-48 lg:h-full">
                <iframe
                  src={mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-lg"
                ></iframe>
              </div>
            ) : (
              <div className="bg-gray-200 rounded-lg h-48 lg:h-full overflow-hidden">
                <img
                  src={rightImage}
                  alt={title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactCard; 