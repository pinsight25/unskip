import React from 'react';

interface ConnectionStatusIndicatorProps {
  status?: 'connected' | 'disconnected' | 'connecting';
  lastUpdate?: string;
  onRefresh?: () => void;
}

const statusColor = {
  connected: 'bg-green-500',
  disconnected: 'bg-red-500',
  connecting: 'bg-yellow-400',
};

const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({ status = 'connected', lastUpdate, onRefresh }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-md">
      <span className={`inline-block w-3 h-3 rounded-full ${statusColor[status]}`} title={status} />
      <span className="text-xs text-gray-700 font-medium capitalize">{status}</span>
      {lastUpdate && <span className="text-xs text-gray-500 ml-2">Last update: {lastUpdate}</span>}
      {onRefresh && (
        <button
          onClick={onRefresh}
          className="ml-2 text-primary hover:text-primary-dark focus:outline-none"
          title="Refresh"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582M20 20v-5h-.581M5.423 19.584A9 9 0 104.582 9.582" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ConnectionStatusIndicator; 