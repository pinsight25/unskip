
import { Car, Building2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FilterTabsProps {
  activeType: 'all' | 'dealer' | 'individual';
  onTypeChange: (type: 'all' | 'dealer' | 'individual') => void;
}

const FilterTabs = ({ activeType, onTypeChange }: FilterTabsProps) => {
  const filterTypes = [
    { 
      key: 'all' as const, 
      label: 'All Cars', 
      icon: Car, 
      count: '2.3k+'
    },
    { 
      key: 'dealer' as const, 
      label: 'Dealers', 
      icon: Building2, 
      count: '850+'
    },
    { 
      key: 'individual' as const, 
      label: 'Owner Cars', 
      icon: Users, 
      count: '1.5k+'
    }
  ];

  return (
    <div className="bg-white border-b border-gray-100 sticky top-14 md:top-16 z-40 shadow-sm no-tap-highlight">
      <div className="w-full max-w-6xl mx-auto px-4 lg:px-6 py-4">
        {/* Mobile-Optimized Toggle Tabs */}
        <div className="flex justify-around bg-gray-50 p-2 rounded-xl max-w-2xl mx-auto md:grid md:grid-cols-3 md:gap-2 no-tap-highlight">
          {filterTypes.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeType === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => onTypeChange(filter.key)}
                className={`flex-1 flex flex-col items-center justify-center gap-1 px-3 py-3 text-sm font-medium transition-all duration-300 rounded-lg min-h-[60px] md:flex-row md:gap-2 md:min-h-[48px] no-tap-highlight ${
                  isActive 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md' 
                    : 'text-gray-600 hover:text-primary hover:bg-white/80 hover:shadow-sm'
                }`}
              >
                <Icon className="h-4 w-4" />
                <div className="flex flex-col items-center md:flex-row md:gap-1">
                  <span className="font-medium text-xs md:text-sm leading-tight">
                    {filter.label.split(' ')[0]}
                    <span className="hidden sm:inline"> {filter.label.split(' ')[1] || ''}</span>
                  </span>
                  <Badge 
                    variant="secondary" 
                    className={`text-[10px] px-1.5 py-0.5 font-medium mt-1 md:mt-0 ${
                      isActive 
                        ? 'bg-white/20 text-white border-white/30' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {filter.count}
                  </Badge>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterTabs;
