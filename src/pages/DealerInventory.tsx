
import { useParams, Link } from 'react-router-dom';
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
import { findDealerByIdOrSlug } from '@/data/dealers';

const DealerInventory = () => {
  const { dealerId } = useParams();
  const [sortBy, setSortBy] = useState('');
  
  console.log('DealerInventory rendered with dealerId:', dealerId);
  
  // Find dealer by ID or slug
  const dealer = findDealerByIdOrSlug(dealerId || '1');
  console.log('Final dealer found:', dealer?.name);

  // Fallback if dealer not found
  if (!dealer) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Dealer Not Found</h1>
            <p className="text-gray-600 mb-6">The dealer you're looking for doesn't exist.</p>
            <Link to="/dealers">
              <Button>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dealers
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
  );
};

export default DealerInventory;
