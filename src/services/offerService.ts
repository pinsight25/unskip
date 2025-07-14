import { supabase } from '@/lib/supabase';

export interface Offer {
  id: string;
  car_id: string;
  buyer_id: string;
  buyer_name: string;
  buyer_phone: string;
  seller_id: string;
  amount: number;
  message?: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string | null;
  updated_at: string | null;
}

export const offerService = {
  // Check for existing pending offer
  async hasExistingOffer(carId: string, buyerId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('offers')
      .select('id')
      .eq('car_id', carId)
      .eq('buyer_id', buyerId)
      .eq('status', 'pending')
      .maybeSingle();
    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },

  // Create new offer
  async createOffer(data: {
    car_id: string;
    buyer_id: string;
    buyer_name: string;
    buyer_phone: string;
    seller_id: string;
    amount: number;
    message?: string;
  }): Promise<Offer | null> {
    if (data.buyer_id === data.seller_id) {
      throw new Error('You cannot make an offer on your own car');
    }
    const { data: offer, error } = await supabase
      .from('offers')
      .insert({
        ...data,
        status: 'pending',
      })
      .select()
      .single();
    if (error) throw error;
    return offer as Offer;
  },

  // Get offers for seller with car and buyer details
  async getReceivedOffers(sellerId: string): Promise<Offer[]> {
    const { data, error } = await supabase
      .from('offers')
      .select('*, car:car_id(*), buyer:buyer_id(*)')
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Offer[];
  },

  // Update offer status
  async updateOfferStatus(
    offerId: string,
    status: 'accepted' | 'rejected',
    sellerId: string
  ): Promise<Offer | null> {
    const { data, error } = await supabase
      .from('offers')
      .update({ status })
      .eq('id', offerId)
      .eq('seller_id', sellerId)
      .select()
      .single();
    if (error) throw error;
    return data as Offer;
  },
}; 