
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertCircle, Plus, Car, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatPhoneForDB, formatPhoneForAuth } from '@/utils/phoneUtils';

const DealerProfile = () => {
  const { dealerSlug } = useParams();
  
  // Mock dealer data - in real app this would be fetched based on slug
  const dealerData = {
    id: 'dealer-123',
    slug: dealerSlug,
    businessName: 'Premium Auto Solutions',
    contactPerson: 'John Doe',
    email: 'john@premiumauto.com',
    phone: '+91 98765 43210',
    status: 'pending', // pending, verified, rejected
    address: '123 Main Street, Mumbai, Maharashtra 400001',
    brands: ['Maruti Suzuki', 'Hyundai', 'Toyota'],
    specialization: 'New & Used Cars',
    memberSince: '2024-01-15',
    totalListings: 0, // New dealer
    totalSales: 0
  };

  const isPending = dealerData.status === 'pending';
  const isVerified = dealerData.status === 'verified';

  return (
    <div className="bg-white min-h-screen">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/5 to-orange-100/30 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 lg:px-6 xl:px-8 py-6 lg:py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {dealerData.businessName}
            </h1>
            <p className="text-base md:text-lg text-gray-600">
              Dealer Profile & Listings
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 lg:px-6 xl:px-8 py-6 lg:py-8 pb-24 lg:pb-8">
        {/* Pending Verification Banner */}
        {isPending && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Your dealer profile is pending verification.</strong> We'll review your application and get back to you within 2-3 business days. You can start posting listings, but they'll show as "Unverified Dealer" until approved.
            </AlertDescription>
          </Alert>
        )}

        {/* Dealer Info Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{dealerData.businessName}</h2>
              <p className="text-gray-600 mb-1">Contact Person: {dealerData.contactPerson}</p>
              <p className="text-gray-600 mb-1">Email: {dealerData.email}</p>
              <p className="text-gray-600 mb-1">Phone: {formatPhoneForAuth(dealerData.phone)}</p>
              <p className="text-gray-600 mb-4">Address: {dealerData.address}</p>
            </div>
            <div className="text-right">
              {isVerified ? (
                <Badge className="bg-green-100 text-green-800 border-green-200 mb-2">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified Dealer
                </Badge>
              ) : (
                <Badge className="bg-orange-100 text-orange-800 border-orange-200 mb-2">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Pending Verification
                </Badge>
              )}
              <p className="text-sm text-gray-500">Member since {new Date(dealerData.memberSince).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{dealerData.totalListings}</div>
              <div className="text-sm text-gray-600">Active Listings</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{dealerData.totalSales}</div>
              <div className="text-sm text-gray-600">Total Sales</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{dealerData.brands.length}</div>
              <div className="text-sm text-gray-600">Brands Supported</div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 mb-6">
          <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/sell-car">
              <Button className="w-full h-16 text-lg" size="lg">
                <Car className="h-6 w-6 mr-3" />
                Post New Car
              </Button>
            </Link>
            <Link to="/post-accessory">
              <Button variant="outline" className="w-full h-16 text-lg" size="lg">
                <Package className="h-6 w-6 mr-3" />
                Post Accessory
              </Button>
            </Link>
          </div>
          {isPending && (
            <p className="text-sm text-orange-600 mt-3 text-center">
              Your listings will show "Unverified Dealer" until your profile is approved
            </p>
          )}
        </Card>

        {/* Business Details */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Business Details</h3>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">Specialization:</span>
              <span className="ml-2">{dealerData.specialization}</span>
            </div>
            <div>
              <span className="font-medium text-gray-700">Brands:</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {dealerData.brands.map((brand, index) => (
                  <Badge key={index} variant="outline">
                    {brand}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DealerProfile;
