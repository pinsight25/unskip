
import { Badge } from '@/components/ui/badge';
import { Award, Shield, Building2 } from 'lucide-react';

interface MobileCarBadgesProps {
  featured?: boolean;
  verified?: boolean;
  seller_type?: 'individual' | 'dealer';
  dealerVerified?: boolean;
}

const MobileCarBadges = ({ featured, verified, seller_type, dealerVerified }: MobileCarBadgesProps) => {
  if (!featured && !verified && !seller_type) return null;

  return (
    <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
      {featured && (
        <Badge className="bg-amber-500 text-white text-xs font-medium px-2 py-1 shadow-lg">
          <Award className="h-3 w-3 mr-1" />
          Featured
        </Badge>
      )}
      {verified && (
        <Badge className="bg-green-500 text-white text-xs font-medium px-2 py-1 shadow-lg">
          <Shield className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      )}
      {/* Dealer verification badge - use seller_type only */}
      {seller_type === 'dealer' && dealerVerified === true && (
        <Badge className="bg-blue-500 text-white text-xs px-2 py-1 font-medium rounded-md shadow-lg">
          <Building2 className="h-3 w-3 mr-1" />
          Verified Dealer
        </Badge>
      )}
      {seller_type === 'dealer' && dealerVerified === false && (
        <Badge className="bg-gray-500 text-white text-xs px-2 py-1 font-medium rounded-md shadow-lg">
          <Building2 className="h-3 w-3 mr-1" />
          Unverified Dealer
        </Badge>
      )}
      {/* No dealer badge for individual/owner */}
    </div>
  );
};

export default MobileCarBadges;
