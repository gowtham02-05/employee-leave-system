function Select({
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  required = false,
  disabled = false,
  style = {},
}) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
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
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      <option value="">{placeholder}</option>

      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}

export default Select;