
import { Card } from '@/components/ui/card';
import { Eye, Car, Package, MessageCircle } from 'lucide-react';

interface ProfileStatsProps {
  stats: {
    totalViews: number;
    activeCarListings: number;
    activeAccessoryListings: number;
    offersReceived: number;
  };
}

const ProfileStats = ({ stats }: ProfileStatsProps) => {
  // Simple stats for all users (no dealer-specific analytics)
  const baseStats = [
    {
      icon: <Eye className="h-5 w-5 md:h-6 md:w-6 text-primary" />,
      value: stats.totalViews,
      label: 'Total Views',
      color: 'text-primary'
    },
    {
      icon: <Car className="h-5 w-5 md:h-6 md:w-6 text-green-600" />,
      value: stats.activeCarListings,
      label: 'Active Cars',
      color: 'text-green-600'
    },
    {
      icon: <Package className="h-5 w-5 md:h-6 md:w-6 text-orange-600" />,
      value: stats.activeAccessoryListings,
      label: 'Active Accessories',
      color: 'text-orange-600'
    },
    {
      icon: <MessageCircle className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />,
      value: stats.offersReceived,
      label: 'Offers Received',
      color: 'text-blue-600'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {baseStats.map((stat, index) => (
          <Card key={index} className="p-3 md:p-4 text-center">
            <div className={`mx-auto mb-2 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
            <p className="text-xs md:text-sm text-gray-600">{stat.label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProfileStats;
