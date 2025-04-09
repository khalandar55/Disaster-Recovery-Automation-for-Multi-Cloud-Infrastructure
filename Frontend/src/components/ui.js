export const Button = ({ children, onClick }) => (
    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onClick}>
      {children}
    </button>
  );
  
// Example Modal component
export const Modal = ({ isOpen, onClose, title, children, className }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div
        className={`
          relative bg-white rounded shadow-lg w-full max-w-lg 
          ${className || ""}  // <-- Apply any extra classes here
        `}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        
        {/* Modal Body */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

  
  export const Input = ({ label, type = "text", ...props }) => (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <input type={type} className="border rounded p-2 w-full" {...props} />
    </div>
  );
  
  export const Select = ({ label, options, value, onChange }) => (
    <div>
      <label className="block text-sm font-medium">{label}</label>
      <select
        className="border rounded p-2 w-full cursor-pointer"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="" disabled>Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
  
  