
import { Button } from '@/components/ui/button';

interface EmptyDealerStateProps {
  onClearFilters: () => void;
}

const EmptyDealerState = ({ onClearFilters }: EmptyDealerStateProps) => {
  return (
    <div className="text-center py-12">
      <h3 className="text-lg font-semibold mb-2">No dealers found</h3>
      <p className="text-gray-600 mb-4">Try adjusting your filters to see more results</p>
      <Button onClick={onClearFilters} variant="outline">
        Clear All Filters
      </Button>
    </div>
  );
};

export default EmptyDealerState;
