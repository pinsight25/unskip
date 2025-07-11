
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';

interface Offer {
  id: string;
  car_id: string;
  car_title: string;
  asking_price: number;
  buyer_name: string;
  buyer_phone: string;
  offer_amount: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  message?: string;
}

export const useUserOffers = () => {
  const { user } = useUser();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffers = async () => {
    if (!user?.phone) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // First get the user ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('phone', user.phone)
        .single();

      if (userError || !userData) {
        console.error('Error fetching user:', userError);
        setError('Failed to fetch user data');
        return;
      }

      // Fetch offers for this user's cars
      const { data: offersData, error: offersError } = await supabase
        .from('offers')
        .select(`
          id,
          car_id,
          buyer_name,
          buyer_phone,
          amount,
          status,
          message,
          created_at,
          cars!inner(
            title,
            price,
            make,
            model,
            year
          )
        `)
        .eq('seller_id', userData.id)
        .order('created_at', { ascending: false });

      if (offersError) {
        console.error('Error fetching offers:', offersError);
        setError('Failed to fetch offers');
        return;
      }

      // Transform the data
      const transformedOffers: Offer[] = (offersData || []).map(offer => ({
        id: offer.id,
        car_id: offer.car_id,
        car_title: offer.cars.title || `${offer.cars.year} ${offer.cars.make} ${offer.cars.model}`,
        asking_price: offer.cars.price,
        buyer_name: offer.buyer_name,
        buyer_phone: offer.buyer_phone,
        offer_amount: offer.amount,
        status: offer.status as 'pending' | 'accepted' | 'rejected',
        created_at: formatRelativeDate(offer.created_at),
        message: offer.message || undefined
      }));

      setOffers(transformedOffers);
    } catch (err) {
      console.error('Error in fetchOffers:', err);
      setError('Failed to fetch offers');
    } finally {
      setIsLoading(false);
    }
  };

  const formatRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const updateOfferStatus = async (offerId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status: newStatus })
        .eq('id', offerId);

      if (error) {
        console.error('Error updating offer:', error);
        return false;
      }

      // Update local state
      setOffers(prevOffers =>
        prevOffers.map(offer =>
          offer.id === offerId ? { ...offer, status: newStatus } : offer
        )
      );

      return true;
    } catch (err) {
      console.error('Error updating offer status:', err);
      return false;
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [user?.phone]);

  return {
    offers,
    isLoading,
    error,
    updateOfferStatus,
    refetch: fetchOffers
  };
};
