function SearchBox({
  value,
  onChange,
  placeholder = 'Search...',
  style = {},
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        height: '42px',
        padding: '0 14px',
        borderRadius: '8px',
        border: '1px solid #e2e8f0',
        background: '#ffffff',
        color: '#111827',
        fontSize: '13px',
        outline: 'none',
        boxSizing: 'border-box',
        ...style,
      }}
    />
  );
}

export default SearchBox;