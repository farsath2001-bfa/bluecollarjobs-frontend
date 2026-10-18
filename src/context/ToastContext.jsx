import React, { createContext, useCallback, useContext, useState } from "react";
import { FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa";

const ToastContext = createContext(() => {});

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  // toast("Saved") or toast("Couldn't save", "error")
  const toast = useCallback(
    (message, type = "success") => {
      const id = Date.now() + Math.random();
      setToasts((t) => [...t.slice(-2), { id, message, type }]);
      setTimeout(() => dismiss(id), 4000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-stack" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item toast-${t.type}`}>
            {t.type === "error" ? <FaExclamationCircle /> : <FaCheckCircle />}
            <span>{t.message}</span>
            <button type="button" aria-label="Dismiss" onClick={() => dismiss(t.id)}>
              <FaTimes />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext);
