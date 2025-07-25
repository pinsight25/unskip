import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, AlertCircle, MessageCircle, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DealerRegistrationPromptProps {
  userType?: 'regular' | 'premium' | 'dealer';
  dealerRegistrationCompleted?: boolean;
}

const DealerRegistrationPrompt = ({ userType, dealerRegistrationCompleted }: DealerRegistrationPromptProps) => {
  if (userType !== 'dealer' || dealerRegistrationCompleted) {
    return null;
  }

  const supportFeatures = [
    {
      icon: <MessageCircle className="h-4 w-4" />,
      title: 'WhatsApp',
      action: () => {
        const phoneNumber = '919876543210';
        const message = 'Hi! I need dealer support for Unskip.';
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      }
    },
    {
      icon: <Phone className="h-4 w-4" />,
      title: 'Call',
      action: () => {
        window.open('tel:+919876543210', '_self');
      }
    },
    {
      icon: <Mail className="h-4 w-4" />,
      title: 'Email',
      action: () => {
        window.open('mailto:hello@unskip.com?subject=Dealer Support Request', '_self');
      }
    }
  ];

  return (
    <Card className="p-6 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
      <div className="flex flex-col md:flex-row items-start gap-6">
        {/* Main Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="h-5 w-5 text-orange-600" />
            <h3 className="font-semibold text-lg text-orange-900">Complete Your Dealer Registration</h3>
          </div>
          
          <p className="text-sm text-orange-800 mb-4">
            To unlock unlimited car listings and access dealer features, please complete your business registration.
          </p>
          
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2 text-sm text-orange-700">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
              <span>Upload business documents</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-orange-700">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
              <span>Verify your business details</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-orange-700">
              <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
              <span>Get verified dealer badge</span>
            </div>
          </div>

          {/* Support Section */}
          <div className="border-t border-orange-200 pt-4">
            <h4 className="font-medium text-sm text-orange-900 mb-3">Need Help? Contact Support:</h4>
            <div className="flex gap-2">
              {supportFeatures.map((feature, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={feature.action}
                  className="flex items-center gap-2 border-orange-300 text-orange-700 hover:bg-orange-100 hover:border-orange-400"
                >
                  {feature.icon}
                  <span className="text-xs font-medium">{feature.title}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="md:flex-shrink-0">
          <Link to="/dealer/register">
            <Button 
              size="lg"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3"
            >
              <Store className="h-4 w-4 mr-2" />
              Complete Registration
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default DealerRegistrationPrompt; 