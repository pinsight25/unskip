
import { Button } from '@/components/ui/button';
import { MessageCircle, IndianRupee, Phone, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CarCardActionsProps {
  onMakeOffer: () => void;
  onChat: () => void;
  offerStatus: 'none' | 'pending' | 'accepted' | 'rejected';
  offerAmount: number | null;
  isOwner?: boolean;
  onViewOffers?: () => void;
}

const CarCardActions = ({ onMakeOffer, onChat, offerStatus, offerAmount, isOwner, onViewOffers }: CarCardActionsProps) => {
  const navigate = useNavigate();
  return (
    <div className="space-y-3">
      {!isOwner && offerStatus === 'none' && (
        <Button 
          size="sm"
          className="w-full"
          onClick={onMakeOffer}
        >
          <IndianRupee className="h-4 w-4 mr-1" />
          Connect with Seller
        </Button>
      )}
      {isOwner && (
        <Button
          size="sm"
          className="w-full bg-cyan-600 text-white hover:bg-cyan-700"
          onClick={() => navigate('/profile?tab=received-offers')}
        >
          <Eye className="h-4 w-4 mr-1" />
          View Offers
        </Button>
      )}
      {!isOwner && offerStatus === 'pending' && (
        <>
          <Button size="sm" variant="secondary" className="w-full" disabled>
            Offer Sent{offerAmount ? `: ₹${offerAmount}` : ''}
          </Button>
          <div className="grid grid-cols-2 grid-gap mt-2">
            <Button variant="outline" size="sm" disabled className="opacity-60 cursor-not-allowed">
              <MessageCircle className="h-4 w-4 mr-1" />Chat
            </Button>
            <Button variant="outline" size="sm" disabled className="opacity-60 cursor-not-allowed">
              <Phone className="h-4 w-4 mr-1" />Call
            </Button>
          </div>
        </>
      )}
      {!isOwner && offerStatus === 'accepted' && (
        <>
          <Button size="sm" variant="secondary" className="w-full bg-green-100 text-green-800" disabled>
            Offer Accepted ✓
          </Button>
          <div className="grid grid-cols-2 grid-gap mt-2">
            <Button variant="outline" size="sm" onClick={onChat}>
              <MessageCircle className="h-4 w-4 mr-1" />Chat
            </Button>
            <Button variant="outline" size="sm" onClick={() => {}}>
              <Phone className="h-4 w-4 mr-1" />Call
            </Button>
          </div>
        </>
      )}
      {!isOwner && offerStatus === 'rejected' && (
        <div>
          <p className="text-red-600 text-sm mb-2">Offer not accepted</p>
          <Button variant="link" size="sm" className="w-full" onClick={() => navigate('/')}>Browse Similar Cars</Button>
        </div>
      )}
    </div>
  );
};

export default CarCardActions;
