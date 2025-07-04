
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
    <div className="bg-white border-b border-gray-100 sticky top-14 md:top-16 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-5xl mx-auto">
          {/* Compact Modern Tabs */}
          <div className="flex items-center justify-center md:justify-start">
            <div className="inline-flex bg-gray-100 rounded-xl p-1">
              {filterTypes.map((filter) => {
                const Icon = filter.icon;
                const isActive = activeType === filter.key;
                return (
                  <button
                    key={filter.key}
                    onClick={() => onTypeChange(filter.key)}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 min-h-[44px] ${
                      isActive 
                        ? 'bg-white text-primary shadow-sm border border-primary/20' 
                        : 'text-gray-600 hover:text-primary hover:bg-white/50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-semibold">{filter.label}</span>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs px-2 py-0.5 font-medium ${
                        isActive 
                          ? 'bg-primary/10 text-primary border-primary/20' 
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
      </div>
    </div>
  );
};

export default FilterTabs;
