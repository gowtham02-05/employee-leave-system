function DatePicker({
  label,
  value,
  onChange,
  name,
  min,
  max,
  required = false,
  error,
  disabled = false,
}) {
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label
          htmlFor={name}
          style={{
            display: 'block',
            marginBottom: '6px',
            fontSize: '13px',
            fontWeight: '600',
            color: '#334155',
          }}
        >
          {label}
          {required && (
            <span style={{ color: '#ef4444', marginLeft: '3px' }}>
              *
            </span>
          )}
        </label>
      )}

      <input
        id={name}
        name={name}
        type="date"
        value={value || ''}
        onChange={onChange}
        min={min}
        max={max}
        required={required}
        disabled={disabled}
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '10px 12px',
          border: `1px solid ${error ? '#ef4444' : '#cbd5e1'}`,
          borderRadius: '8px',
          background: disabled ? '#f8fafc' : '#ffffff',
          color: '#334155',
          fontSize: '14px',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      />

      {error && (
        <div
          style={{
            marginTop: '5px',
            fontSize: '12px',
            color: '#ef4444',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

export default DatePicker;