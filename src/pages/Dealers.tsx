
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import DealerHeader from '@/components/dealers/DealerHeader';
import DealerFilters from '@/components/dealers/DealerFilters';
import DealerGrid from '@/components/dealers/DealerGrid';
import EmptyDealerState from '@/components/dealers/EmptyDealerState';
import { supabase } from '@/lib/supabase';

const Dealers = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [dealers, setDealers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDealers = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('dealers')
        .select('*')
        .eq('verification_status', 'verified')
        .order('created_at', { ascending: false });
      if (error) {
        setError('Failed to load dealers.');
        setLoading(false);
        return;
      }
      if (data) {
        setDealers(
          data.map((dealer: any) => ({
            id: dealer.id,
            name: dealer.business_name,
            contactPerson: dealer.contact_person,
            businessCategory: dealer.business_category || '',
            specialization: dealer.specialization || 'All Brands',
            location: dealer.shop_address,
            establishmentYear: dealer.establishment_year ? dealer.establishment_year.toString() : '',
            carsInStock: 0, // TODO: fetch real count if needed
            verified: dealer.verification_status === 'verified',
            brands: dealer.brands_deal_with || [],
            shopPhoto: '', // TODO: fetch from dealer_documents if needed
          }))
        );
      }
      setLoading(false);
    };
    fetchDealers();
  }, []);

  // Filter dealers based on selected filters
  const filteredDealers = dealers.filter(dealer => {
    const locationMatch = !selectedLocation || selectedLocation === 'All Locations' || 
                         dealer.location.toLowerCase() === selectedLocation.toLowerCase();
    const brandMatch = !selectedBrand || selectedBrand === 'All Brands' || 
                      dealer.brands.some((brand: string) => brand.toLowerCase() === selectedBrand.toLowerCase());
    return locationMatch && brandMatch;
  });

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
            {loading ? 'Loading dealers...' : `Showing ${filteredDealers.length} of ${dealers.length} dealers`}
          </p>
        </div>
        {/* Dealers Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading dealers...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-500">{error}</div>
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
