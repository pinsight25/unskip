
import { useState } from 'react';
import { Camera, Upload, Phone, MapPin, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CustomInput } from '@/components/ui/CustomInput';
import { Label } from '@/components/ui/label';
import { CustomTextarea } from '@/components/ui/CustomTextarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccessoryFormData } from '@/hooks/useAccessoryForm';
import { cloudinaryConfig } from '@/config/cloudinary';

interface PhotosContactStepProps {
  formData: AccessoryFormData;
  onUpdate: (updates: Partial<AccessoryFormData>) => void;
  onPhoneVerification: () => void;
}

interface PhotoData {
  id: string;
  preview: string;
  cloudinaryUrl?: string;
  isCover?: boolean;
}

const PhotosContactStep = ({ formData, onUpdate }: PhotosContactStepProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Convert existing images to PhotoData format
  const photos: PhotoData[] = (formData.images || []).map((img, idx) => ({
    id: `existing-${idx}`,
    preview: img,
    cloudinaryUrl: img,
    isCover: idx === 0
  }));

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
    
    setUploading(true);
    try {
      const newPhotos: PhotoData[] = [];
      
      for (const file of Array.from(files)) {
        if (file.type.startsWith('image/')) {
          const cloudinaryUrl = await uploadToCloudinary(file);
          newPhotos.push({
            id: `new-${Date.now()}-${Math.random()}`,
            preview: URL.createObjectURL(file),
            cloudinaryUrl: cloudinaryUrl,
            isCover: photos.length === 0 && newPhotos.length === 0
          });
        }
      }
      
      const updatedPhotos = [...photos, ...newPhotos].slice(0, 8);
      onUpdate({
        images: updatedPhotos.map(p => p.cloudinaryUrl || p.preview)
      });
    } catch (error) {
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const updatedPhotos = photos.filter((_, i) => i !== index);
    onUpdate({ 
      images: updatedPhotos.map(p => p.cloudinaryUrl || p.preview)
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Photos & Contact Details</h2>
        <p className="text-gray-600">Add photos and your contact information</p>
      </div>

      {/* Image Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Product Photos (Optional)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? 'border-primary bg-primary/5' : 'border-gray-300'
            }`}
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">Add Product Photos</p>
            <p className="text-gray-600 mb-4">
              {uploading ? 'Uploading...' : 'Drag and drop or click to upload (Max 8 photos)'}
            </p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
              id="image-upload"
              aria-label="Upload product photos"
              disabled={uploading}
            />
            <label htmlFor="image-upload">
              <Button 
                type="button" 
                variant="outline" 
                className="cursor-pointer"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Choose Files'}
              </Button>
            </label>
          </div>

          {photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {photos.map((photo, index) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.cloudinaryUrl || photo.preview}
                    alt={`Product ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove photo ${index + 1}`}
                    disabled={uploading}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Contact Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sellerName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Your Name *
              </Label>
              <CustomInput
                id="sellerName"
                type="text"
                value={formData.sellerName || ''}
                onChange={(e) => onUpdate({ sellerName: e.target.value })}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <CustomInput
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => onUpdate({ phone: e.target.value })}
                placeholder="+91 98765 43210"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter 10-digit mobile number (with or without +91)
              </p>
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email Address (Optional)</Label>
            <CustomInput
              id="email"
              type="email"
              value={formData.email || ''}
              onChange={(e) => onUpdate({ email: e.target.value })}
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location *
            </Label>
            <CustomInput
              id="location"
              value={formData.location}
              onChange={(e) => onUpdate({ location: e.target.value })}
              placeholder="City, State (e.g., Mumbai, Maharashtra)"
              required
            />
          </div>

          <div>
            <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
            <CustomTextarea
              id="additionalInfo"
              value={formData.additional_info || ''}
              onChange={(e) => onUpdate({ additional_info: e.target.value })}
              placeholder="Any additional details about the accessory..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhotosContactStep;
