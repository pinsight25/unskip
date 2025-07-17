
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DealerHeader from '@/components/dealers/DealerHeader';
import DealerFilters from '@/components/dealers/DealerFilters';
import DealerGrid from '@/components/dealers/DealerGrid';
import EmptyDealerState from '@/components/dealers/EmptyDealerState';
import { supabase } from '@/lib/supabase';
import { useDealers } from '@/hooks/queries/useDealers';
import { Dealer } from '@/types/dealer';

const Dealers = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

  // Use the new useDealers hook
  const { filteredDealers, isLoading, error, data: allDealers } = useDealers(selectedLocation, selectedBrand);

  const handleApplyFilters = () => {};
  const handleClearFilters = () => {
    setSelectedLocation('');
    setSelectedBrand('');
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
        {/* Results count */}
        <div className="mb-4">
          <p className="text-gray-600 text-sm">
            {isLoading ? 'Loading dealers...' : `Showing ${filteredDealers.length} of ${(allDealers || []).length} dealers`}
          </p>
        </div>
        {/* Dealers Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading dealers...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error.message || 'Failed to load dealers.'}</div>
        ) : filteredDealers.length > 0 ? (
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
