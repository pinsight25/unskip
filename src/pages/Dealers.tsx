
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Car, Phone, Shield, Plus, Star, Calendar, Building2, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dealers = () => {
  const dealers = [
    {
      id: 1,
      name: 'CarMax Motors',
      contactPerson: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'contact@carmaxmotors.com',
      businessCategory: 'New & Used Cars',
      specialization: 'All Brands',
      location: 'Andheri West, Mumbai',
      establishmentYear: '2010',
      stock: '0 cars',
      responseTime: '30 mins',
      brands: ['Maruti Suzuki', 'Hyundai', 'Tata'],
      verified: true,
      rating: 4.8,
      reviewCount: 234,
      shopPhoto: 'https://images.unsplash.com/photo-1562016600-ece13e8ba570?w=400&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'Premium Auto Hub',
      contactPerson: 'Arjun Mehta',
      phone: '+91 98765 43211',
      email: 'arjun@premiumautohub.com',
      businessCategory: 'Specialized',
      specialization: 'Luxury Cars',
      location: 'Bandra East, Mumbai',
      establishmentYear: '2015',
      stock: '0 cars',
      responseTime: '15 mins',
      brands: ['BMW', 'Audi', 'Mercedes'],
      verified: true,
      rating: 4.9,
      reviewCount: 156,
      shopPhoto: 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=400&h=200&fit=crop'
    },
    {
      id: 3,
      name: 'City Car Center',
      contactPerson: 'Priya Sharma',
      phone: '+91 98765 43212',
      email: 'priya@citycarcentre.com',
      businessCategory: 'New & Used Cars',
      specialization: 'Budget Cars',
      location: 'Powai, Mumbai',
      establishmentYear: '2008',
      stock: '0 cars',
      responseTime: '45 mins',
      brands: ['Honda', 'Toyota', 'Nissan'],
      verified: true,
      rating: 4.6,
      reviewCount: 89,
      shopPhoto: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop'
    },
    {
      id: 4,
      name: 'Elite Motors',
      contactPerson: 'Suresh Patel',
      phone: '+91 98765 43213',
      email: 'suresh@elitemotors.com',
      businessCategory: 'Used Cars Only',
      specialization: 'All Brands',
      location: 'Goregaon West, Mumbai',
      establishmentYear: '2012',
      stock: '0 cars',
      responseTime: '1 hour',
      brands: ['Mahindra', 'Ford', 'Renault'],
      verified: false,
      rating: 4.2,
      reviewCount: 67,
      shopPhoto: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop'
    },
    {
      id: 5,
      name: 'Royal Car Palace',
      contactPerson: 'Vikram Singh',
      phone: '+91 98765 43214',
      email: 'vikram@royalcarpalace.com',
      businessCategory: 'New Cars Only',
      specialization: 'Electric',
      location: 'Thane West, Mumbai',
      establishmentYear: '2018',
      stock: '0 cars',
      responseTime: '20 mins',
      brands: ['Kia', 'Skoda', 'Volkswagen'],
      verified: true,
      rating: 4.7,
      reviewCount: 134,
      shopPhoto: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400&h=200&fit=crop'
    },
    {
      id: 6,
      name: 'Metro Auto Sales',
      contactPerson: 'Ravi Kumar',
      phone: '+91 98765 43215',
      email: 'ravi@metroautosales.com',
      businessCategory: 'Used Cars Only',
      specialization: 'Budget Cars',
      location: 'Malad West, Mumbai',
      establishmentYear: '2005',
      stock: '0 cars',
      responseTime: '35 mins',
      brands: ['Jeep', 'MG', 'Tata'],
      verified: true,
      rating: 4.4,
      reviewCount: 92,
      shopPhoto: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400&h=200&fit=crop'
    }
  ];

  const getSpecializationColor = (specialization: string) => {
    switch (specialization) {
      case 'Luxury Cars':
        return 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-800 border-purple-300';
      case 'Budget Cars':
        return 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-green-300';
      case 'Electric':
        return 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-blue-300';
      default:
        return 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
        <div className="max-width-container-wide py-8 lg:py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 lg:mb-8">
            <div>
              <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Authorized Dealers</h1>
              <p className="text-gray-600 text-base md:text-lg">Find trusted dealers near you</p>
            </div>
            <Link to="/dealer/register">
              <Button className="mt-4 md:mt-0 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-6 py-3 shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                Become a Dealer
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap gap-4">
            <select className="border rounded-lg px-4 py-2 bg-white shadow-sm">
              <option>All Locations</option>
              <option>Mumbai</option>
              <option>Delhi</option>
              <option>Bangalore</option>
            </select>
            <select className="border rounded-lg px-4 py-2 bg-white shadow-sm">
              <option>All Brands</option>
              <option>Maruti Suzuki</option>
              <option>Hyundai</option>
              <option>Tata</option>
            </select>
            <Button variant="outline" className="shadow-sm">Apply Filters</Button>
          </div>
        </div>
      </div>

      <div className="max-width-container-wide py-6 lg:py-8 pb-24 lg:pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dealers.map((dealer) => (
            <Card key={dealer.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg">
              {/* Shop Photo Header */}
              <div className="relative h-32 bg-gradient-to-r from-gray-200 to-gray-300">
                {dealer.shopPhoto && (
                  <img
                    src={dealer.shopPhoto}
                    alt={`${dealer.name} shop`}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/20"></div>
                
                {/* Verified Badge */}
                {dealer.verified && (
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-green-500/90 text-white backdrop-blur-sm border-0">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                )}

                {/* Rating */}
                <div className="absolute bottom-3 left-3 flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Star className="h-3 w-3 text-yellow-500 fill-current mr-1" />
                  <span className="text-xs font-medium">{dealer.rating}</span>
                  <span className="text-xs text-gray-500 ml-1">({dealer.reviewCount})</span>
                </div>
              </div>

              <CardContent className="p-6">
                {/* Header Info */}
                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-1">{dealer.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <Calendar className="h-3 w-3 mr-1" />
                    Since {dealer.establishmentYear}
                  </div>
                </div>

                {/* Specialization Badge */}
                <div className="mb-4">
                  <Badge className={`${getSpecializationColor(dealer.specialization)} border font-medium`}>
                    {dealer.specialization}
                  </Badge>
                </div>

                {/* Key Info Cards */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm font-medium">{dealer.location}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center bg-blue-50 p-3 rounded-lg">
                      <Car className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="text-sm font-medium">{dealer.stock}</span>
                    </div>
                    <div className="flex items-center bg-green-50 p-3 rounded-lg">
                      <Phone className="h-4 w-4 mr-2 text-green-600" />
                      <span className="text-sm font-medium">{dealer.responseTime}</span>
                    </div>
                  </div>
                </div>

                {/* Contact Person */}
                <div className="mb-4 bg-orange-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-orange-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{dealer.contactPerson}</p>
                      <p className="text-xs text-gray-600">{dealer.businessCategory}</p>
                    </div>
                  </div>
                </div>

                {/* Brands */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Brands Available</h4>
                  <div className="flex flex-wrap gap-1">
                    {dealer.brands.map((brand) => (
                      <Badge key={brand} variant="outline" className="text-xs px-2 py-1">
                        {brand}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Link to={`/dealers/${dealer.id}`}>
                  <Button className="w-full bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-600 text-white font-semibold shadow-lg">
                    View Inventory
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA for Mobile */}
        <div className="mt-12 text-center md:hidden">
          <Link to="/dealer/register">
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold px-8 py-4 text-lg shadow-lg">
              <Plus className="h-5 w-5 mr-2" />
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
