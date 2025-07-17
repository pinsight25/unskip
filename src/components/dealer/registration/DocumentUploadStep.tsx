
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Upload } from 'lucide-react';
import { DealerFormData } from '@/hooks/useDealerRegistrationForm';

interface DocumentUploadStepProps {
  formData: DealerFormData;
  onFileUpload: (field: string, files: FileList | null) => void;
  onTermsChange: (checked: boolean | 'indeterminate') => void;
}

const DocumentUploadStep = ({ formData, onFileUpload, onTermsChange }: DocumentUploadStepProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Document Upload</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="gstCertificate">GST Certificate *</Label>
            <div className="w-full h-24 md:w-32 md:h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-4 text-center">
              <input
                id="gstCertificate"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => onFileUpload('gstCertificate', e.target.files)}
                className="hidden"
                aria-label="Upload GST certificate"
              />
              <label htmlFor="gstCertificate" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {formData.documents.gstCertificate ? 
                    `Selected: ${formData.documents.gstCertificate.name}` : 
                    'Click to upload GST certificate (PDF, JPG, PNG)'
                  }
                </p>
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="shopLicense">Shop License/Registration *</Label>
            <div className="w-full h-24 md:w-32 md:h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-4 text-center">
              <input
                id="shopLicense"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => onFileUpload('shopLicense', e.target.files)}
                className="hidden"
                aria-label="Upload shop license"
              />
              <label htmlFor="shopLicense" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {formData.documents.shopLicense ? 
                    `Selected: ${formData.documents.shopLicense.name}` : 
                    'Click to upload shop license (PDF, JPG, PNG)'
                  }
                </p>
              </label>
            </div>
          </div>

          <div>
            <Label htmlFor="shopPhotos">Shop Photos * (up to 3)</Label>
            <div className="w-full h-24 md:w-32 md:h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-4 text-center">
              <input
                id="shopPhotos"
                type="file"
                accept=".jpg,.jpeg,.png"
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 3) {
                    alert('You can upload up to 3 shop photos.');
                    e.target.value = '';
                    return;
                  }
                  onFileUpload('shopPhotos', files);
                }}
                className="hidden"
                aria-label="Upload shop photos"
              />
              <label htmlFor="shopPhotos" className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {formData.documents.shopPhotos.length > 0 ?
                    `Selected: ${formData.documents.shopPhotos.length} photo(s)` :
                    'Click to upload up to 3 shop photos (JPG, PNG)'
                  }
                </p>
                {formData.documents.shopPhotos.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {Array.from(formData.documents.shopPhotos).slice(0, 3).map((file, idx) => (
                      <span key={idx} className="inline-block w-8 h-8 bg-gray-100 border rounded text-xs flex items-center justify-center overflow-hidden">
                        {file.name.length > 10 ? file.name.slice(0, 10) + '...' : file.name}
                      </span>
                    ))}
                  </div>
                )}
                {formData.documents.shopPhotos.length > 3 && (
                  <p className="text-xs text-red-500 mt-1">You can upload up to 3 photos only.</p>
                )}
              </label>
            </div>
          </div>

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
