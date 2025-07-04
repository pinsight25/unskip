
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Car, Phone, Shield } from 'lucide-react';

const Dealers = () => {
  const dealers = [1, 2, 3, 4, 5, 6]; // Mock data

  return (
    <ResponsiveLayout>
      <div className="pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Authorized Dealers</h1>
              <p className="text-gray-600">Find trusted dealers near you</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
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

            {/* Dealers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                    <div className="space-y-2">
                      <Button className="w-full">View Inventory</Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm">Call Now</Button>
                        <Button variant="outline" size="sm">Get Directions</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default Dealers;
