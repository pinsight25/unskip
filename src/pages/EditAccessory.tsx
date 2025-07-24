import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useAccessoryForm } from '@/hooks/useAccessoryForm';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { useAccessory } from '@/hooks/queries/useAccessories';
import { cloudinaryConfig } from '@/config/cloudinary';
import { Camera, Upload, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AccessoryCategory } from '@/types/accessory';

const EditAccessory = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Fetch existing accessory data
  const { data: accessory, isLoading: isLoadingAccessory, error: accessoryError } = useAccessory(id!);
  
  const {
    formData,
    errors,
    updateField,
    handleSubmit,
    isLoading,
    setFormData,
  } = useAccessoryForm();

  // Pre-populate form when accessory data is loaded
  useEffect(() => {
    if (accessory && user) {
      setFormData({
        name: accessory.name || '',
        brand: accessory.brand || '',
        category: accessory.category || 'alloy-wheels' as AccessoryCategory, // Provide a valid default category
        price_min: accessory.price_min || 0,
        price_max: accessory.price_max || undefined,
        description: accessory.description || '',
        condition: accessory.condition || '',
        location: accessory.location || '',
        phone: accessory.phone || user.phone || '',
        availability: accessory.availability || 'in-stock',
        compatibility: accessory.compatibility || [],
        warranty: accessory.warranty || '',
        installation_available: accessory.installation_available || false,
        email: accessory.email || user.email || '',
        whatsapp_contact: accessory.whatsapp_contact || false,
        additional_info: accessory.additional_info || '',
        images: (accessory as any).images || [], // Cast to any to access images property
        sellerName: accessory.seller_name || user.name || '',
      });
    }
  }, [accessory, user, setFormData]);

  // Check if user owns this accessory
  const isOwner = accessory?.seller_id === user?.id;

  // Cloudinary upload function
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    formData.append('folder', 'unskip/accessories');

    const response = await fetch(cloudinaryConfig.uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || uploading) return;
    
    console.log('🔍 handleImageUpload called with files:', files.length);
    
    setUploading(true);
    try {
      const newImages: string[] = [];
      
      for (const file of Array.from(files)) {
        console.log('🔍 Processing file:', file.name, file.type);
        if (file.type.startsWith('image/')) {
          const cloudinaryUrl = await uploadToCloudinary(file);
          newImages.push(cloudinaryUrl);
          console.log('✅ Uploaded to Cloudinary:', cloudinaryUrl);
        } else {
          console.warn('⚠️ Skipping non-image file:', file.name);
        }
      }
      
      const updatedImages = [...(formData.images || []), ...newImages].slice(0, 8);
      updateField('images', updatedImages);
      
      toast({
        title: "Images Uploaded",
        description: `${newImages.length} image(s) uploaded successfully`,
      });
    } catch (error) {
      console.error('❌ Upload failed:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    console.log('🔍 handleDrop called');
    handleImageUpload(e.dataTransfer.files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('🔍 handleFileSelect called');
    handleImageUpload(e.target.files);
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    const updatedImages = (formData.images || []).filter((_, i) => i !== index);
    updateField('images', updatedImages);
  };

  const handleFormSubmit = async () => {
    // Debug: Log form data to see what's missing
    console.log('🔍 Form data before submission:', formData);
    console.log('🔍 Form errors:', errors);

    const success = await handleSubmit(true, id);
    if (success) {
      navigate(`/accessories/${id}`);
    }
  };

  // Loading state
  if (isLoadingAccessory) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-2xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
          <div className="mb-6">
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-6">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (accessoryError) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Accessory</h2>
          <p className="text-gray-600 mb-6">Unable to load the accessory details</p>
          <button 
            onClick={() => navigate('/accessories')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            Back to Accessories
          </button>
        </div>
      </div>
    );
  }

  // Not found or not owner
  if (!accessory || !isOwner) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Accessory Not Found</h2>
          <p className="text-gray-600 mb-6">This accessory doesn't exist or you don't have permission to edit it</p>
          <button 
            onClick={() => navigate('/accessories')}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            Back to Accessories
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-2xl mx-auto px-4 lg:px-6 py-4 lg:py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => navigate(`/accessories/${id}`)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Edit Accessory</h1>
          </div>
          <p className="text-sm lg:text-base text-gray-600">
            Update your accessory details and images
          </p>
        </div>

        {/* Form Content */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                  <p className="text-gray-600 text-sm mb-6">
                    Update your accessory's basic details
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Accessory Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                      placeholder="e.g., Alloy Wheels, Seat Covers"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Brand *
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => updateField('brand', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                      placeholder="e.g., Michelin, Bosch"
                    />
                    {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateField('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  >
                    <option value="">Select a category</option>
                    <option value="alloy-wheels">Alloy Wheels</option>
                    <option value="seat-covers">Seat Covers</option>
                    <option value="floor-mats">Floor Mats</option>
                    <option value="mobile-holders">Mobile Holders</option>
                    <option value="dash-cameras">Dash Cameras</option>
                    <option value="led-lights">LED Lights</option>
                    <option value="car-perfumes">Car Perfumes</option>
                    <option value="steering-covers">Steering Covers</option>
                    <option value="infotainment">Infotainment</option>
                    <option value="parking-sensors">Parking Sensors</option>
                  </select>
                  {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition *
                  </label>
                  <select
                    value={formData.condition}
                    onChange={(e) => updateField('condition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  >
                    <option value="">Select condition</option>
                    <option value="new">New</option>
                    <option value="like-new">Like New</option>
                    <option value="good">Good</option>
                    <option value="fair">Fair</option>
                    <option value="poor">Poor</option>
                  </select>
                  {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Warranty
                  </label>
                  <input
                    type="text"
                    value={formData.warranty || ''}
                    onChange={(e) => updateField('warranty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="e.g., 1 year manufacturer warranty, No warranty"
                  />
                  <p className="text-gray-500 text-xs mt-1">Leave empty if no warranty</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <input
                      type="checkbox"
                      checked={formData.installation_available || false}
                      onChange={(e) => updateField('installation_available', e.target.checked)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    Installation Service Available
                  </label>
                  <p className="text-gray-500 text-xs">Check if you provide installation service</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compatible Models
                  </label>
                  <input
                    type="text"
                    value={formData.compatibility?.join(', ') || ''}
                    onChange={(e) => updateField('compatibility', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="e.g., Honda City, Maruti Swift, Hyundai i20"
                  />
                  <p className="text-gray-500 text-xs mt-1">Enter car models separated by commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability *
                  </label>
                  <select
                    value={formData.availability}
                    onChange={(e) => updateField('availability', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  >
                    <option value="in-stock">In Stock</option>
                    <option value="order">On Order</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => updateField('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="e.g., Chennai, Tamil Nadu"
                  />
                  {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    placeholder="Describe your accessory in detail..."
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
              </div>

              {/* Pricing Section */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Pricing</h2>
                  <p className="text-gray-600 text-sm mb-6">
                    Update your asking price for the accessory
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      value={formData.price_min || ''}
                      onChange={(e) => updateField('price_min', e.target.value ? Number(e.target.value) : 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                      placeholder="0"
                      min="0"
                    />
                    {errors.price_min && <p className="text-red-500 text-sm mt-1">{errors.price_min}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Price (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.price_max || ''}
                      onChange={(e) => updateField('price_max', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                      placeholder="Optional"
                      min="0"
                    />
                    {errors.price_max && <p className="text-red-500 text-sm mt-1">{errors.price_max}</p>}
                  </div>
                </div>
              </div>

              {/* Image Upload Section */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Product Photos
                  </h2>
                  <p className="text-gray-600 text-sm mb-6">
                    Update photos to showcase your accessory (optional)
                  </p>
                </div>
                
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
                  }`}
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onClick={() => document.getElementById('image-upload')?.click()}
                >
                  <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">Add More Photos</p>
                  <p className="text-sm text-gray-600 mb-4">
                    {uploading ? 'Uploading...' : 'Drag and drop or click to upload (Max 8 photos)'}
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="image-upload"
                    aria-label="Upload product photos"
                    disabled={uploading}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="cursor-pointer"
                    disabled={uploading}
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById('image-upload')?.click();
                    }}
                  >
                    {uploading ? 'Uploading...' : 'Choose Files'}
                  </Button>
                </div>

                {/* Image Preview */}
                {formData.images && formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 lg:h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Contact Information Section */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  <p className="text-gray-600 text-sm mb-6">
                    Update how buyers can reach you
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-base"
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="whatsapp_contact"
                    checked={formData.whatsapp_contact}
                    onChange={(e) => updateField('whatsapp_contact', e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="whatsapp_contact" className="text-sm text-gray-700">
                    Allow WhatsApp contact
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  className="w-full bg-primary text-white py-3 text-base font-medium hover:bg-primary/90 transition-colors"
                  disabled={isLoading || uploading}
                >
                  {isLoading ? 'Updating...' : 'Update Accessory'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditAccessory; 