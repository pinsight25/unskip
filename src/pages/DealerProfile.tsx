
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
  const { dealerSlug } = useParams();

  // All hooks must be at the top, before any early returns
  const [sortBy, setSortBy] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  // Fetch dealer by slug
  const { data: dealer, isLoading: dealerLoading, error: dealerError, refetch } = useQuery({
    queryKey: ['dealer', dealerSlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dealers')
        .select('*')
        .eq('slug', dealerSlug)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!dealerSlug,
  });

  // Always refetch dealer data on mount or when dealerSlug changes
  useEffect(() => {
    if (dealerSlug && refetch) {
      refetch();
    }
    // eslint-disable-next-line
  }, [dealerSlug]);

  const { data: allCars = [] } = useCars();
  const { user } = useUser();

  useEffect(() => {
    if (dealerLoading && !timedOut) {
      const timeout = setTimeout(() => setTimedOut(true), 5000);
      return () => clearTimeout(timeout);
    }
  }, [dealerLoading, timedOut]);

  if (dealerError) {
    console.error('DealerProfile: dealerError', dealerError);
  }

  if (dealerLoading && !timedOut) {
    return <div className="text-center py-12">Loading dealer profile...</div>;
  }
  if (dealerError || !dealer || timedOut) {
    return <div className="text-center py-12 text-red-500">Dealer not found.</div>;
  }

  const dealerCars = dealer ? allCars.filter(car => String(car.seller.id) === String(dealer.user_id) && car.status === 'active') : [];
  const brands = dealer.brands_deal_with || dealer.brands || [];
  const location = dealer.shop_address || dealer.city || '';
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

  const isPending = dealer?.status === 'pending';
  const isVerified = dealer?.status === 'verified';

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
        <DealerHeader dealer={{ ...dealer, carsInStock: dealerCars.length }} />
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
