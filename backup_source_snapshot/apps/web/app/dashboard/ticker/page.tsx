'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Plus, Trash2, Save, 
  AlertCircle, CheckCircle2, Loader2,
  Megaphone
} from 'lucide-react';
import Link from 'next/link';
import styles from './TickerAdmin.module.css';

interface TickerMessage {
  id?: string;
  text: string;
  isActive: boolean;
}

export default function TickerAdminPage() {
  const [messages, setMessages] = useState<TickerMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function loadMessages() {
      try {
        const res = await fetch('/api/ticker');
        if (res.ok) {
          const data = await res.json();
          // Filter out fallbacks if they don't have real IDs or handle them
          setMessages(data.map((m: { id: string; text: string; isActive?: boolean }) => ({
            id: m.id.startsWith('fallback') ? undefined : m.id,
            text: m.text,
            isActive: m.isActive ?? true
          })));
        }
      } catch (err) {
        console.error('Error loading messages:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMessages();
  }, []);

  const handleAdd = () => {
    if (messages.length >= 10) return;
    setMessages([...messages, { text: '', isActive: true }]);
  };

  const handleRemove = (index: number) => {
    const newMessages = [...messages];
    newMessages.splice(index, 1);
    setMessages(newMessages);
  };

  const handleChange = (index: number, text: string) => {
    const newMessages = [...messages];
    newMessages[index].text = text.substring(0, 70);
    setMessages(newMessages);
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/api/ticker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      });

      if (res.ok) {
        setStatus({ type: 'success', msg: 'Anuncios actualizados correctamente' });
        router.refresh();
      } else {
        const err = await res.json();
        setStatus({ type: 'error', msg: err.error || 'Error al guardar los cambios' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Error de conexión con el servidor' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
          <Loader2 className="animate-spin" size={48} color="var(--clr-orange)" />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href="/dashboard" className={styles.backLink}>
        <ArrowLeft size={18} />
        Volver al Centro de Comando
      </Link>

      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Anuncios Dinámicos</h1>
          <p className={styles.subtitle}>Configura hasta 10 mensajes cortos para la barra superior (máx. 70 caracteres).</p>
        </div>
        <div className={styles.iconHeader}>
          <Megaphone size={40} color="var(--clr-orange)" style={{ opacity: 0.2 }} />
        </div>
      </header>

      {status && (
        <div className={`${styles.card} ${styles.statusMessage}`} style={{ 
          marginBottom: '2rem', 
          borderColor: status.type === 'success' ? 'var(--clr-success)' : 'var(--clr-error)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '1rem'
        }}>
          {status.type === 'success' ? <CheckCircle2 color="var(--clr-success)" /> : <AlertCircle color="var(--clr-error)" />}
          <span>{status.msg}</span>
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.messageList}>
          {messages.map((msg, index) => (
            <div key={index} className={styles.messageItem}>
              <div className={styles.index}>{index + 1}</div>
              <input 
                type="text" 
                value={msg.text} 
                onChange={(e) => handleChange(index, e.target.value)}
                placeholder="Escribe el anuncio aquí..."
                className={styles.input}
                maxLength={70}
              />
              <div className={`${styles.charCount} ${msg.text.length > 60 ? styles.warning : ''}`}>
                {msg.text.length}/70
              </div>
              <button 
                onClick={() => handleRemove(index)}
                className={styles.removeBtn}
                title="Eliminar mensaje"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          
          {messages.length === 0 && (
            <p style={{ textAlign: 'center', color: 'var(--clr-text-dim)', padding: '2rem' }}>
              No hay anuncios configurados. Se mostrarán los mensajes predeterminados.
            </p>
          )}
        </div>

        {messages.length < 10 && (
          <button onClick={handleAdd} className={styles.addBtn}>
            <Plus size={20} />
            Añadir Nuevo Anuncio
          </button>
        )}

        <div className={styles.actions}>
          <button 
            onClick={handleSave} 
            className={styles.saveBtn}
            disabled={saving}
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={18} style={{ marginRight: '0.5rem' }} />
                Guardando...
              </>
            ) : (
              <>
                <Save size={18} style={{ marginRight: '0.5rem' }} />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
