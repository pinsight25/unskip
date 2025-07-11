
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PricingAlert } from '@/types/car';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';

interface PricingAlertDisplayProps {
  pricingAlert: PricingAlert;
}

const PricingAlertDisplay = ({ pricingAlert }: PricingAlertDisplayProps) => {
  return (
    <Alert className={`border-2 rounded-2xl ${
      pricingAlert.type === 'blocked' 
        ? 'border-red-500 bg-red-50' 
        : pricingAlert.type === 'warning'
        ? 'border-orange-500 bg-orange-50'
        : 'border-green-500 bg-green-50'
    }`}>
      <div className="flex items-start space-x-3">
        {pricingAlert.type === 'blocked' && <X className="h-5 w-5 text-red-600 mt-0.5" />}
        {pricingAlert.type === 'warning' && <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />}
        {pricingAlert.type === 'fair' && <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />}
        <div className="flex-1">
          <AlertDescription className={`font-semibold text-base ${
            pricingAlert.type === 'blocked' 
              ? 'text-red-800' 
              : pricingAlert.type === 'warning'
              ? 'text-orange-800'
              : 'text-green-800'
          }`}>
            {pricingAlert.message}
          </AlertDescription>
          {pricingAlert.percentageDiff > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              Your offer is {pricingAlert.percentageDiff.toFixed(1)}% below asking price
            </p>
          )}
        </div>
      </div>
    </Alert>
  );
};

export default PricingAlertDisplay;
