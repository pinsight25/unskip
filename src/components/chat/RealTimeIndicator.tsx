import React from 'react';
import { Wifi } from 'lucide-react';

interface RealTimeIndicatorProps {
  isConnected: boolean;
}

const RealTimeIndicator = ({ isConnected }: RealTimeIndicatorProps) => {
  if (!isConnected) return null;

  return (
    <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <Wifi className="w-3 h-3" />
      <span>Live</span>
    </div>
  );
};

export default RealTimeIndicator; 