
import { useParams, Link } from 'react-router-dom';
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Car } from '@/types/car';
import { mockCars } from '@/data/mockData';
import CarCard from '@/components/car/CarCard';
import MobileCarCard from '@/components/mobile/MobileCarCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ShareButton from '@/components/ui/ShareButton';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from '@/components/ui/breadcrumb';
import { Star, MapPin, Car as CarIcon, Phone, Shield, ArrowLeft } from 'lucide-react';
import { useState, useEffect } from 'react';

const DealerInventory = () => {
  const { dealerId } = useParams();
  const [isMobile, setIsMobile] = useState(false);
  const [sortBy, setSortBy] = useState('');
  
  // Mock dealer data - in real app this would come from API
  const dealer = {
    id: dealerId || '1',
    name: 'CarMax Motors',
    rating: 4.8,
    reviewCount: 234,
    location: 'Andheri West, Mumbai',
    carsInStock: 150,
    responseTime: '30 mins',
    verified: true,
    brands: ['Maruti Suzuki', 'Hyundai', 'Tata']
  };

  // Filter cars by dealer - in real app this would be API call
  const dealerCars = mockCars.filter(car => car.seller.type === 'dealer').slice(0, 12);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
        <div className="desktop-page-container">
          {/* Breadcrumb - Desktop Only */}
          <Breadcrumb className="desktop-content-spacing hidden md:block">
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
          <div className="md:hidden px-4 py-3">
            <Link 
              to="/dealers" 
              className="flex items-center text-primary font-medium element-gap hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dealers
            </Link>
          </div>

          {/* Dealer Header */}
          <div className="bg-white border border-gray-200 rounded-lg mx-4 md:mx-0 mb-6 p-4 md:p-8 desktop-header-section shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
              <div className="flex-1">
                {/* Mobile: Stack dealer name and badges vertically */}
                <div className="md:flex md:items-center md:gap-3 mb-4 md:mb-6">
                  <h1 className="text-xl md:text-4xl font-bold mb-3 md:mb-0">{dealer.name}</h1>
                  <div className="flex items-center gap-2">
                    {dealer.verified && (
                      <Badge className="bg-green-100 text-green-700 text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                    <ShareButton 
                      dealerName={dealer.name}
                      dealerId={dealer.id}
                      carsCount={dealer.carsInStock}
                      className="text-xs h-8"
                    />
                  </div>
                </div>
                
                <div className="flex items-center text-amber-500 mb-4 md:mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                  <span className="ml-2 text-gray-600 text-sm md:text-base">
                    {dealer.rating} ({dealer.reviewCount} reviews)
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-6 text-gray-600 mb-4 md:mb-6">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm md:text-base">{dealer.location}</span>
                  </div>
                  <div className="flex items-center">
                    <CarIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm md:text-base">{dealer.carsInStock}+ cars in stock</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm md:text-base">Responds in {dealer.responseTime}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {dealer.brands.map((brand) => (
                    <Badge key={brand} variant="outline" className="text-xs">
                      {brand}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons - Full width on mobile, side by side on desktop */}
              <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                <Button variant="outline" size="lg" className="w-full md:w-auto min-h-[48px]">
                  Call Now
                </Button>
                <Button variant="outline" size="lg" className="w-full md:w-auto min-h-[48px]">
                  Get Directions
                </Button>
              </div>
            </div>
          </div>

          {/* Inventory Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center desktop-header-section gap-4 md:gap-6 px-4 md:px-0">
            <div>
              <h2 className="text-xl md:text-2xl font-semibold mb-2">Available Inventory</h2>
              <p className="text-gray-600 text-base md:text-lg">{sortedCars.length} cars available</p>
            </div>
            
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border rounded px-3 py-2 text-sm md:text-base w-full sm:w-auto h-12"
            >
              <option value="">Sort by: Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="year_desc">Year: Newest First</option>
              <option value="mileage_asc">Mileage: Best First</option>
            </select>
          </div>

          {/* Cars Grid */}
          <div className="w-full px-4 md:px-0">
            {sortedCars.length > 0 ? (
              isMobile ? (
                <div className="space-y-4">
                  {sortedCars.map((car) => (
                    <MobileCarCard 
                      key={car.id} 
                      car={car} 
                      onSave={() => {}}
                      isSaved={false}
                      onMakeOffer={() => {}}
                      onChat={() => {}}
                      onTestDrive={() => {}}
                      offerStatus="none"
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 grid-gap-standard w-full">
                  {sortedCars.map((car) => (
                    <CarCard 
                      key={car.id} 
                      car={car} 
                      onSave={() => {}}
                      isSaved={false}
                    />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12 md:py-20">
                <h3 className="text-lg md:text-xl font-semibold mb-2">No cars available</h3>
                <p className="text-gray-600 mb-4 text-base md:text-lg">This dealer currently has no cars in stock</p>
                <Link to="/dealers">
                  <Button size="lg">Browse Other Dealers</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {sortedCars.length > 0 && (
            <div className="text-center mt-12 md:mt-20 px-4 md:px-0">
              <Button variant="outline" size="lg">
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
