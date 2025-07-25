import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CustomInput } from '@/components/ui/CustomInput';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { useUser } from '@/contexts/UserContext';
import { offerService } from '@/services/offerService';
import { formatIndianPrice } from '@/utils/priceFormatter';
import { formatPhoneForDB, formatPhoneForAuth } from '@/utils/phoneUtils';
import { useQueryClient } from '@tanstack/react-query';

interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: {
    id: string;
    title: string;
    price: number;
    images: { url: string }[];
    seller_id: string;
  };
}

const MakeOfferModal: React.FC<MakeOfferModalProps> = ({ isOpen, onClose, car }) => {
  const { openSignInModal } = useAuthModal();
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    amount: '', // Always string
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const minAcceptable = Math.floor(car.price * 0.85);
  const showLowOfferWarning = form.amount !== '' && Number(form.amount) < minAcceptable;
  const sellerName = user?.id === car.seller_id ? 'Seller' : (user?.name || 'Seller');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'amount') {
      // Only allow digits, remove leading zeros
      const cleanValue = value.replace(/\D/g, '').replace(/^0+/, '');
      setForm(prev => ({ ...prev, amount: cleanValue }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const submitOffer = async () => {
    setError('');
    if (user?.id === car.seller_id) {
      setError('You cannot make an offer on your own car.');
      return;
    }
    setLoading(true);
    try {
      await offerService.createOffer({
        car_id: car.id,
        buyer_id: user.id,
        buyer_name: form.name,
        buyer_phone: formatPhoneForDB(form.phone),
        seller_id: car.seller_id,
        amount: Number(form.amount),
        message: form.message,
      });
      
      // Invalidate relevant queries to trigger refetch
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['received-offers', car.seller_id] }),
        queryClient.invalidateQueries({ queryKey: ['profile-stats', car.seller_id] }),
        queryClient.invalidateQueries({ queryKey: ['offer', car.id, user.id] }),
        queryClient.invalidateQueries({ queryKey: ['offers', user.id] })
      ]);
      
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to make offer.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!user || !user.isVerified) {
      openSignInModal(() => {
        // This runs after successful auth
        submitOffer();
      });
      return;
    }
    submitOffer();
  };

  const handleClose = () => {
    setError('');
    setSuccess(false);
    setForm({
      name: user?.name || '',
      phone: user?.phone || '',
      amount: '', // Reset to empty string
      message: '',
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect with {sellerName}</DialogTitle>
          <div className="text-sm text-gray-500 mt-1">
            Seller accepts offers above <span className="font-semibold text-orange-600">₹{minAcceptable.toLocaleString()}</span> (85% of asking)
          </div>
          <div className="text-xs text-gray-400 mt-1">Price negotiable when you meet</div>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Car Info */}
          <div className="flex items-center space-x-3">
            {car.images?.[0]?.url && (
              <img src={car.images[0].url} alt={car.title} className="w-16 h-12 object-cover rounded" />
            )}
            <div>
              <div className="font-semibold text-gray-900">{car.title}</div>
              <div className="text-sm text-gray-500">Asking: {formatIndianPrice(car.price)}</div>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Name</label>
              <CustomInput
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className="h-12"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Phone</label>
              <CustomInput
                name="phone"
                value={formatPhoneForAuth(form.phone)}
                onChange={handleChange}
                placeholder="Your phone number"
                className="h-12"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Offer Amount</label>
              <CustomInput
                name="amount"
                type="number"
                min={1}
                value={form.amount}
                onChange={handleChange}
                placeholder={`e.g. ${car.price}`}
                className="h-12"
                required
              />
              {showLowOfferWarning && (
                <div className="text-xs text-orange-500 mt-1">Warning: Offers below 70% of asking price are unlikely to be accepted.</div>
              )}
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Message (optional)</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Add a message for the seller"
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                rows={3}
              />
            </div>
            {error && <div className="text-sm text-red-600">{error}</div>}
            {success && <div className="text-sm text-green-600">Offer sent! {sellerName} will review and respond.</div>}
            <Button
              type="button"
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold shadow-md hover:from-orange-600 hover:to-orange-700 transition-colors"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? 'Submitting...' : 'Submit Offer'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MakeOfferModal; 