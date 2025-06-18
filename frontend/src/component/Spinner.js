const Spinner = () => {
  return (
    <div className="d-flex justify-content-center mt-4 py-4"> {/* Added margin-top and padding */}
      <div 
        className="spinner-border" 
        style={{ 
          width: '2.5rem', 
          height: '2.5rem',
          borderWidth: '0.45em' 
        }} 
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
export default Spinner;