'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import styles from './CitaDetalle.module.css';

interface CitaQRCodeProps {
  value: string;
}

export default function CitaQRCode({ value }: CitaQRCodeProps) {
  return (
    <div className={styles.qrContainer}>
      <QRCodeSVG 
        value={value} 
        size={200}
        level="H"
        includeMargin={true}
        imageSettings={{
          src: '/favicon.ico', // Optional: could use a brand logo here
          x: undefined,
          y: undefined,
          height: 24,
          width: 24,
          excavate: true,
        }}
      />
      <span className={styles.qrCodeText}>{value}</span>
    </div>
  );
}
