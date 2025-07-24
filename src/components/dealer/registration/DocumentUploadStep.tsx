
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload, X, ImagePlus } from 'lucide-react';
import { useState, useRef } from 'react';
import { DealerFormData } from '@/hooks/useDealerRegistrationForm';

interface DocumentUploadStepProps {
  formData: DealerFormData;
  onFileUpload: (field: string, files: FileList | null) => void;
  onTermsChange: (checked: boolean | 'indeterminate') => void;
}

const DocumentUploadStep = ({ formData, onFileUpload, onTermsChange }: DocumentUploadStepProps) => {
  // Always derive previews from formData
  const photoPreviews = (formData.documents.shopPhotos || []).map((file: File) => URL.createObjectURL(file));
  const fileInputRef = useRef<HTMLInputElement>(null);
  const panCardInputRef = useRef<HTMLInputElement>(null);

  const [businessDocError, setBusinessDocError] = useState('');
  const [panCardError, setPanCardError] = useState('');
  const [shopPhotosError, setShopPhotosError] = useState('');

  const isValidBusinessDoc = (file: File | null) => !!file;
  const isValidPanCard = (file: File | null) => !!file;
  const isValidShopPhotos = (arr: File[]) => arr && arr.length > 0;

  // Dynamic label for business document
  const businessDocLabel =
    formData.businessDocType === 'gst_certificate' ? 'GST Certificate' :
    formData.businessDocType === 'msme_certificate' ? 'MSME/Udyam Certificate' :
    formData.businessDocType === 'shop_license' ? 'Shop & Establishment License' :
    formData.businessDocType === 'trade_license' ? 'Trade License' :
    'Business Registration Document';

  // Handle shop photos
  const handleShopPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    // Combine existing and new files, up to 3
    const existingFiles = formData.documents.shopPhotos || [];
    const newFiles = Array.from(files);
    const combined = [...existingFiles, ...newFiles].slice(0, 3);
    const dataTransfer = new DataTransfer();
    combined.forEach(file => dataTransfer.items.add(file));
    onFileUpload('shopPhotos', dataTransfer.files);
  };
  const handleRemovePhoto = (idx: number) => {
    const newFiles = formData.documents.shopPhotos.filter((_: File, i: number) => i !== idx);
    const dataTransfer = new DataTransfer();
    newFiles.forEach((file: File) => dataTransfer.items.add(file));
    onFileUpload('shopPhotos', dataTransfer.files);
  };

  // Set cover photo (move to front)
  const handleSetCoverPhoto = (idx: number) => {
    const files = formData.documents.shopPhotos;
    if (!files || files.length < 2 || idx === 0) return;
    const newFiles = [files[idx], ...files.slice(0, idx), ...files.slice(idx + 1)];
    const dataTransfer = new DataTransfer();
    newFiles.forEach((file: File) => dataTransfer.items.add(file));
    onFileUpload('shopPhotos', dataTransfer.files);
  };

  // Handle business document upload
  const handleBusinessDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileUpload('businessDocument', e.target.files);
  };

  // Handle PAN card upload
  const handlePanCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFileUpload('panCard', e.target.files);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Document Upload</h2>
        <div className="space-y-4">
          {/* Business Document Upload */}
          <div>
            <Label htmlFor="businessDocument">{businessDocLabel} *</Label>
            <input
              id="businessDocument"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleBusinessDocChange}
              onBlur={() => setBusinessDocError(!isValidBusinessDoc(formData.documents.businessDocument) ? 'Business document is required' : '')}
              className="hidden"
              aria-label={`Upload ${businessDocLabel}`}
              ref={fileInputRef}
            />
            <label htmlFor="businessDocument" className="cursor-pointer w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                {formData.documents.businessDocument ?
                  `Selected: ${formData.documents.businessDocument.name}` :
                  `Click to upload ${businessDocLabel} (PDF, JPG, PNG)`
                }
              </p>
            </label>
            {businessDocError && <p className="text-red-500 text-sm mt-1">{businessDocError}</p>}
          </div>
          {/* PAN Card Upload */}
          <div>
            <Label htmlFor="panCard">PAN Card *</Label>
            <input
              id="panCard"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handlePanCardChange}
              onBlur={() => setPanCardError(!isValidPanCard(formData.documents.panCard) ? 'PAN card is required' : '')}
              className="hidden"
              aria-label="Upload PAN Card"
              ref={panCardInputRef}
            />
            <label htmlFor="panCard" className="cursor-pointer w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
              <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                {formData.documents.panCard ?
                  `Selected: ${formData.documents.panCard.name}` :
                  'Click to upload PAN Card (PDF, JPG, PNG)'
                }
              </p>
            </label>
            {panCardError && <p className="text-red-500 text-sm mt-1">{panCardError}</p>}
          </div>
          {/* Shop Photos Upload (unchanged) */}
          <Label htmlFor="shopPhotos">Shop Photos * (up to 3)</Label>
          <input
            ref={fileInputRef}
            id="shopPhotos"
            type="file"
            accept="image/*"
            multiple
            onChange={handleShopPhotosChange}
            onBlur={() => setShopPhotosError(!isValidShopPhotos(formData.documents.shopPhotos) ? 'At least one shop photo is required' : '')}
            className="hidden"
            aria-label="Upload shop photos"
          />
          <div className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {photoPreviews.map((preview, idx) => (
                <div key={idx} className="relative group w-full h-24 md:h-28 rounded-lg overflow-hidden border-2 border-gray-200">
                  <img src={preview} alt={`Shop photo ${idx + 1}`} className="w-full h-full object-cover" />
                  {/* Cover badge */}
                  {idx === 0 && (
                    <span className="absolute top-1 left-1 bg-orange-500 text-white text-xs px-2 py-0.5 rounded z-10">Cover</span>
                  )}
                  {/* Set as Cover button for non-cover photos */}
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetCoverPhoto(idx)}
                      className="absolute top-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded z-10 hover:bg-blue-600"
                    >
                      Set as Cover
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(idx)}
                    className="absolute top-1 right-1 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors z-10"
                    aria-label={`Remove shop photo ${idx + 1}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {photoPreviews.length < 3 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-24 md:h-28 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <ImagePlus className="h-6 w-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">Add Photo</span>
                </button>
              )}
            </div>
            {photoPreviews.length > 0 && (
              <p className="text-xs text-gray-600 mt-2">{photoPreviews.length}/3 photos selected</p>
            )}
            {shopPhotosError && <p className="text-red-500 text-sm mt-1">{shopPhotosError}</p>}
          </div>
          {/* Terms & Conditions */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={onTermsChange}
              className="h-4 w-4"
            />
            <Label htmlFor="agreeToTerms" className="text-sm cursor-pointer">
              I agree to the Terms & Conditions and Privacy Policy *
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploadStep;
