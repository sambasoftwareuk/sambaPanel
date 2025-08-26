'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function Popup({ initialOpen = false, title = 'Bilgi', children, onClose }) {
  const [open, setOpen] = useState(initialOpen);
  const overlayRef = useRef(null);
  const dialogRef = useRef(null);
  const lastFocused = useRef(null);

  useEffect(() => {
    if (open) {
      lastFocused.current = document.activeElement;
      document.body.style.overflow = 'hidden';
      setTimeout(() => dialogRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = '';
      lastFocused.current?.focus?.();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        onClose?.();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlayRef}
      onMouseDown={(e) => {
        if (e.target === overlayRef.current) {
          setOpen(false);
          onClose?.();
        }
      }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 1000,
        padding: '1rem',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={dialogRef}
        tabIndex={-1}
        style={{
          background: 'white',
          maxWidth: '560px',
          width: '100%',
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          padding: '1rem',
          outline: 'none',
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{title}</h2>
          <button
            onClick={() => {
              setOpen(false);
              onClose?.();
            }}
            aria-label="Kapat"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '1.25rem' }}
          >
            ×
          </button>
        </div>

        <div style={{ marginTop: '.75rem' }}>{children}</div>

        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              setOpen(false);
              onClose?.();
            }}
            style={{
              padding: '.5rem .9rem',
              borderRadius: '8px',
              border: '1px solid #ddd',
              background: '#f7f7f7',
              cursor: 'pointer',
            }}
          >
            Kapat
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
