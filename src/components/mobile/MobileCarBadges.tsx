
import { Badge } from '@/components/ui/badge';
import { Award, Shield } from 'lucide-react';

interface MobileCarBadgesProps {
  featured?: boolean;
  verified?: boolean;
}

const MobileCarBadges = ({ featured, verified }: MobileCarBadgesProps) => {
  if (!featured && !verified) return null;

  return (
    <div className="absolute top-3 left-3 flex flex-col gap-1">
      {featured && (
        <Badge className="bg-orange-500 text-white text-xs font-medium px-2 py-1">
          <Award className="h-3 w-3 mr-1" />
          Featured
        </Badge>
      )}
      {verified && (
        <Badge className="bg-green-500 text-white text-xs font-medium px-2 py-1">
          <Shield className="h-3 w-3 mr-1" />
          Verified
        </Badge>
      )}
    </div>
  );
};

export default MobileCarBadges;
