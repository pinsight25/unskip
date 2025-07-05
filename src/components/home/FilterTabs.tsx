
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
    <div className="bg-white border-b border-gray-100 sticky top-16 md:top-20 z-40 shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Enhanced Toggle Tabs */}
        <div className="grid grid-cols-3 gap-4 bg-gray-50 p-3 rounded-2xl max-w-3xl mx-auto">
          {filterTypes.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeType === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => onTypeChange(filter.key)}
                className={`flex items-center justify-center gap-4 px-6 py-5 text-base font-bold transition-all duration-300 rounded-xl min-h-[72px] ${
                  isActive 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl transform scale-105' 
                    : 'text-gray-600 hover:text-primary hover:bg-white/80 hover:shadow-md'
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="font-bold hidden sm:inline text-lg">{filter.label}</span>
                <span className="font-bold sm:hidden text-base">{filter.label.split(' ')[0]}</span>
                <Badge 
                  variant="secondary" 
                  className={`text-sm px-4 py-1.5 font-bold ${
                    isActive 
                      ? 'bg-white/20 text-white border-white/30' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {filter.count}
                </Badge>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterTabs;
