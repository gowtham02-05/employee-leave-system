function Loader({ text = 'Loading...' }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '30px',
        color: '#64748b',
        fontSize: '14px',
        fontWeight: '600',
      }}
    >
      <div
        style={{
          width: '18px',
          height: '18px',
          border: '3px solid #e2e8f0',
          borderTop: '3px solid #4f46e5',
          borderRadius: '50%',
          animation: 'leaveflow-spin 0.8s linear infinite',
        }}
      />

      <span>{text}</span>

      <style>
        {`
          @keyframes leaveflow-spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Loader;