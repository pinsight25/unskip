
import { useRef, useState } from 'react';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';

interface PopularAreasProps {
  areas: string[];
  selectedLocation: string;
  selectedCity: string;
  onLocationClick: (location: string) => void;
}

const PopularAreas = ({ areas, selectedLocation, selectedCity, onLocationClick }: PopularAreasProps) => {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-2 lg:space-y-3">
      <div className="flex items-center justify-start max-w-5xl mx-auto">
        <span className="text-sm lg:text-base text-gray-700 font-semibold flex items-center gap-2">
          <MapPin className="h-4 w-4 lg:h-5 lg:w-5 text-primary" />
          Popular Areas in {selectedCity}
        </span>
      </div>
      
      {/* Horizontal scroll container for all screen sizes */}
      <div className="max-w-5xl mx-auto relative">
        {/* Left scroll arrow - desktop only */}
        {showLeftArrow && (
          <button
            onClick={scrollLeft}
            className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 bg-white shadow-lg border border-gray-200 rounded-full items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
        )}

        {/* Right scroll arrow - desktop only */}
        {showRightArrow && (
          <button
            onClick={scrollRight}
            className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 h-10 w-10 bg-white shadow-lg border border-gray-200 rounded-full items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        )}

        {/* Scrollable areas container - Fixed height with proper padding */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-1 lg:px-14 h-[52px]" 
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {areas.map((location) => {
            const isSelected = selectedLocation === location;
            return (
              <button
                key={location}
                onClick={() => onLocationClick(location)}
                className={`flex-shrink-0 px-4 lg:px-5 py-2 lg:py-2.5 text-sm font-semibold rounded-full transition-all duration-200 whitespace-nowrap h-[40px] lg:h-[44px] flex items-center ${
                  isSelected 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:from-orange-600 hover:to-red-600 transform scale-105' 
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:shadow-md'
                }`}
              >
                {location}
              </button>
            );
          })}
          <div className="w-4 flex-shrink-0" />
        </div>
      </div>
    </div>
  );
};

export default PopularAreas;
