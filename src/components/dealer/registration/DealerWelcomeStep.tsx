import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Store, 
  Shield, 
  BarChart3, 
  Users, 
  Star,
  CheckCircle,
  ArrowRight,
  Clock,
  FileText
} from 'lucide-react';

interface DealerWelcomeStepProps {
  onContinue: () => void;
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
    title: 'View Analytics',
    description: 'Track views and performance for each listing',
    highlight: false
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: 'Priority Support',
    description: 'WhatsApp support & dedicated chat system',
    highlight: false
  }
];

const requirements = [
  {
    icon: <FileText className="h-4 w-4" />,
    text: 'Business documents (GST, PAN, etc.)'
  },
  {
    icon: <Clock className="h-4 w-4" />,
    text: 'Takes only 5-10 minutes to complete'
  },
  {
    icon: <CheckCircle className="h-4 w-4" />,
    text: 'Verification within 24-48 hours'
  }
];

const DealerWelcomeStep = ({ onContinue }: DealerWelcomeStepProps) => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
          <Store className="h-8 w-8 text-orange-600" />
        </div>
        <h2 className="text-xl md:text-2xl font-bold mb-2">Welcome to Dealer Registration!</h2>
        <p className="text-sm md:text-base text-gray-600">
          Let's set up your dealer account to unlock powerful business tools and grow your sales.
        </p>
      </div>

      {/* Benefits Section */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-orange-500" />
            Dealer Benefits
          </h3>
          <div className="grid gap-3">
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
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm break-words">{benefit.title}</h4>
                    {benefit.highlight && (
                      <Badge variant="outline" className="text-xs whitespace-nowrap">
                        Popular
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 break-words">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Requirements Section */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <h3 className="font-semibold mb-4">What You'll Need</h3>
          <div className="space-y-3">
            {requirements.map((req, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="text-gray-600 flex-shrink-0">
                  {req.icon}
                </div>
                <span className="text-sm text-gray-700 break-words">{req.text}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Process Steps */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <h3 className="font-semibold mb-4">Registration Process</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">
                1
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-sm break-words">Business Information</h4>
                <p className="text-xs text-gray-600 break-words">Basic business details and contact information</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">
                2
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-sm break-words">Legal & Location</h4>
                <p className="text-xs text-gray-600 break-words">Address, documents, and verification details</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">
                3
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium text-sm break-words">Document Upload</h4>
                <p className="text-xs text-gray-600 break-words">Upload required business documents and photos</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Button */}
      <Button 
        onClick={onContinue}
        className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-semibold"
      >
        Start Registration
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>

      <p className="text-xs text-gray-500 text-center">
        By continuing, you agree to our terms and verification process.
      </p>
    </div>
  );
};

export default DealerWelcomeStep; 