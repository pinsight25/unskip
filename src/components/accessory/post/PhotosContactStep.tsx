
import { useState } from 'react';
import { Camera, Upload, Phone, MessageCircle, Shield, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AccessoryFormData } from '@/hooks/useAccessoryForm';
import { updateFormField } from '@/utils/formHelpers';

interface PhotosContactStepProps {
  formData: AccessoryFormData;
  onUpdate: (updates: Partial<AccessoryFormData>) => void;
  onPhoneVerification: () => void;
}

const PhotosContactStep = ({ formData, onUpdate }: PhotosContactStepProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newImages: string[] = [];
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        newImages.push(url);
      }
    });
    
    onUpdate({
      images: [...formData.images, ...newImages].slice(0, 8)
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    onUpdate({ images: updatedImages });
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
            <p className="text-gray-600 mb-4">Drag and drop or click to upload (Max 8 photos)</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleImageUpload(e.target.files)}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button type="button" variant="outline" className="cursor-pointer">
                Choose Files
              </Button>
            </label>
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 transition-opacity"
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
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
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
            <div>
              <Label htmlFor="email">Email Address (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => onUpdate({ email: e.target.value })}
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location *
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => onUpdate({ location: e.target.value })}
              placeholder="City, State (e.g., Mumbai, Maharashtra)"
              required
            />
          </div>

          <div>
            <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
            <Textarea
              id="additionalInfo"
              value={formData.additionalInfo}
              onChange={(e) => onUpdate({ additionalInfo: e.target.value })}
              placeholder="Any additional details about the accessory..."
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="whatsappContact"
                checked={formData.whatsappContact}
                onCheckedChange={(checked) => onUpdate(updateFormField(formData, 'whatsappContact', checked))}
              />
              <Label htmlFor="whatsappContact" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Allow WhatsApp contact
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="verifiedSeller"
                checked={formData.verifiedSeller}
                onCheckedChange={(checked) => onUpdate(updateFormField(formData, 'verifiedSeller', checked))}
              />
              <Label htmlFor="verifiedSeller" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Request seller verification
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhotosContactStep;
