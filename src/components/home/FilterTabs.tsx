
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
      count: '2.3k+',
      description: 'Browse all available cars'
    },
    { 
      key: 'dealer' as const, 
      label: 'Dealers', 
      icon: Building2, 
      count: '850+',
      description: 'Certified dealer cars'
    },
    { 
      key: 'individual' as const, 
      label: 'Owner Cars', 
      icon: Users, 
      count: '1.5k+',
      description: 'Direct from owners'
    }
  ];

  return (
    <div className="bg-gray-50/50 border-y border-gray-200/50 sticky top-14 md:top-16 z-40 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {filterTypes.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeType === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => onTypeChange(filter.key)}
                className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${
                  isActive 
                    ? 'bg-white border-primary shadow-xl shadow-primary/20 scale-105' 
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg shadow-sm'
                }`}
              >
                {/* Active indicator */}
                {isActive && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white shadow-lg"></div>
                )}

                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-600 group-hover:bg-primary/10 group-hover:text-primary'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Label and Count */}
                  <div className="space-y-1">
                    <h3 className={`font-semibold text-lg transition-colors ${
                      isActive ? 'text-primary' : 'text-gray-900 group-hover:text-primary'
                    }`}>
                      {filter.label}
                    </h3>
                    <Badge 
                      variant="outline" 
                      className={`text-sm px-3 py-1 transition-all duration-200 ${
                        isActive 
                          ? 'border-primary/30 text-primary bg-primary/5' 
                          : 'border-gray-300 text-gray-500 group-hover:border-primary/30 group-hover:text-primary'
                      }`}
                    >
                      {filter.count}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className={`text-sm transition-colors ${
                    isActive ? 'text-gray-600' : 'text-gray-500 group-hover:text-gray-600'
                  }`}>
                    {filter.description}
                  </p>
                </div>

                {/* Hover glow effect */}
                <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-br from-primary/5 to-transparent opacity-100' 
                    : 'bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100'
                }`}></div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FilterTabs;
