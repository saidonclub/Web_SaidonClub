'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import styles from './Network.module.css';

interface CopyButtonProps {
  text: string;
}

export default function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button onClick={handleCopy} className={styles.copyBtn}>
      {copied ? (
        <>
          <Check size={18} />
          Copiado
        </>
      ) : (
        <>
          <Copy size={18} />
          Copiar Link
        </>
      )}
    </button>
  );
}
