function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '20px',
      }}
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={{
          height: '36px',
          padding: '0 14px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          background: '#ffffff',
          color: '#334155',
          cursor:
            currentPage === 1 ? 'not-allowed' : 'pointer',
          opacity: currentPage === 1 ? 0.5 : 1,
        }}
      >
        Previous
      </button>

      <span
        style={{
          minWidth: '80px',
          textAlign: 'center',
          color: '#475569',
          fontSize: '13px',
          fontWeight: '600',
        }}
      >
        Page {currentPage} of {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={{
          height: '36px',
          padding: '0 14px',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          background: '#ffffff',
          color: '#334155',
          cursor:
            currentPage === totalPages
              ? 'not-allowed'
              : 'pointer',
          opacity: currentPage === totalPages ? 0.5 : 1,
        }}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;