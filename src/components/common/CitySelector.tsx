
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import { useCities } from '@/hooks/useCities';

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  className?: string;
}

const CitySelector = ({ selectedCity, onCityChange, className = '' }: CitySelectorProps) => {
  const { cities, isLoading } = useCities();

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <MapPin className="h-4 w-4 text-primary" />
        <span>City:</span>
      </div>
      <Select value={selectedCity} onValueChange={onCityChange}>
        <SelectTrigger className="w-[180px] h-10 bg-white border-2 border-gray-200 focus:border-primary">
          <SelectValue placeholder={isLoading ? "Loading..." : "Select City"} />
        </SelectTrigger>
        <SelectContent className="bg-white border shadow-lg">
          <SelectItem value="all-cities" className="hover:bg-gray-50">
            All Cities
          </SelectItem>
          {cities.map((city) => (
            <SelectItem key={city.id} value={city.name} className="hover:bg-gray-50">
              {city.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CitySelector;
