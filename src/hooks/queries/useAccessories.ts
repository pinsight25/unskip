import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Accessory } from '@/types/accessory';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export const useAccessories = (filters?: {
  category?: string
  priceMin?: number
  priceMax?: number
  location?: string
  search?: string
}) => {
  const queryClient = useQueryClient();
  
  const query = useQuery({
    queryKey: ['accessories', filters],
    queryFn: async () => {
      let query = supabase
        .from('accessories')
        .select(`
          *,
          accessory_images(image_url, sort_order)
        `)
        .eq('status', 'active')

      if (filters?.category) {
        query = query.eq('category', filters.category)
      }
      
      // Only apply price filters if both min and max are meaningful
      if (filters?.priceMin && filters.priceMin > 0 && filters?.priceMax && filters.priceMax > 0) {
        query = query.gte('price_min', filters.priceMin)
        query = query.lte('price_min', filters.priceMax)
      }
      
      if (filters?.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }
      if (filters?.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      
      // Transform the data to include images array
      const accessoriesWithImages = data?.map(accessory => ({
        ...accessory,
        images: accessory.accessory_images?.map((img: any) => img.image_url).sort((a: any, b: any) => 
          accessory.accessory_images?.find((img: any) => img.image_url === a)?.sort_order - 
          accessory.accessory_images?.find((img: any) => img.image_url === b)?.sort_order
        ) || []
      })) || []
      
      return accessoriesWithImages as Accessory[]
    },
    staleTime: 30000, // 30 seconds instead of 0
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  return query;
};

export const useAccessory = (id: string) => {
  return useQuery({
    queryKey: ['accessory', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('accessories')
        .select(`
          *,
          accessory_images(image_url, sort_order)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      
      // Transform the data to include images array
      const accessoryWithImages = {
        ...data,
        images: data.accessory_images?.map((img: any) => img.image_url).sort((a: any, b: any) => 
          data.accessory_images?.find((img: any) => img.image_url === a)?.sort_order - 
          data.accessory_images?.find((img: any) => img.image_url === b)?.sort_order
        ) || []
      }
      
      return accessoryWithImages as Accessory
    },
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  })
}

export const useUserAccessories = (userId: string) => {
  return useQuery({
    queryKey: ['user-accessories', userId],
    queryFn: async () => {
      // Don't query if userId is empty or undefined
      if (!userId || userId.trim() === '') {
        return [];
      }

      const { data, error } = await supabase
        .from('accessories')
        .select(`
          *,
          accessory_images(image_url, sort_order)
        `)
        .eq('seller_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Transform the data to include images array
      const accessoriesWithImages = data?.map(accessory => ({
        ...accessory,
        images: accessory.accessory_images?.map((img: any) => img.image_url).sort((a: any, b: any) => 
          accessory.accessory_images?.find((img: any) => img.image_url === a)?.sort_order - 
          accessory.accessory_images?.find((img: any) => img.image_url === b)?.sort_order
        ) || []
      })) || []
      
      return accessoriesWithImages as Accessory[]
    },
    staleTime: Infinity,
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: !!userId && userId.trim() !== '', // Only run query if userId is valid
  })
}

export const useCreateAccessory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (accessory: Omit<Accessory, 'id' | 'created_at' | 'updated_at'> & { images?: string[] }) => {
      // Extract images from accessory data
      const { images, ...accessoryData } = accessory;
      
      // Create the accessory first
      const { data: newAccessory, error: accessoryError } = await supabase
        .from('accessories')
        .insert(accessoryData)
        .select()
        .single()

      if (accessoryError) throw accessoryError

      // If there are images, save them to accessory_images table
      if (images && images.length > 0) {
        const imageRecords = images.map((imageUrl, index) => ({
          accessory_id: newAccessory.id,
          image_url: imageUrl,
          sort_order: index,
        }));

        const { error: imageError } = await supabase
          .from('accessory_images')
          .insert(imageRecords)

        if (imageError) {
          console.error('Failed to save images:', imageError);
          // Don't throw error here as the accessory was created successfully
        }
      }

      return newAccessory
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accessories'] })
      queryClient.invalidateQueries({ queryKey: ['user-accessories'] })
    },
  })
}

export const useUpdateAccessory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Accessory> & { id: string }) => {
      const { data, error } = await supabase
        .from('accessories')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['accessories'] })
      queryClient.invalidateQueries({ queryKey: ['accessory', data.id] })
      queryClient.invalidateQueries({ queryKey: ['user-accessories'] })
    },
  })
}

export const useDeleteAccessory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('accessories')
        .delete()
        .eq('id', id)

      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accessories'] })
      queryClient.invalidateQueries({ queryKey: ['user-accessories'] })
    },
  })
} 