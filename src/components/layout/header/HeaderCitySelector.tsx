import { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { useCity } from '@/contexts/CityContext';
const cities = ['Chennai', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Kolkata'];
const HeaderCitySelector = () => {
  const {
    selectedCity,
    setSelectedCity
  } = useCity();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    setIsOpen(false);
  };
  return <div className="relative" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors w-full md:w-auto px-0">
        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
        <span className="text-left">{selectedCity}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ml-auto ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px] w-full md:w-auto">
          {cities.map(city => <button key={city} onClick={() => handleCitySelect(city)} className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors ${selectedCity === city ? 'bg-primary/5 text-primary font-medium' : 'text-gray-700'}`}>
              {city}
            </button>)}
        </div>}
    </div>;
};
export default HeaderCitySelector;