import { supabase } from '@/lib/supabase';
import type { TablesInsert } from '@/integrations/supabase/types';

export const carService = {
  // Save car to database
  async createCarListing(carData: any, userId: string) {
    try {
      // Fetch user verification status and dealer info
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('is_verified, user_type')
        .eq('id', userId)
        .single();
      if (userError) throw userError;

      // Check if user is a dealer and get dealer verification status
      let dealerVerified = false;
      if (userData?.user_type === 'dealer') {
        const { data: dealerData, error: dealerError } = await supabase
          .from('dealers')
          .select('verification_status')
          .eq('user_id', userId)
          .single();
        
        if (!dealerError && dealerData) {
          dealerVerified = dealerData.verification_status === 'verified';
        }
      }

      // Prepare car record with all required fields
      const carRecord: TablesInsert<'cars'> = {
        seller_id: userId,
        seller_type: userData?.user_type === 'dealer' ? 'dealer' : 'individual',
        title: `${carData.year} ${carData.make} ${carData.model}`,
        make: carData.make,
        model: carData.model,
        variant: carData.variant || null,
        year: parseInt(carData.year),
        fuel_type: carData.fuelType || 'Petrol',
        transmission: carData.transmission || 'Manual',
        kilometers_driven: parseInt(carData.kilometersDriven) || 0,
        number_of_owners: parseInt(carData.numberOfOwners) || 1,
        price: parseFloat(carData.price),
        accept_offers: Boolean(carData.acceptOffers),
        offer_percentage: carData.offerPercentage ? parseFloat(carData.offerPercentage) : null,
        color: carData.color || null,
        registration_state: carData.registrationState || null,
        registration_year: carData.registrationYear ? parseInt(carData.registrationYear) : null,
        insurance_valid: Boolean(carData.insuranceValid),
        insurance_type: carData.insuranceType || null,
        insurance_valid_till: carData.insuranceValidTill || null,
        city: carData.city,
        area: carData.area || null,
        landmark: carData.landmark || null,
        address: carData.address || null,
        description: carData.description || null,
        service_history: Boolean(carData.serviceHistory),
        last_service_date: carData.lastServiceDate || null,
        no_accident_history: Boolean(carData.noAccidentHistory),
        authorized_service_center: Boolean(carData.authorizedServiceCenter),
        service_center_type: carData.serviceCenterType || null,
        fitness_certificate_valid_till: carData.fitnessCertificateValidTill || null,
        rto_transfer_support: Boolean(carData.rtoTransferSupport),
        seating_capacity: carData.seatingCapacity ? parseInt(carData.seatingCapacity) : null,
        is_rent_available: Boolean(carData.isRentAvailable),
        daily_rate: carData.dailyRate ? parseFloat(carData.dailyRate) : null,
        weekly_rate: carData.weeklyRate ? parseFloat(carData.weeklyRate) : null,
        security_deposit: carData.securityDeposit ? parseFloat(carData.securityDeposit) : null,
        status: 'active', // Always set to active
        featured: false, // Only true if admin/paid
        verified: userData?.is_verified || false, // Set based on user verification
        // Note: dealer_verified field will be added to cars table schema
        views: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      
      // Insert car record
      const { data: car, error } = await supabase
        .from('cars')
        .insert([carRecord])
        .select()
        .single();

      if (error) throw error;

      // Save image URLs to car_images table if photos exist
      if (carData.photos && carData.photos.length > 0) {
        // Always set the first photo as cover unless user sets another
        let coverSet = false;
        const imageRecords = carData.photos.map((photo: any, index: number) => {
          let isCover = false;
          if (photo.isCover) {
            isCover = true;
            coverSet = true;
          } else if (!coverSet && index === 0) {
            isCover = true;
            coverSet = true;
          }
          return {
            car_id: car.id,
            image_url: photo.cloudinaryUrl,
            is_cover: isCover,
            sort_order: index + 1,
            uploaded_at: new Date().toISOString()
          };
        });
        const { data: images, error: imageError } = await supabase
          .from('car_images')
          .insert(imageRecords)
          .select();
        if (imageError) {
          // console.error('❌ Image insert error:', imageError);
        }
      }

      return { success: true, carId: car.id };
    } catch (error) {
      // console.error('Error creating car listing:', error);
      return { success: false, error };
    }
  },

  // Update existing car listing
  async updateCarListing(carId: string, carData: any, userId: string) {
    try {
      // Prepare car record (exclude created_at and status)
      const carRecord: Partial<TablesInsert<'cars'>> = {
        title: `${carData.year} ${carData.make} ${carData.model}`,
        make: carData.make,
        model: carData.model,
        variant: carData.variant || null,
        year: parseInt(carData.year),
        fuel_type: carData.fuelType || 'Petrol',
        transmission: carData.transmission || 'Manual',
        kilometers_driven: parseInt(carData.kilometersDriven) || 0,
        number_of_owners: parseInt(carData.numberOfOwners) || 1,
        price: parseFloat(carData.price),
        accept_offers: Boolean(carData.acceptOffers),
        offer_percentage: carData.offerPercentage ? parseFloat(carData.offerPercentage) : null,
        color: carData.color || null,
        registration_state: carData.registrationState || null,
        registration_year: carData.registrationYear ? parseInt(carData.registrationYear) : null,
        insurance_valid: Boolean(carData.insuranceValid),
        insurance_type: carData.insuranceType || null,
        insurance_valid_till: carData.insuranceValidTill || null,
        city: carData.city,
        area: carData.area || null,
        landmark: carData.landmark || null,
        address: carData.address || null,
        description: carData.description || null,
        service_history: Boolean(carData.serviceHistory),
        last_service_date: carData.lastServiceDate || null,
        no_accident_history: Boolean(carData.noAccidentHistory),
        authorized_service_center: Boolean(carData.authorizedServiceCenter),
        service_center_type: carData.serviceCenterType || null,
        fitness_certificate_valid_till: carData.fitnessCertificateValidTill || null,
        rto_transfer_support: Boolean(carData.rtoTransferSupport),
        seating_capacity: carData.seatingCapacity ? parseInt(carData.seatingCapacity) : null,
        is_rent_available: Boolean(carData.isRentAvailable),
        daily_rate: carData.dailyRate ? parseFloat(carData.dailyRate) : null,
        weekly_rate: carData.weeklyRate ? parseFloat(carData.weeklyRate) : null,
        security_deposit: carData.securityDeposit ? parseFloat(carData.securityDeposit) : null,
        updated_at: new Date().toISOString(),
      };
      // Update car record
      const { data: car, error } = await supabase
        .from('cars')
        .update(carRecord)
        .eq('id', carId)
        .eq('seller_id', userId)
        .select()
        .single();
      if (error) throw error;
      // Handle photos if changed
      if (carData.photos && carData.photos.length > 0) {
        // Delete old photos not in new list
        const newPhotoUrls = carData.photos.map((p: any) => p.cloudinaryUrl);
        await supabase
          .from('car_images')
          .delete()
          .eq('car_id', carId)
          .not('image_url', 'in', `(${newPhotoUrls.map((url: string) => `'${url}'`).join(',')})`);
        // Insert new photos
        const newPhotos = carData.photos.filter((p: any) => !p.id);
        if (newPhotos.length > 0) {
          // Ensure at least one cover photo
          let coverSet = false;
          const imageRecords = newPhotos.map((photo: any, index: number) => {
            let isCover = false;
            if (photo.isCover) {
              isCover = true;
              coverSet = true;
            } else if (!coverSet && index === 0) {
              isCover = true;
              coverSet = true;
            }
            return {
              car_id: carId,
              image_url: photo.cloudinaryUrl,
              is_cover: isCover,
              sort_order: index + 1
            };
          });
          await supabase
            .from('car_images')
            .insert(imageRecords);
        }
      }
      return { success: true, carId };
    } catch (error) {
      // console.error('Error updating car:', error);
      return { success: false, error };
    }
  },

  // Get user's car listings
  async getUserCarListings(userId: string) {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('seller_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async deleteCarListing(carId: string, userId: string) {
    try {
      // Delete car images first
      await supabase.from('car_images').delete().eq('car_id', carId);
      // Delete the car itself
      const { error } = await supabase
        .from('cars')
        .delete()
        .eq('id', carId)
        .eq('seller_id', userId);
      if (error) throw error;
      return { success: true };
    } catch (error) {
      // console.error('Error deleting car:', error);
      return { success: false, error };
    }
  },
}; 