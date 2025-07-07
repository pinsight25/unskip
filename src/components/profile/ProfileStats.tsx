
import { Card } from '@/components/ui/card';
import { Eye, Car, MessageCircle } from 'lucide-react';

interface ProfileStatsProps {
  stats: {
    totalViews: number;
    activeListings: number;
    totalOffers: number;
  };
}

const ProfileStats = ({ stats }: ProfileStatsProps) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="grid grid-cols-3 gap-4 section-gap">
        <Card className="p-4 text-center">
          <Eye className="h-6 w-6 text-primary mx-auto mb-2" />
          <p className="text-2xl font-bold">{stats.totalViews}</p>
          <p className="text-sm text-gray-600">Total Views</p>
        </Card>
        <Card className="p-4 text-center">
          <Car className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{stats.activeListings}</p>
          <p className="text-sm text-gray-600">Active Listings</p>
        </Card>
        <Card className="p-4 text-center">
          <MessageCircle className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold">{stats.totalOffers}</p>
          <p className="text-sm text-gray-600">Offers Received</p>
        </Card>
      </div>
    </div>
  );
};

export default ProfileStats;
