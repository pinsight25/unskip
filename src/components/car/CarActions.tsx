
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { IndianRupee, MessageCircle, Phone, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useOfferContext } from '@/contexts/OfferContext';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

interface CarActionsProps {
  carId: string;
  sellerId: string;
  offerStatus: 'none' | 'pending' | 'accepted' | 'rejected';
  onMakeOffer: () => void;
  onChatClick: () => void;
  onTestDrive: () => void;
  onViewOffers?: () => void;
  onMarkSold?: () => void;
  offerCount?: number;
  setSignInModalOpen?: () => void; // Added for modal integration
  sellerPhone?: string; // <-- Add sellerPhone prop
}

const CarActions = ({ carId, sellerId, offerStatus, onMakeOffer, onChatClick, onTestDrive, onViewOffers, onMarkSold, offerCount, setSignInModalOpen, sellerPhone }: CarActionsProps) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { hasOffered } = useOfferContext();

  if (!user) {
    // TODO: Replace with your actual modal open logic, e.g. from context or props
    const openSignInModal = typeof setSignInModalOpen === 'function' ? setSignInModalOpen : () => { /* TODO: integrate with modal system */ };
    return (
      <Button className="w-full bg-primary text-white font-medium" onClick={openSignInModal}>
        Sign In to Contact Seller
      </Button>
    );
  }

  const isOwner = user.id === sellerId;

  if (isOwner) {
    const handleEditListing = () => {
      // Save edit data to sessionStorage for SellCar edit flow
      sessionStorage.setItem('editListingData', JSON.stringify({
        listingId: carId
      }));
      navigate(`/sell?edit=${carId}`);
    };
    return (
      <div className="space-y-3">
        <Button className="w-full bg-primary text-white font-medium" onClick={handleEditListing}>
          ✏️ Edit Listing
        </Button>
        <Button className="w-full" variant="outline" onClick={onViewOffers}>
          👁️ View Offers {offerCount ? `(${offerCount})` : ''}
        </Button>
        <Button className="w-full" variant="outline" onClick={onMarkSold}>
          ✓ Mark as Sold
        </Button>
      </div>
    );
  }

  const handleChatClick = () => {
    if (!hasOffered(carId)) {
      toast({
        title: "Make an offer first",
        description: "You need to make an offer before you can chat with the seller.",
        variant: "destructive",
      });
      return;
    }
    onChatClick();
  };

  const handleTestDriveClick = () => {
    if (!hasOffered(carId)) {
      toast({
        title: "Make an offer first",
        description: "Please make an offer before booking a test drive with the seller.",
        variant: "destructive",
      });
      return;
    }
    onTestDrive();
  };

  const handleCall = () => {
    if (sellerPhone) {
      window.location.href = `tel:${sellerPhone}`;
    }
  };

  const getChatButtonConfig = () => {
    const offered = hasOffered(carId);
    switch (offerStatus) {
      case 'none':
        return {
          text: 'Chat',
          disabled: !offered,
          variant: 'outline' as const,
          className: offered ? 'border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 active:bg-orange-600' : 'border-gray-300 text-gray-500'
        };
      case 'pending':
        return {
          text: 'Chat',
          disabled: !offered,
          variant: 'outline' as const,
          className: offered ? 'border-orange-300 text-orange-600' : 'border-gray-300 text-gray-500'
        };
      case 'accepted':
        return {
          text: 'Chat',
          disabled: false,
          variant: 'outline' as const,
          className: 'border-orange-500 text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 active:bg-orange-600'
        };
      case 'rejected':
        return {
          text: 'Chat',
          disabled: true,
          variant: 'outline' as const,
          className: 'border-red-300 text-red-600'
        };
      default:
        return {
          text: 'Chat',
          disabled: !offered,
          variant: 'outline' as const,
          className: offered ? 'border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 active:bg-orange-600' : 'border-gray-300 text-gray-500'
        };
    }
  };

  const chatConfig = getChatButtonConfig();
  const offered = hasOffered(carId);

  return (
    <div className="space-y-3">
      {/* Main Offer Button */}
      {offerStatus === 'accepted' ? (
        <Button
          className="w-full bg-green-100 text-green-700 border border-green-500 font-semibold"
          variant="secondary"
          disabled
        >
          <IndianRupee className="h-4 w-4 mr-2 text-green-600" />
          Offer Accepted ✓
        </Button>
      ) : (
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
          onClick={onMakeOffer}
        >
          <IndianRupee className="h-4 w-4 mr-2" />
          {offerStatus === 'pending' ? 'Offer Sent' : 'Connect with Seller'}
        </Button>
      )}
      {/* Chat/Call Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="outline"
          onClick={handleChatClick}
          disabled={offerStatus !== 'accepted'}
          className={`transition-all duration-200 ${
            offerStatus === 'accepted'
              ? 'border-green-500 text-green-600 hover:bg-green-500 hover:text-white hover:border-green-500'
              : 'border-gray-300 text-gray-500 opacity-60 cursor-not-allowed'
          }`}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          Chat
        </Button>
        <Button 
          variant="outline"
          onClick={handleCall}
          disabled={offerStatus !== 'accepted' || !sellerPhone}
          className={`transition-all duration-200 ${
            offerStatus === 'accepted' && sellerPhone
              ? 'border-green-500 text-green-600 hover:bg-green-500 hover:text-white hover:border-green-500'
              : 'border-gray-300 text-gray-500 opacity-60 cursor-not-allowed'
          }`}
        >
          <Phone className="h-4 w-4 mr-2" />
          Call
        </Button>
      </div>
      {offerStatus === 'accepted' && (
        <div className="mt-2">
          <Badge className="bg-green-100 text-green-800 border-green-200 w-full justify-center">
            ✅ Ready to chat with seller
          </Badge>
        </div>
      )}
    </div>
  );
};

export default CarActions;
