
import { useEffect } from "react";

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); // hide after 3s
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg text-sm animate-fadeIn z-50">
      {message}
    </div>
  );
};

export default Toast;
