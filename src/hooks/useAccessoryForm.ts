
import { useState, useEffect } from 'react';
import { useCreateAccessory, useUpdateAccessory, useDeleteAccessory } from '@/hooks/queries/useAccessories';
import { useToast } from '@/hooks/use-toast';
import { Accessory, AccessoryCategory } from '@/types/accessory';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

export interface AccessoryFormData {
  name: string;
  brand: string;
  category: AccessoryCategory;
  price_min: number;
  price_max?: number;
  description: string;
  condition: string;
  location: string;
  phone: string;
  availability: 'in-stock' | 'order' | 'out-of-stock';
  compatibility?: string[];
  warranty?: string;
  installation_available?: boolean;
  email?: string;
  whatsapp_contact?: boolean;
  additional_info?: string;
  images?: string[];
  sellerName?: string;
}

export const useAccessoryForm = (initialData?: Partial<AccessoryFormData>) => {
  const { user } = useUser();
  const { toast } = useToast();
  const createAccessory = useCreateAccessory();
  const updateAccessory = useUpdateAccessory();
  const deleteAccessory = useDeleteAccessory();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<AccessoryFormData>({
    name: '',
    brand: '',
    category: '' as AccessoryCategory,
    price_min: 0,
    price_max: undefined,
    description: '',
    condition: '' as string,
    location: 'Chennai', // Default location
    phone: user?.phone || '',
    availability: 'in-stock',
    compatibility: [],
    warranty: '',
    installation_available: false,
    email: user?.email || '',
    whatsapp_contact: false,
    additional_info: '',
    images: [],
    sellerName: user?.name || '',
    ...initialData,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AccessoryFormData, string>>>({});

  // Update form data when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
      }));
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof AccessoryFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'Brand is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.condition) {
      newErrors.condition = 'Condition is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.price_min <= 0) {
      newErrors.price_min = 'Price must be greater than 0';
    }

    if (formData.price_max && formData.price_max < formData.price_min) {
      newErrors.price_max = 'Maximum price must be greater than minimum price';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (isEdit = false, accessoryId?: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to post an accessory",
        variant: "destructive",
      });
      return false;
    }

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return false;
    }

    try {
      const accessoryData = {
        seller_id: user.id,
        name: formData.name,
        category: formData.category as any,
        brand: formData.brand,
        price_min: formData.price_min,
        price_max: formData.price_max,
        description: formData.description,
        condition: formData.condition,
        compatibility: formData.compatibility || [],
        warranty: formData.warranty || '',
        installation_available: formData.installation_available || false,
        seller_name: formData.sellerName || user.name,
        phone: formData.phone,
        phone_verified: false,
        email: formData.email || '',
        location: formData.location,
        additional_info: formData.additional_info || '',
        whatsapp_contact: formData.whatsapp_contact || false,
        verified_seller: user.userType === 'dealer',
        availability: formData.availability || 'in-stock',
        status: 'active' as const,
        featured: false,
        views: 0,
      };

      console.log('🔍 Accessory data being sent to database:', accessoryData);
      console.log('🔍 User data:', { id: user.id, name: user.name, userType: user.userType });

      if (isEdit && accessoryId) {
        await updateAccessory.mutateAsync({ id: accessoryId, ...accessoryData });
        toast({
          title: "Success",
          description: "Accessory updated successfully",
        });
      } else {
        await createAccessory.mutateAsync({ ...accessoryData, images: formData.images });
        toast({
          title: "Success",
          description: "Accessory posted successfully",
        });
      }

      // Invalidate queries to trigger refetch
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['accessories'] }),
        queryClient.invalidateQueries({ queryKey: ['userAccessories', user.id] }),
        queryClient.invalidateQueries({ queryKey: ['dealer-accessories', user.id] }),
        queryClient.invalidateQueries({ queryKey: ['profile-stats', user.id] })
      ]);

      return true;
    } catch (error) {
      console.error('❌ Accessory submission error:', error);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      toast({
        title: "Error",
        description: "Something went wrong. Try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleDelete = async (accessoryId: string) => {
    try {
      await deleteAccessory.mutateAsync(accessoryId);
      toast({
        title: "Success",
        description: "Accessory deleted successfully",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateField = (field: keyof AccessoryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return {
    formData,
    errors,
    updateField,
    setFormData,
    handleSubmit,
    handleDelete,
    isLoading: createAccessory.isPending || updateAccessory.isPending || deleteAccessory.isPending,
  };
};
