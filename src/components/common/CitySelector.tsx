
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';

interface CitySelectorProps {
  selectedCity: string;
  onCityChange: (city: string) => void;
  className?: string;
}

const cities = [
  'Chennai',
  'Mumbai', 
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Pune',
  'Kolkata'
];

const CitySelector = ({ selectedCity, onCityChange, className = '' }: CitySelectorProps) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <MapPin className="h-4 w-4 text-primary" />
        <span>City:</span>
      </div>
      <Select value={selectedCity} onValueChange={onCityChange}>
        <SelectTrigger className="w-[180px] h-10 bg-white border-2 border-gray-200 focus:border-primary">
          <SelectValue placeholder="Select City" />
        </SelectTrigger>
        <SelectContent className="bg-white border shadow-lg">
          <SelectItem value="">All Cities</SelectItem>
          {cities.map((city) => (
            <SelectItem key={city} value={city} className="hover:bg-gray-50">
              {city}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default CitySelector;
