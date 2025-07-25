
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import DealerHeader from '@/components/dealers/DealerHeader';
import DealerFilters from '@/components/dealers/DealerFilters';
import DealerGrid from '@/components/dealers/DealerGrid';
import EmptyDealerState from '@/components/dealers/EmptyDealerState';
import { supabase } from '@/lib/supabase';
import { useDealers } from '@/hooks/queries/useDealers';
import { Dealer } from '@/types/dealer';
import { Skeleton } from '@/components/ui/skeleton';
import { useCars } from '@/hooks/queries/useCarQueries';
import { useQueryClient } from '@tanstack/react-query';

const DealerSkeletonGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {Array.from({ length: 8 }).map((_, i) => (
      <Skeleton key={i} className="h-40 w-full rounded-lg" />
    ))}
  </div>
);

const Dealers = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const queryClient = useQueryClient();

  // Use the new useDealers hook
  const { filteredDealers, error, data: allDealers, isLoading, refetch } = useDealers(selectedLocation, selectedBrand);

  // Reset filters to show all dealers by default on mount
  useEffect(() => {
    setSelectedLocation('');
    setSelectedBrand('');
  }, []);

  const handleApplyFilters = () => {};
  const handleClearFilters = () => {
    setSelectedLocation('');
    setSelectedBrand('');
  };

  const handleRefresh = async () => {
    console.log('🔄 Manually refreshing dealers data...');
    await queryClient.invalidateQueries({ queryKey: ['dealers'] });
    await refetch();
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <DealerHeader />
      <div className="max-width-container-wide py-4 pb-24 lg:pb-8">
        {/* Filters */}
        <div className="mb-4">
          <DealerFilters
            selectedLocation={selectedLocation}
            selectedBrand={selectedBrand}
            onLocationChange={setSelectedLocation}
            onBrandChange={setSelectedBrand}
            onApplyFilters={handleApplyFilters}
            onClearFilters={handleClearFilters}
          />
        </div>
        
        {/* Results count and refresh button */}
        <div className="mb-4 flex justify-between items-center">
          <p className="text-gray-600 text-sm">
            Showing {filteredDealers ? filteredDealers.length : 0} of {(allDealers || []).length} dealers
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
        
        {/* Dealers Grid */}
        {error ? (
          <div className="text-center py-12 text-red-500">Something went wrong. Try again.</div>
        ) : filteredDealers && filteredDealers.length > 0 ? (
          <DealerGrid dealers={filteredDealers} />
        ) : (
          <EmptyDealerState onClearFilters={handleClearFilters} />
        )}
        
        {/* Bottom CTA for Mobile */}
        <div className="mt-8 text-center md:hidden">
          <Link to="/dealer/register">
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-3 shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Join as a Dealer
            </Button>
          </Link>
          <p className="text-sm text-gray-600 mt-2">Grow your business with us</p>
        </div>
      </div>
    </div>
  );
};

export default Dealers;
