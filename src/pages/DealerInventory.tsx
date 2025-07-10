
import { useParams, Link } from 'react-router-dom';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { mockCars } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import DealerHeader from '@/components/dealer/DealerHeader';
import DealerInventoryHeader from '@/components/dealer/DealerInventoryHeader';
import DealerInventoryGrid from '@/components/dealer/DealerInventoryGrid';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';

const DealerInventory = () => {
  const { dealerId } = useParams();
  const [sortBy, setSortBy] = useState('');
  
  // Mock dealer data with actual form data - in real app this would come from API
  const dealer = {
    id: dealerId || '1',
    name: 'CarMax Motors',
    contactPerson: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'contact@carmaxmotors.com',
    businessCategory: 'New & Used Cars',
    specialization: 'All Brands',
    rating: 4.8,
    reviewCount: 234,
    location: 'Andheri West, Mumbai',
    establishmentYear: '2010',
    carsInStock: 0, // Dynamic count based on actual listings
    responseTime: '30 mins',
    verified: true,
    brands: ['Maruti Suzuki', 'Hyundai', 'Tata']
  };

  // Filter cars by dealer - in real app this would be API call
  const dealerCars = mockCars.filter(car => car.seller.type === 'dealer').slice(0, 12);
  
  // Update dealer's car count with actual listings
  dealer.carsInStock = dealerCars.length;
  
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

  return (
    <ResponsiveLayout>
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Breadcrumb - Desktop Only */}
          <Breadcrumb className="py-4 hidden md:block">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dealers">Dealers</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{dealer.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Back Button for Mobile */}
          <div className="md:hidden py-3">
            <Link 
              to="/dealers" 
              className="flex items-center text-primary font-medium hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dealers
            </Link>
          </div>

          {/* Dealer Header */}
          <DealerHeader dealer={dealer} />

          {/* Inventory Header */}
          <DealerInventoryHeader 
            carsCount={sortedCars.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Cars Grid */}
          <DealerInventoryGrid cars={sortedCars} />

          {/* Load More Button */}
          {sortedCars.length > 0 && (
            <div className="text-center mt-12 md:mt-20 pb-8">
              <Button variant="outline" size="lg" className="min-h-[48px]">
                Load More Cars
              </Button>
            </div>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default DealerInventory;
