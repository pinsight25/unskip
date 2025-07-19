
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useUser } from '@/contexts/UserContext';
import { formatPhoneForDB } from '@/utils/phoneUtils';

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

// Add OfferRow type for the Supabase response

type OfferRow = {
  id: string;
  car_id: string;
  buyer_name: string;
  buyer_phone: string;
  amount: number;
  status: string;
  message?: string;
  created_at: string;
  cars?: {
    title?: string;
    price?: number;
    make?: string;
    model?: string;
    year?: number;
  }[];
};

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
        .eq('phone', formatPhoneForDB(user.phone))
        .single();

      if (userError || !userData) {
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
        setError('Failed to fetch offers');
        return;
      }

      // Transform the data
      const transformedOffers: Offer[] = (offersData || []).map((offer: OfferRow) => {
        const car = Array.isArray(offer.cars) ? offer.cars[0] : offer.cars;
        return {
          id: offer.id,
          car_id: offer.car_id,
          car_title: car?.title || `${car?.year || ''} ${car?.make || ''} ${car?.model || ''}`.trim(),
          asking_price: car?.price ?? 0,
          buyer_name: offer.buyer_name,
          buyer_phone: offer.buyer_phone,
          offer_amount: offer.amount,
          status: offer.status as 'pending' | 'accepted' | 'rejected',
          created_at: formatRelativeDate(offer.created_at),
          message: offer.message || undefined
        };
      });

      setOffers(transformedOffers);
    } catch (err) {
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
      return false;
    }
  };

  useEffect(() => {
    fetchOffers();

    // Supabase real-time subscription for received offers
    let channel: any = null;
    if (user?.phone) {
      // Fetch user ID for filter
      supabase
        .from('users')
        .select('id')
        .eq('phone', formatPhoneForDB(user.phone))
        .single()
        .then(({ data: userData }) => {
          if (userData?.id) {
            channel = supabase.channel('realtime-received-offers')
              .on(
                'postgres_changes',
                {
                  event: '*',
                  schema: 'public',
                  table: 'offers',
                  filter: `seller_id=eq.${userData.id}`
                },
                () => {
                  fetchOffers();
                }
              )
              .subscribe();
          }
        });
    }
    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, [user?.phone]);

  return {
    offers,
    isLoading,
    error,
    updateOfferStatus,
    refetch: fetchOffers
  };
};
