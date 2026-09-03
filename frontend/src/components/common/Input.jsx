function Input({
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  required = false,
  disabled = false,
  style = {},
}) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      style={{
        width: '100%',
        height: '50px',
        padding: '0 15px',
        borderRadius: '12px',
        border: '1px solid #dbe2ea',
        background: '#f8fafc',
        color: '#111827',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
        transition: '0.2s',
        ...style,
      }}
    />
  );
}

export default Input;