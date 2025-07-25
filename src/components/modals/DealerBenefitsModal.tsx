import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  Shield, 
  BarChart3, 
  Users, 
  Star,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DealerBenefitsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const benefits = [
  {
    icon: <Store className="h-5 w-5" />,
    title: 'Unlimited Listings',
    description: 'Post as many cars as you want',
    highlight: true
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: 'Verified Badge',
    description: 'Build trust with verified dealer status',
    highlight: true
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: 'Business Analytics',
    description: 'Track views, inquiries, and performance',
    highlight: false
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: 'Priority Support',
    description: 'Get faster customer support',
    highlight: false
  },
  {
    icon: <Star className="h-5 w-5" />,
    title: 'Featured Listings',
    description: 'Your cars appear first in search results',
    highlight: false
  }
];

const DealerBenefitsModal = ({ isOpen, onClose }: DealerBenefitsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            Unlock Dealer Benefits
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-center text-gray-600">
            Complete your dealer registration to access powerful business tools and grow your sales.
          </p>
          
          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div 
                key={index} 
                className={`flex items-start gap-3 p-3 rounded-lg ${
                  benefit.highlight 
                    ? 'bg-orange-50 border border-orange-200' 
                    : 'bg-gray-50'
                }`}
              >
                <div className={`p-1 rounded ${
                  benefit.highlight ? 'text-orange-600' : 'text-gray-600'
                }`}>
                  {benefit.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm">{benefit.title}</h4>
                    {benefit.highlight && (
                      <Badge variant="outline" className="text-xs">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Quick & Easy Setup</span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Complete registration in just 5 minutes with basic business details.
            </p>
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Link to="/dealer/register" className="flex-1">
              <Button 
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={onClose}
              >
                Get Started
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DealerBenefitsModal; 