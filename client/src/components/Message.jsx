import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const Message = ({ variant = 'info', children }) => {
  const styles = {
    danger: 'bg-red-50 border-red-500 text-red-700',
    success: 'bg-green-50 border-green-500 text-green-700',
    info: 'bg-blue-50 border-blue-500 text-blue-700',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-700',
  };

  const icons = {
    danger: <AlertCircle size={20} />,
    success: <CheckCircle size={20} />,
    info: <Info size={20} />,
    warning: <AlertTriangle size={20} />,
  };

  return (
    <div className={`${styles[variant]} border-l-4 p-4 rounded-r-xl flex items-center gap-3 my-4`}>
      {icons[variant]}
      <div className="text-sm font-medium">{children}</div>
    </div>
  );
};

export default Message;
