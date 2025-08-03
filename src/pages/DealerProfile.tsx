import { useParams, Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertCircle, Plus, Car, Package, Award, Car as CarIcon } from 'lucide-react';
import { formatPhoneForDB, formatPhoneForAuth } from '@/utils/phoneUtils';
import { useCars } from '@/hooks/queries/useCarQueries';
import DealerHeader from '@/components/dealer/DealerHeader';
import DealerInventoryHeader from '@/components/dealer/DealerInventoryHeader';
import DealerInventoryGrid from '@/components/dealer/DealerInventoryGrid';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { ArrowLeft } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import EditDealerProfileModal from '@/components/modals/EditDealerProfileModal';

const DealerProfile = () => {
  const { slug } = useParams();



  // All hooks must be at the top, before any early returns
  const [sortBy, setSortBy] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  // Fetch dealer by slug with specific fields
  const { data: dealer, isLoading: dealerLoading, error: dealerError, refetch } = useQuery({
    queryKey: ['dealer', slug],
    queryFn: async () => {
      // Get the dealer data including shop photos
      const { data: dealerData, error: dealerError } = await supabase
        .from('dealers')
        .select(`
          id, user_id, slug, business_name, contact_person, business_category,
          brands_deal_with, specialization, shop_address, pincode, establishment_year,
          verification_status, total_sales, member_since, created_at, updated_at,
          shop_photos_urls, phone, email, pan_number, aadhaar_last_four, 
          business_doc_type, business_doc_number, business_doc_url, pan_card_url, about
        `)
        .eq('slug', slug)
        .single();

      if (dealerError) {
        throw dealerError;
      }
      
      return dealerData;
    },
    enabled: !!slug,
    retry: 3,
    retryDelay: 2000,
    staleTime: 0, // Always consider data stale
    gcTime: 0, // Don't cache for long
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });



  // Always refetch dealer data on mount or when slug changes
  useEffect(() => {
    if (slug && refetch) {
      refetch();
    }
    // eslint-disable-next-line
  }, [slug]);

  const { data: allCars = [] } = useCars();
  const { user } = useUser();

  useEffect(() => {
    if (dealerLoading && !timedOut) {
      const timeout = setTimeout(() => setTimedOut(true), 10000); // Increased timeout to 10 seconds
      return () => clearTimeout(timeout);
    }
  }, [dealerLoading, timedOut]);



  if (dealerLoading && !timedOut) {
    return <div className="text-center py-12">Loading dealer profile...</div>;
  }
  
  if (dealerError || !dealer || timedOut) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">Dealer not found.</div>
        <div className="text-sm text-gray-600 mb-4">
          Slug: {slug || 'undefined'}
        </div>
        {dealerError && (
          <div className="text-xs text-gray-500">
            Error: {dealerError.message}
          </div>
        )}
        <div className="text-xs text-gray-500 mt-2">
          Loading: {dealerLoading ? 'Yes' : 'No'}, TimedOut: {timedOut ? 'Yes' : 'No'}
        </div>
        <Link to="/dealers">
          <Button variant="outline">Back to Dealers</Button>
        </Link>
      </div>
    );
  }

  const dealerCars = dealer ? allCars.filter(car => String(car.seller.id) === String(dealer.user_id) && car.status === 'active') : [];
  const brands = dealer?.brands_deal_with || [];
  const location = dealer?.shop_address || '';
  const sortedCars = [...dealerCars].sort((a, b) => {
    switch (sortBy) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'year_desc':
        return b.year - a.year;
      case 'mileage_asc':
        return a.mileage - b.mileage;
      default:
        return 0;
    }
  });

  const isPending = dealer?.verification_status === 'pending';
  const isVerified = dealer?.verification_status === 'verified';

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Breadcrumb and Edit Profile */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-6 mb-4">
          {/* Breadcrumb - Desktop and Mobile */}
          <Breadcrumb className="mb-2 md:mb-0">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dealers" className="hover:text-primary transition-colors text-base font-medium">Dealers</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-base">{dealer.business_name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {/* Edit Profile Button (only for dealer owner) */}
          {user && dealer.user_id === user.id && (
            <Button onClick={() => setIsEditModalOpen(true)} variant="outline" className="ml-0 md:ml-4 mt-2 md:mt-0">Edit Profile</Button>
          )}
        </div>
        <DealerHeader dealer={{ 
          id: dealer.id,
          name: dealer.business_name || 'Unknown Dealer',
          contactPerson: dealer.contact_person || '',
          phone: dealer.phone || '',
          email: dealer.email || '',
          businessCategory: dealer.business_category || '',
          specialization: dealer.specialization || 'All Brands',
          location: dealer.shop_address || '',
          establishmentYear: dealer.establishment_year ? dealer.establishment_year.toString() : '',
          carsInStock: dealerCars.length,
          accessoriesInStock: 0,
          verified: dealer.verification_status === 'verified',
          brands: dealer.brands_deal_with || [],
          shopPhoto: '',
          shop_photos_urls: dealer.shop_photos_urls || [],
          slug: dealer.slug || '',
        }} />
        <div className="mt-6">
          <DealerInventoryHeader 
            carsCount={sortedCars.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
          <div className="mt-4">
            <DealerInventoryGrid cars={sortedCars} />
          </div>
        </div>
        {/* Edit Dealer Profile Modal */}
        <EditDealerProfileModal
          key={dealer.id} // Force re-render when dealer changes
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          dealer={dealer}
          onSave={() => {
            setIsEditModalOpen(false);
            refetch();
          }}
        />
      </div>
    </div>
  );
};

export default DealerProfile; 