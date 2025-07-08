
import { MapPin } from 'lucide-react';

interface LocationDisplayProps {
  location: string;
  landmark?: string;
  className?: string;
  showIcon?: boolean;
}

const LocationDisplay = ({ 
  location, 
  landmark, 
  className = "text-gray-600",
  showIcon = true 
}: LocationDisplayProps) => {
  const displayLocation = landmark ? `${location}, ${landmark}` : location;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {showIcon && <MapPin className="h-3 w-3" />}
      <span className="text-sm">{displayLocation}</span>
    </div>
  );
};

export default LocationDisplay;
