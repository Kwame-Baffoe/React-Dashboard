import React from 'react';

export const AlertDialog = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        {children}
      </div>
    </div>
  );
};

export const AlertDialogTrigger = ({ onClick, children }) => (
  <button onClick={onClick} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
    {children}
  </button>
);

export const AlertDialogContent = ({ children }) => (
  <div className="mb-4">
    {children}
  </div>
);

export const AlertDialogHeader = ({ children }) => (
  <div className="mb-4">
    {children}
  </div>
);

export const AlertDialogTitle = ({ children }) => (
  <h2 className="font-semibold text-lg">{children}</h2>
);

export const AlertDialogDescription = ({ children }) => (
  <p className="text-sm text-gray-600">{children}</p>
);

export const AlertDialogFooter = ({ children }) => (
  <div className="mt-4 flex justify-end">
    {children}
  </div>
);

export const AlertDialogCancel = ({ onClick, children }) => (
  <button onClick={onClick} className="px-4 py-2 bg-gray-500 text-white rounded mr-2 hover:bg-gray-600">
    {children}
  </button>
);

export const AlertDialogAction = ({ onClick, children }) => (
  <button onClick={onClick} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
    {children}
  </button>
);

// export {
  
//   AlertDialogTrigger,
//   AlertDialogContent,
//   AlertDialogHeader,
//   AlertDialogFooter,
//   AlertDialogTitle,
//   AlertDialogDescription,
//   AlertDialogAction,
//   AlertDialogCancel,
// }

export default AlertDialog;