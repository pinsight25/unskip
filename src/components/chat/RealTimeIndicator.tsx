import React from 'react';
import { Wifi } from 'lucide-react';

interface RealTimeIndicatorProps {
  isConnected: boolean;
}

const RealTimeIndicator = ({ isConnected }: RealTimeIndicatorProps) => {
  // Return null to hide the green live indicators
  return null;
};

export default RealTimeIndicator; 