
import ResponsiveLayout from '@/components/layout/ResponsiveLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Car, Phone, Shield, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dealers = () => {
  const dealers = [
    {
      id: 1,
      name: 'CarMax Motors',
      location: 'Andheri West, Mumbai',
      stock: '150+ cars',
      responseTime: '30 mins',
      brands: ['Maruti Suzuki', 'Hyundai', 'Tata'],
      verified: true
    },
    {
      id: 2,
      name: 'Premium Auto Hub',
      location: 'Bandra East, Mumbai',
      stock: '120+ cars',
      responseTime: '15 mins',
      brands: ['BMW', 'Audi', 'Mercedes'],
      verified: true
    },
    {
      id: 3,
      name: 'City Car Center',
      location: 'Powai, Mumbai',
      stock: '200+ cars',
      responseTime: '45 mins',
      brands: ['Honda', 'Toyota', 'Nissan'],
      verified: true
    },
    {
      id: 4,
      name: 'Elite Motors',
      location: 'Goregaon West, Mumbai',
      stock: '80+ cars',
      responseTime: '1 hour',
      brands: ['Mahindra', 'Ford', 'Renault'],
      verified: false
    },
    {
      id: 5,
      name: 'Royal Car Palace',
      location: 'Thane West, Mumbai',
      stock: '180+ cars',
      responseTime: '20 mins',
      brands: ['Kia', 'Skoda', 'Volkswagen'],
      verified: true
    },
    {
      id: 6,
      name: 'Metro Auto Sales',
      location: 'Malad West, Mumbai',
      stock: '90+ cars',
      responseTime: '35 mins',
      brands: ['Jeep', 'MG', 'Tata'],
      verified: true
    }
  ];

  return (
    <ResponsiveLayout>
      <div className="bg-white min-h-screen">
        {/* Header Section - No extra padding since ResponsiveLayout handles it */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
          <div className="max-width-container-wide py-8 lg:py-12">
            {/* Header with CTA */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 lg:mb-8">
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
              <select className="border rounded-lg px-4 py-2 bg-white">
                <option>All Locations</option>
                <option>Mumbai</option>
                <option>Delhi</option>
                <option>Bangalore</option>
              </select>
              <select className="border rounded-lg px-4 py-2 bg-white">
                <option>All Brands</option>
                <option>Maruti Suzuki</option>
                <option>Hyundai</option>
                <option>Tata</option>
              </select>
              <Button variant="outline">Apply Filters</Button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-width-container-wide py-6 lg:py-8 pb-24 lg:pb-8">
          {/* Dealers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dealers.map((dealer) => (
              <Card key={dealer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{dealer.name}</h3>
                    </div>
                    {dealer.verified && (
                      <Badge className="bg-green-100 text-green-700">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{dealer.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Car className="h-4 w-4 mr-2" />
                      <span className="text-sm">{dealer.stock} in stock</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      <span className="text-sm">Responds in {dealer.responseTime}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {dealer.brands.map((brand) => (
                      <Badge key={brand} variant="outline" className="text-xs">
                        {brand}
                      </Badge>
                    ))}
                  </div>

                  <div>
                    <Link to={`/dealer/${dealer.id}/inventory`}>
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
