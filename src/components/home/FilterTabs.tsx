
import { Car, Building2, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FilterTabsProps {
  activeType: 'all' | 'dealer' | 'individual';
  onTypeChange: (type: 'all' | 'dealer' | 'individual') => void;
}

const FilterTabs = ({ activeType, onTypeChange }: FilterTabsProps) => {
  const filterTypes = [
    { key: 'all' as const, label: 'All Cars', icon: Car, count: '2.3k+' },
    { key: 'dealer' as const, label: 'Dealers', icon: Building2, count: '850+' },
    { key: 'individual' as const, label: 'Owner Cars', icon: Users, count: '1.5k+' }
  ];

  return (
    <div className="bg-white border-b border-gray-200 sticky top-14 md:top-16 z-40">
      <div className="container mx-auto px-4">
        <div className="flex space-x-6 md:space-x-8 overflow-x-auto">
          {filterTypes.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeType === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => onTypeChange(filter.key)}
                className={`flex items-center gap-2 pb-3 px-1 font-medium transition-all duration-200 whitespace-nowrap border-b-2 ${
                  isActive 
                    ? 'text-primary border-primary' 
                    : 'text-gray-600 hover:text-gray-900 border-transparent hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{filter.label}</span>
                <Badge variant="outline" className={`text-xs ${isActive ? 'border-primary/30 text-primary/70' : 'border-gray-300 text-gray-500'}`}>
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
