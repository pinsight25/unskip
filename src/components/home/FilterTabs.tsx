
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
    <div className="bg-white border-y border-gray-100 sticky top-14 md:top-16 z-40">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          {/* Modern Card-Based Tabs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {filterTypes.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeType === filter.key;
              return (
                <button
                  key={filter.key}
                  onClick={() => onTypeChange(filter.key)}
                  className={`group relative p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 min-h-[44px] ${
                    isActive 
                      ? 'bg-white border-primary shadow-2xl shadow-primary/25 scale-105 ring-4 ring-primary/10' 
                      : 'bg-white border-gray-200 hover:border-primary/50 hover:shadow-xl shadow-md'
                  }`}
                >
                  {/* Active Pulse Effect */}
                  {isActive && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full border-4 border-white shadow-lg animate-pulse"></div>
                  )}

                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Icon with Enhanced Styling */}
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isActive 
                        ? 'bg-gradient-to-br from-primary to-primary/80 text-white shadow-xl shadow-primary/30' 
                        : 'bg-gray-50 text-gray-600 group-hover:bg-gradient-to-br group-hover:from-primary/10 group-hover:to-primary/5 group-hover:text-primary'
                    }`}>
                      <Icon className="h-8 w-8" />
                    </div>

                    {/* Label and Count */}
                    <div className="space-y-2">
                      <h3 className={`font-bold text-xl transition-colors ${
                        isActive ? 'text-primary' : 'text-gray-900 group-hover:text-primary'
                      }`}>
                        {filter.label}
                      </h3>
                      <Badge 
                        variant="outline" 
                        className={`text-sm px-4 py-1.5 font-semibold transition-all duration-200 ${
                          isActive 
                            ? 'border-primary/40 text-primary bg-primary/10 shadow-sm' 
                            : 'border-gray-300 text-gray-600 group-hover:border-primary/40 group-hover:text-primary group-hover:bg-primary/5'
                        }`}
                      >
                        {filter.count}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className={`text-sm font-medium transition-colors ${
                      isActive ? 'text-gray-700' : 'text-gray-500 group-hover:text-gray-700'
                    }`}>
                      {filter.description}
                    </p>
                  </div>

                  {/* Modern Hover Glow Effect */}
                  <div className={`absolute inset-0 rounded-2xl transition-all duration-500 ${
                    isActive 
                      ? 'bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-100' 
                      : 'bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100'
                  }`}></div>

                  {/* Subtle Inner Shadow for Depth */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterTabs;
