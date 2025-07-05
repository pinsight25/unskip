
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
    <div className="bg-white border-b border-gray-100 sticky top-14 md:top-18 z-40 shadow-sm">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-6 py-6">
        {/* Toggle Tabs - Better desktop spacing */}
        <div className="grid grid-cols-3 gap-3 bg-gray-50 p-2 rounded-xl max-w-2xl mx-auto">
          {filterTypes.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeType === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => onTypeChange(filter.key)}
                className={`flex items-center justify-center gap-3 px-4 py-4 text-sm font-medium transition-all duration-200 rounded-lg min-h-[56px] ${
                  isActive 
                    ? 'bg-primary text-white shadow-md transform scale-105' 
                    : 'text-gray-600 hover:text-primary hover:bg-white/70'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-semibold hidden sm:inline">{filter.label}</span>
                <span className="font-semibold sm:hidden">{filter.label.split(' ')[0]}</span>
                <Badge 
                  variant="secondary" 
                  className={`text-xs px-3 py-1 font-medium ${
                    isActive 
                      ? 'bg-white/20 text-white border-white/30' 
                      : 'bg-gray-200 text-gray-600'
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
