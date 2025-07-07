
import { Card, CardContent } from '@/components/ui/card';
import { Car, Calendar, User } from 'lucide-react';
import OfferStatusBadge from './OfferStatusBadge';
import OfferPercentageBadge from './OfferPercentageBadge';
import OfferActionButtons from './OfferActionButtons';

interface Offer {
  id: string;
  carId: string;
  carTitle: string;
  askingPrice: number;
  buyerName: string;
  buyerPhone: string;
  offerAmount: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

interface OfferCardProps {
  offer: Offer;
  formatPrice: (price: number) => string;
  calculatePercentageDiff: (offerAmount: number, askingPrice: number) => number;
  onAcceptOffer: (offerId: string) => void;
  onRejectOffer: (offerId: string) => void;
  onChatWithBuyer: (offer: Offer) => void;
}

const OfferCard = ({
  offer,
  formatPrice,
  calculatePercentageDiff,
  onAcceptOffer,
  onRejectOffer,
  onChatWithBuyer
}: OfferCardProps) => {
  const percentageDiff = calculatePercentageDiff(offer.offerAmount, offer.askingPrice);

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="grid grid-cols-12 gap-6">
            {/* Car Thumbnail */}
            <div className="col-span-2">
              <div className="w-20 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <Car className="h-8 w-8 text-gray-400" />
              </div>
            </div>

            {/* Left Column - Car Info */}
            <div className="col-span-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">{offer.carTitle}</h3>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    Posted {offer.createdAt}
                  </div>
                </div>
                <OfferStatusBadge status={offer.status} />
              </div>

              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Asking Price</p>
                  <p className="font-semibold text-lg">{formatPrice(offer.askingPrice)}</p>
                </div>
                <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                  <p className="text-sm text-gray-600 mb-1">Offer Amount</p>
                  <p className="font-bold text-xl text-primary">{formatPrice(offer.offerAmount)}</p>
                </div>
              </div>
            </div>

            {/* Right Column - Buyer Info */}
            <div className="col-span-3 space-y-3">
              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <User className="h-4 w-4 mr-1" />
                  Buyer Information
                </div>
                <p className="font-semibold text-lg">{offer.buyerName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Price Difference</p>
                <OfferPercentageBadge percentage={percentageDiff} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="col-span-2 flex flex-col justify-center">
              <OfferActionButtons
                status={offer.status}
                offerId={offer.id}
                onAccept={onAcceptOffer}
                onReject={onRejectOffer}
                onChat={() => onChatWithBuyer(offer)}
              />
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="block md:hidden">
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1">{offer.carTitle}</h3>
                <p className="text-sm text-gray-500">Posted {offer.createdAt}</p>
              </div>
              <OfferStatusBadge status={offer.status} />
            </div>

            {/* Offer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Asking Price</p>
                <p className="font-semibold text-lg">{formatPrice(offer.askingPrice)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Buyer</p>
                <p className="font-medium">{offer.buyerName}</p>
              </div>
            </div>

            {/* Offer Amount */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Offer Amount</p>
                  <p className="font-bold text-xl text-primary">{formatPrice(offer.offerAmount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Difference</p>
                  <p className="text-lg font-semibold">
                    <OfferPercentageBadge percentage={percentageDiff} />
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <OfferActionButtons
              status={offer.status}
              offerId={offer.id}
              onAccept={onAcceptOffer}
              onReject={onRejectOffer}
              onChat={() => onChatWithBuyer(offer)}
              isMobile={true}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OfferCard;
