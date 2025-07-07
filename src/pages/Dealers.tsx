
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Car, Phone, Shield, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dealers = () => {
  const dealers = [1, 2, 3, 4, 5, 6]; // Mock data

  return (
    <ResponsiveLayout>
      <div className="bg-white min-h-screen">
        <div className="desktop-page-container">
          {/* Header with CTA - Desktop generous spacing */}
          <div className="desktop-header-section">
            <div className="flex flex-col md:flex-row md:items-center justify-between desktop-content-spacing">
              <div>
                <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Authorized Dealers</h1>
                <p className="text-gray-600 text-base md:text-lg">Find trusted dealers near you</p>
              </div>
              <Link to="/dealer-register">
                <Button className="mt-4 md:mt-0 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-3 shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Become a Dealer
                </Button>
              </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <select className="border rounded-lg px-4 py-2">
                <option>All Locations</option>
                <option>Mumbai</option>
                <option>Delhi</option>
                <option>Bangalore</option>
              </select>
              <select className="border rounded-lg px-4 py-2">
                <option>All Brands</option>
                <option>Maruti Suzuki</option>
                <option>Hyundai</option>
                <option>Tata</option>
              </select>
              <Button variant="outline">Apply Filters</Button>
            </div>
          </div>

          {/* Dealers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-gap-standard">
            {dealers.map((item) => (
              <Card key={item} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg mb-1">CarMax Motors</h3>
                      <div className="flex items-center text-amber-500 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                        <span className="ml-2 text-gray-600 text-sm">4.8 (234 reviews)</span>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">Andheri West, Mumbai</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Car className="h-4 w-4 mr-2" />
                      <span className="text-sm">150+ cars in stock</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <span className="text-sm">Responds in 30 mins</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {['Maruti Suzuki', 'Hyundai', 'Tata'].map((brand) => (
                      <Badge key={brand} variant="outline" className="text-xs">
                        {brand}
                      </Badge>
                    ))}
                  </div>

                  <div>
                    <Link to={`/dealer/${item}/inventory`}>
                      <Button className="w-full">View Inventory</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Bottom CTA for Mobile */}
          <div className="mt-12 text-center md:hidden">
            <Link to="/dealer-register">
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-4 text-lg shadow-lg">
                <Plus className="h-5 w-5 mr-2" />
                Join as a Dealer
              </Button>
            </Link>
            <p className="text-sm text-gray-600 mt-2">Grow your business with us</p>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Dealers;
