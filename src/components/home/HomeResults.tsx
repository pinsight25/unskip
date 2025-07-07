
import { Car } from '@/types/car';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useChatManager } from '@/hooks/useChatManager';
import ResultsHeader from './results/ResultsHeader';
import RefreshControl from './results/RefreshControl';
import EmptyResults from './results/EmptyResults';
import ResultsGrid from './results/ResultsGrid';

interface HomeResultsProps {
  filteredCars: Car[];
  savedCars: string[];
  currentFilters: {
    query: string;
    type: 'all' | 'dealer' | 'individual';
  };
  isMobile: boolean;
  isRefreshing: boolean;
  offerStatuses: Record<string, 'none' | 'pending' | 'accepted' | 'rejected'>;
  onSort: (sortValue: string) => void;
  onSaveCar: (carId: string) => void;
  onMakeOffer: (car: Car) => void;
  onPullToRefresh: () => void;
  onFilterChange: (filters: any) => void;
  getOfferStatus: (carId: string) => 'none' | 'pending' | 'accepted' | 'rejected';
}

const HomeResults = ({
  filteredCars,
  savedCars,
  currentFilters,
  isMobile,
  isRefreshing,
  offerStatuses,
  onSort,
  onSaveCar,
  onMakeOffer,
  onPullToRefresh,
  onFilterChange,
  getOfferStatus
}: HomeResultsProps) => {
  const { navigateToChat } = useChatManager();
  const { toast } = useToast();

  const handleChatClick = (car: Car) => {
    const status = getOfferStatus(car.id);
    
    if (status === 'none') {
      toast({
        title: "Make an offer first",
        description: "You need to make an offer before you can chat with the seller.",
        variant: "destructive",
      });
      return;
    }
    
    if (status === 'pending') {
      toast({
        title: "Waiting for seller response",
        description: "Please wait for the seller to respond to your offer before chatting.",
      });
      return;
    }
    
    if (status === 'accepted') {
      navigateToChat(car.id);
    }
  };

  const handleTestDriveClick = (car: Car) => {
    toast({
      title: "Test Drive Request",
      description: `Test drive request sent for ${car.title}`,
    });
    console.log('Test drive requested for car:', car.id);
  };

  const handleClearFilters = () => {
    onFilterChange({ query: '', type: 'all', priceRange: [0, 5000000], location: '' });
  };

  return (
    <section className="pt-6 pb-8 bg-gray-50 min-h-screen overflow-y-auto">
      <div className="w-full max-w-7xl mx-auto px-4 lg:px-6">
        
        {/* Mobile Pull to Refresh */}
        {isMobile && (
          <RefreshControl 
            isRefreshing={isRefreshing}
            onRefresh={onPullToRefresh}
          />
        )}

        {/* Desktop Results Header */}
        <ResultsHeader
          filteredCarsCount={filteredCars.length}
          savedCarsCount={savedCars.length}
          currentFilters={currentFilters}
          onSort={onSort}
          onFilterChange={onFilterChange}
        />

        {/* Mobile Results Counter with improved spacing */}
        <div className="md:hidden px-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {filteredCars.length} Cars
              </h2>
              {currentFilters.query && (
                <p className="text-[14px] text-gray-600 mt-1">
                  Results for "{currentFilters.query}"
                </p>
              )}
            </div>
            {savedCars.length > 0 && (
              <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                <Heart className="h-4 w-4 mr-1 fill-current" />
                {savedCars.length}
              </Badge>
            )}
          </div>
        </div>

        {/* Results Content with proper bottom padding */}
        <div className="pb-24 md:pb-8">
          {filteredCars.length > 0 ? (
            <ResultsGrid
              cars={filteredCars}
              savedCars={savedCars}
              isMobile={isMobile}
              onSaveCar={onSaveCar}
              onMakeOffer={onMakeOffer}
              onChat={handleChatClick}
              onTestDrive={handleTestDriveClick}
              getOfferStatus={getOfferStatus}
            />
          ) : (
            <EmptyResults onClearFilters={handleClearFilters} />
          )}
        </div>
      </div>
    </section>
  );
};

export default HomeResults;
