
import { Shield, Clock, Fuel, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RentalTermsProps {
  rentPolicies: {
    securityDeposit: number;
    fuelPolicy: 'full-to-full' | 'pay-for-fuel';
    kmLimit: number;
    insuranceIncluded: boolean;
    minRentalPeriod: number;
  };
}

const RentalTerms = ({ rentPolicies }: RentalTermsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Rental Terms</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-sm font-medium">Security Deposit</p>
              <p className="text-sm text-gray-600">₹{rentPolicies.securityDeposit.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-sm font-medium">Minimum Period</p>
              <p className="text-sm text-gray-600">{rentPolicies.minRentalPeriod} day(s)</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-sm font-medium">Fuel Policy</p>
              <p className="text-sm text-gray-600">
                {rentPolicies.fuelPolicy === 'full-to-full' ? 'Full to Full' : 'Pay for Fuel'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-sm font-medium">Insurance</p>
              <p className="text-sm text-gray-600">
                {rentPolicies.insuranceIncluded ? 'Included' : 'Not Included'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Daily KM Limit:</span> {rentPolicies.kmLimit} km
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RentalTerms;
