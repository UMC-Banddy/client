import React from "react";

interface ToastProps {
  message: string;
  visible: boolean;
}

const Toast: React.FC<ToastProps> = ({ message, visible }) => {
  return (
    <div 
      className={`fixed bottom-[15vh] left-1/2 -translate-x-1/2 bg-black text-white rounded-full px-auto py-[8.5px] flex items-center justify-center z-50 w-[56vw] max-w-[219px] h-[4vh] max-h-[35px] text-center text-hakgyo-r-16 transition-all duration-300 ease-in-out ${
        visible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {message}
    </div>
  );
};

export default Toast;
