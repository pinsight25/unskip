
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

interface EmptyResultsProps {
  onClearFilters: () => void;
}

const EmptyResults = ({ onClearFilters }: EmptyResultsProps) => {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Filter className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-2xl font-bold mb-3 text-gray-900">No cars found</h3>
      <p className="text-gray-600 mb-8 max-w-md mx-auto text-[16px] leading-relaxed">
        Try adjusting your search or filters to find more cars that match your preferences.
      </p>
      <Button 
        variant="outline"
        size="default"
        onClick={onClearFilters}
        className="h-12 px-8 text-[15px] font-medium"
      >
        Clear All Filters
      </Button>
    </div>
  );
};

export default EmptyResults;
