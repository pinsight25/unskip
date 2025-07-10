
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
  
  // Mock dealer data with enhanced information
  const dealer = {
    id: dealerId || '1',
    name: 'CarMax Motors',
    contactPerson: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'contact@carmaxmotors.com',
    businessCategory: 'New & Used Cars',
    specialization: 'All Brands',
    location: 'Andheri West, Mumbai',
    establishmentYear: '2010',
    carsInStock: 0,
    verified: true,
    brands: ['Maruti Suzuki', 'Hyundai', 'Tata'],
    shopPhoto: 'https://images.unsplash.com/photo-1562016600-ece13e8ba570?w=800&h=300&fit=crop'
  };

  // Filter cars by dealer
  const dealerCars = mockCars.filter(car => car.seller.type === 'dealer').slice(0, 12);
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
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {/* Breadcrumb - Desktop Only */}
          <Breadcrumb className="py-3 hidden md:block">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/dealers" className="hover:text-primary transition-colors">Dealers</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-medium">{dealer.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Back Button for Mobile */}
          <div className="md:hidden py-2">
            <Link 
              to="/dealers" 
              className="flex items-center text-primary font-medium hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dealers
            </Link>
          </div>

          {/* Enhanced Dealer Header */}
          <DealerHeader dealer={dealer} />

          {/* Inventory Section */}
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

          {/* Load More Button */}
          {sortedCars.length > 0 && (
            <div className="text-center mt-8 md:mt-12 pb-8">
              <Button 
                variant="outline" 
                size="lg" 
                className="shadow-md hover:shadow-lg transition-all duration-300"
              >
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
