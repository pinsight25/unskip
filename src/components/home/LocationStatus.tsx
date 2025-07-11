
import { MapPin, X } from 'lucide-react';

interface LocationStatusProps {
  selectedLocation: string;
  onClear: () => void;
}

const LocationStatus = ({ selectedLocation, onClear }: LocationStatusProps) => {
  if (!selectedLocation) return null;

  return (
    <div className="flex items-center gap-3 text-sm text-primary bg-primary/5 px-4 lg:px-6 py-3 lg:py-4 rounded-lg border border-primary/20 max-w-lg mx-auto sm:mx-0">
      <MapPin className="h-4 w-4 lg:h-5 lg:w-5" />
      <span>Showing cars in: <strong className="text-base">{selectedLocation}</strong></span>
      <button
        onClick={onClear}
        className="ml-auto text-primary hover:text-primary/80"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default LocationStatus;
