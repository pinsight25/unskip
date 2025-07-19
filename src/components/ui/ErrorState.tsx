import React from 'react';

interface ErrorStateProps {
  title: string;
  message: string;
  onRetry: () => void;
  showCached?: boolean;
  lastUpdate?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ title, message, onRetry, showCached, lastUpdate }) => {
  return (
    <div className="text-center py-12">
      <div className="text-2xl font-bold text-red-600 mb-2">{title}</div>
      <div className="text-gray-700 mb-4 text-lg">{message}</div>
      {showCached && (
        <div className="bg-yellow-100 text-yellow-800 rounded px-4 py-2 mb-4 inline-block font-medium">
          Showing cached results
        </div>
      )}
      {lastUpdate && (
        <div className="text-xs text-gray-500 mb-2">Last update: {lastUpdate}</div>
      )}
      <button
        onClick={onRetry}
        className="bg-primary text-white px-4 py-2 rounded shadow hover:bg-primary/90 font-semibold"
      >
        Retry
      </button>
    </div>
  );
};

export default ErrorState; 