
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
      <div className="w-full max-w-6xl mx-auto px-4 lg:px-6 py-6">
        <div className="text-center mb-4">
          <h2 className="heading-3 text-gray-900 mb-2">Find Your Perfect Car</h2>
          <p className="small-text text-gray-600">Choose from dealers or individual sellers</p>
        </div>
        
        {/* Enhanced Filter Tabs */}
        <div className="flex justify-center">
          <div className="inline-flex bg-gray-100 p-1.5 rounded-2xl shadow-inner max-w-2xl w-full">
            {filterTypes.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeType === filter.key;
              return (
                <button
                  key={filter.key}
                  onClick={() => onTypeChange(filter.key)}
                  className={`flex-1 flex flex-col items-center justify-center gap-2 px-4 py-4 text-sm font-semibold transition-all duration-300 rounded-xl min-h-[80px] relative overflow-hidden ${
                    isActive 
                      ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg transform scale-[1.02]' 
                      : 'text-gray-700 hover:text-orange-600 hover:bg-white/80 hover:shadow-sm'
                  }`}
                >
                  {/* Background decoration for active state */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-red-400/20 pointer-events-none" />
                  )}
                  
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? 'bg-white/20 text-white shadow-md' 
                      : 'bg-gray-200 text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-600'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-sm leading-tight">
                      {filter.label}
                    </span>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs px-2 py-1 font-bold mt-1 border-0 ${
                        isActive 
                          ? 'bg-white/25 text-white backdrop-blur-sm' 
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {filter.count}
                    </Badge>
                  </div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-full shadow-sm" />
                  )}
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
