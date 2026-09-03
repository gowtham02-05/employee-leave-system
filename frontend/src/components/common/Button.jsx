function Button({
  children,
  type = 'button',
  onClick,
  disabled = false,
  variant = 'primary',
  className = '',
  style = {},
}) {
  const styles = {
    primary: {
      background: '#4f46e5',
      color: '#ffffff',
      border: '1px solid #4f46e5',
    },

    secondary: {
      background: '#f8fafc',
      color: '#334155',
      border: '1px solid #e2e8f0',
    },

    success: {
      background: '#16a34a',
      color: '#ffffff',
      border: '1px solid #16a34a',
    },

    danger: {
      background: '#dc2626',
      color: '#ffffff',
      border: '1px solid #dc2626',
    },

    warning: {
      background: '#f59e0b',
      color: '#ffffff',
      border: '1px solid #f59e0b',
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        ...styles[variant],
        height: '38px',
        padding: '0 15px',
        borderRadius: '8px',
        fontSize: '10px',
        fontWeight: '700',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: '0.2s ease',
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export default Button;