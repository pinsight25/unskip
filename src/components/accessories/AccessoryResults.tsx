
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import AccessoryCard from '@/components/accessories/AccessoryCard';
import { Accessory, AccessoryFilters } from '@/types/accessory';

interface AccessoryResultsProps {
  accessories: Accessory[];
  viewMode: 'grid' | 'list';
  onClearFilters: () => void;
  isLoading?: boolean;
  error?: Error | null;
}

const AccessoryResults = ({ 
  accessories, 
  viewMode, 
  onClearFilters, 
  isLoading = false, 
  error = null 
}: AccessoryResultsProps) => {
  if (isLoading) {
    return (
      <div className={`grid grid-gap-standard ${
        viewMode === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 md:py-20">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
          Something went wrong
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto text-base md:text-lg">
          Try again later or contact support if the problem persists
        </p>
        <Button
          variant="outline"
          size="lg"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (accessories.length === 0) {
    return (
      <div className="text-center py-12 md:py-20">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
          No accessories found
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto text-base md:text-lg">
          Try adjusting your search terms or filters to find what you're looking for
        </p>
        <Button
          variant="outline"
          size="lg"
          onClick={onClearFilters}
        >
          Clear All Filters
        </Button>
      </div>
    );
  }

  return (
    <div className={`grid grid-gap-standard ${
      viewMode === 'grid' 
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
        : 'grid-cols-1'
    }`}>
      {accessories.map((accessory) => (
        <AccessoryCard
          key={accessory.id}
          accessory={accessory}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};

export default AccessoryResults;
