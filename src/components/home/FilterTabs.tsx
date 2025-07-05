
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
    <div className="bg-white border-b border-gray-100 sticky top-14 md:top-16 z-40 shadow-sm">
      <div className="w-full max-w-6xl mx-auto px-4 lg:px-6 py-4">
        {/* Compact Toggle Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-gray-50 p-2 rounded-xl max-w-2xl mx-auto">
          {filterTypes.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeType === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => onTypeChange(filter.key)}
                className={`flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-300 rounded-lg min-h-[48px] ${
                  isActive 
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md' 
                    : 'text-gray-600 hover:text-primary hover:bg-white/80 hover:shadow-sm'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium hidden sm:inline">{filter.label}</span>
                <span className="font-medium sm:hidden">{filter.label.split(' ')[0]}</span>
                <Badge 
                  variant="secondary" 
                  className={`text-xs px-2 py-0.5 font-medium ${
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
