
import { TrendingUp, TrendingDown } from 'lucide-react';

interface OfferPercentageBadgeProps {
  percentage: number;
}

const OfferPercentageBadge = ({ percentage }: OfferPercentageBadgeProps) => {
  if (percentage > 0) {
    return (
      <div className="flex items-center text-green-600 font-semibold">
        <TrendingUp className="h-4 w-4 mr-1" />
        +{percentage}%
      </div>
    );
  } else if (percentage < 0) {
    return (
      <div className="flex items-center text-red-600 font-semibold">
        <TrendingDown className="h-4 w-4 mr-1" />
        {percentage}%
      </div>
    );
  }
  return <span className="text-gray-600 font-semibold">0%</span>;
};

export default OfferPercentageBadge;
