function Toast({
  message = '',
  type = 'success',
  onClose,
}) {
  if (!message) {
    return null;
  }

  const isError = type === 'error';

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 2000,
        minWidth: '280px',
        maxWidth: '400px',
        padding: '14px 16px',
        borderRadius: '10px',
        background: '#ffffff',
        border: `1px solid ${isError ? '#fecaca' : '#bbf7d0'}`,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: isError ? '#ef4444' : '#22c55e',
            flexShrink: 0,
          }}
        />

        <span
          style={{
            color: '#334155',
            fontSize: '13px',
            fontWeight: '600',
            lineHeight: '1.4',
          }}
        >
          {message}
        </span>
      </div>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          style={{
            border: 'none',
            background: 'transparent',
            color: '#94a3b8',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '0',
            lineHeight: 1,
          }}
          aria-label="Close notification"
        >
          ×
        </button>
      )}
    </div>
  );
}

export default Toast;
