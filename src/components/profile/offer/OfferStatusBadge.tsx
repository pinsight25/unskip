
import { Badge } from '@/components/ui/badge';

interface OfferStatusBadgeProps {
  status: 'pending' | 'accepted' | 'rejected';
}

const OfferStatusBadge = ({ status }: OfferStatusBadgeProps) => {
  const variants = {
    pending: { className: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Pending' },
    accepted: { className: 'bg-green-100 text-green-800 border-green-200', text: 'Accepted' },
    rejected: { className: 'bg-red-100 text-red-800 border-red-200', text: 'Rejected' }
  };
  
  const variant = variants[status];
  return (
    <Badge className={`${variant.className} border text-xs font-medium px-3 py-1`}>
      {variant.text}
    </Badge>
  );
};

export default OfferStatusBadge;
