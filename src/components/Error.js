import { AlertCircle, X } from "lucide-react";

export default function Error({ message, onClose }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <h3 className="text-sm font-medium text-red-800">Error</h3>
        <p className="text-sm text-red-700 mt-1">{message}</p>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 text-red-500 hover:text-red-700"
          aria-label="Close error"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}