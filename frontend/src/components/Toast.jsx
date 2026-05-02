import { useState, useEffect, useCallback } from 'react';

let toastFn = null;

export function toast(msg, type = 'success') {
  if (toastFn) toastFn(msg, type);
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  const add = useCallback((msg, type) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  useEffect(() => { toastFn = add; }, [add]);

  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 9999,
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          padding: '12px 20px', borderRadius: 12, fontSize: 14, fontWeight: 500,
          background: t.type === 'error' ? '#fee2e2' : t.type === 'warning' ? '#fef9c3' : '#dcfce7',
          color:      t.type === 'error' ? '#991b1b' : t.type === 'warning' ? '#854d0e' : '#166534',
          border: `1px solid ${t.type === 'error' ? '#fca5a5' : t.type === 'warning' ? '#fde047' : '#86efac'}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          animation: 'fadeUp .3s ease',
          maxWidth: 320,
        }}>
          {t.type === 'error' ? '✕ ' : t.type === 'warning' ? '⚠ ' : '✓ '}
          {t.msg}
        </div>
      ))}
    </div>
  );
}
