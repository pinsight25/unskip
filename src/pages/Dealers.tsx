
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { dealersData } from '@/data/dealers';
import DealerHeader from '@/components/dealers/DealerHeader';
import DealerFilters from '@/components/dealers/DealerFilters';
import DealerGrid from '@/components/dealers/DealerGrid';
import EmptyDealerState from '@/components/dealers/EmptyDealerState';

const Dealers = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');

  // Filter dealers based on selected filters
  const filteredDealers = dealersData.filter(dealer => {
    const locationMatch = !selectedLocation || selectedLocation === 'All Locations' || 
                         dealer.city.toLowerCase() === selectedLocation.toLowerCase();
    const brandMatch = !selectedBrand || selectedBrand === 'All Brands' || 
                      dealer.brands.some(brand => brand.toLowerCase() === selectedBrand.toLowerCase());
    
    return locationMatch && brandMatch;
  });

  const handleApplyFilters = () => {
  };

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
            Showing {filteredDealers.length} of {dealersData.length} dealers
          </p>
        </div>

        {/* Dealers Grid */}
        {filteredDealers.length > 0 ? (
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
