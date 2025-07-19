import { cloudinaryConfig } from '@/config/cloudinary';
import { useState, useRef, useCallback } from 'react';
import { Camera, Star, ImagePlus, Plus, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const MAX_PHOTOS = 10;
const MIN_SLOTS = 4;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/heif'];

interface PhotoFile {
  file: File;
  preview: string;
  id: string;
  cloudinaryUrl?: string;
  isCover?: boolean;
}

interface PhotosStepProps {
  formData?: any;
  setFormData?: any;
  updateFormData?: (updates: any) => void;
  onUpdate?: (data: any) => void;
}

const PhotosStep = ({ formData = {}, setFormData, updateFormData, onUpdate }: PhotosStepProps) => {
  // Ensure photos are always objects with cloudinaryUrl
  const initialPhotos = (formData.photos || []).map((p: any, idx: number) => {
    if (typeof p === 'string') {
      return { id: `persisted-${idx}`, preview: p, cloudinaryUrl: p, isCover: idx === 0 };
    }
    // If already an object, ensure cloudinaryUrl is present
    return {
      ...p,
      cloudinaryUrl: p.cloudinaryUrl || p.preview || '',
      isCover: p.isCover || idx === 0
    };
  });
  const [photos, setPhotos] = useState<PhotoFile[]>(initialPhotos);
  const [coverPhotoIndex, setCoverPhotoIndex] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  // Add upload state
  const [uploading, setUploading] = useState(false);

  // Validate file
  const validateFile = (file: File): { valid: boolean; message: string } => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return { valid: false, message: 'Please upload JPG, PNG, or HEIC files only' };
    }
    if (file.size > MAX_FILE_SIZE) {
      return { valid: false, message: 'File size must be less than 5MB' };
    }
    return { valid: true, message: '' };
  };

  // Create preview URL
  const createPreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  // Add Cloudinary upload function
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    formData.append('folder', cloudinaryConfig.folder);

    try {
      const response = await fetch(cloudinaryConfig.uploadUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      throw error;
    }
  };

  // Update handleFileSelect to use Cloudinary and update both local and parent state
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    const newPhotos: PhotoFile[] = [];
    let hasError = false;
    try {
      for (let i = 0; i < files.length; i++) {
        if (photos.length + newPhotos.length >= MAX_PHOTOS) {
          toast({
            title: 'Photo Limit Reached',
            description: `You can upload maximum ${MAX_PHOTOS} photos`,
            variant: 'destructive',
          });
          break;
        }
        const file = files[i];
        const validation = validateFile(file);
        if (!validation.valid) {
          toast({
            title: 'Invalid File',
            description: validation.message,
            variant: 'destructive',
          });
          hasError = true;
          continue;
        }
        setUploading(true);
        try {
          const cloudinaryUrl = await uploadToCloudinary(file);
          const newPhoto = {
            id: Date.now().toString() + '-' + i,
            file: file,
            preview: URL.createObjectURL(file),
            cloudinaryUrl: cloudinaryUrl,
            isCover: photos.length + newPhotos.length === 0
          };
          newPhotos.push(newPhoto);
          toast({ title: "Photo uploaded", description: "Photo uploaded successfully" });
        } catch (error) {
          toast({ title: "Upload failed", description: "Please try again", variant: "destructive" });
          hasError = true;
        } finally {
          setUploading(false);
        }
      }
      if (newPhotos.length > 0) {
        const updatedPhotos = [...photos, ...newPhotos].slice(0, MAX_PHOTOS);
        setPhotos(updatedPhotos);
        setCoverPhotoIndex(0);
        // Update parent formData with full photo objects
        if (updateFormData) {
          updateFormData({ photos: updatedPhotos, coverPhotoIndex: 0 });
        } else if (onUpdate) {
          onUpdate({ ...formData, photos: updatedPhotos });
        } else if (setFormData) {
          setFormData((prev: any) => ({ ...prev, photos: updatedPhotos, coverPhotoIndex: 0 }));
        }
        toast({ title: 'Photos Added', description: `Successfully added ${newPhotos.length} photo${newPhotos.length > 1 ? 's' : ''}` });
      }
    } finally {
      setIsUploading(false);
    }
  }, [photos, setFormData, onUpdate, formData, toast]);

  // Handle drag events
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);
  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  }, []);
  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle box click
  const handleBoxClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Remove photo
  const removePhoto = (photoId: string) => {
    const idx = photos.findIndex((p) => p.id === photoId);
    if (idx === -1) return;
    const updated = photos.filter((p) => p.id !== photoId);
    let newCover = coverPhotoIndex;
    if (idx === coverPhotoIndex) newCover = 0;
    else if (idx < coverPhotoIndex) newCover = coverPhotoIndex - 1;
    setPhotos(updated);
    setCoverPhotoIndex(newCover);
    // Update parent with full photo objects, not just preview URLs
    if (onUpdate) {
      onUpdate({ ...formData, photos: updated });
    } else if (setFormData) {
      setFormData((prev: any) => ({
        ...prev,
        photos: updated, // Pass full objects, not just preview URLs
        coverPhotoIndex: newCover,
      }));
    }
    toast({ title: 'Photo Removed', description: 'Photo has been removed successfully' });
  };

  // Set cover photo
  const setCoverPhoto = (idx: number) => {
    setCoverPhotoIndex(idx);
    if (setFormData) {
      setFormData((prev: any) => ({
        ...prev,
        coverPhotoIndex: idx,
      }));
    }
  };

  // Add more photo slots (just opens file picker)
  const handleAddMore = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Calculate slots to show
  const slots = Math.max(photos.length + 1, MIN_SLOTS);
  const canAddMore = photos.length < MAX_PHOTOS;

  return (
    <div className="space-y-4 pb-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Upload Photos</h2>
        <div className="text-sm text-gray-600">
          <p className="mb-1">Include exterior, interior, engine, and documents photos. Upload up to 10 photos.</p>
          <p className="text-xs text-blue-600">💡 Tip: First photo will be your cover photo</p>
          <p className="text-xs text-gray-500 mt-1">You can select multiple images at once using your desktop. On some mobile devices, you may only be able to select one image at a time due to browser limitations.</p>
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
        aria-label="Upload car photos"
      />
      <div className="w-full px-4 md:px-0">
        {/* Mobile grid */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto md:hidden">
          {Array.from({ length: Math.min(slots, MAX_PHOTOS) }).map((_, idx) => {
            if (idx < photos.length) {
              const photo = photos[idx];
              return (
                <div key={photo.id} className="relative w-full h-28 rounded-lg overflow-hidden border-2 border-gray-200 group">
                  <img src={photo.cloudinaryUrl || photo.preview} alt={`Car photo ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all">
                    <div className="absolute top-1 right-1 flex gap-1">
                      {coverPhotoIndex === idx && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-orange-500 text-white rounded">
                          <Star className="h-3 w-3 mr-1" /> Cover Photo
                        </span>
                      )}
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        aria-label={`Remove photo ${idx + 1}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    {coverPhotoIndex !== idx && (
                      <button
                        onClick={() => setCoverPhoto(idx)}
                        className="absolute top-1 left-1 h-6 px-2 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                        aria-label={`Set as cover photo`}
                      >
                        Set Cover
                      </button>
                    )}
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-sm">Uploading...</p>
                      </div>
              </div>
              )}
            </div>
              );
            } else {
              // Empty slot
              return (
                <div
                  key={`empty-${idx}`}
                  onClick={canAddMore ? handleBoxClick : undefined}
                  className={`w-full h-28 border-2 border-dashed rounded-lg flex flex-col items-center justify-center bg-gray-50 transition-colors group cursor-pointer ${canAddMore ? 'hover:bg-gray-100 hover:border-primary/50' : 'opacity-50 cursor-not-allowed'}`}
                >
                  <Camera className="h-4 w-4 text-gray-400 mx-auto mb-1 group-hover:text-primary/70" />
                  <span className="text-xs text-gray-500 block">Photo {idx + 1}</span>
                </div>
              );
            }
          })}
        </div>
        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-3 justify-center mx-auto max-w-none">
          {Array.from({ length: Math.min(slots, MAX_PHOTOS) }).map((_, idx) => {
            if (idx < photos.length) {
              const photo = photos[idx];
              return (
                <div key={photo.id} className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-200 group">
                  <img src={photo.cloudinaryUrl || photo.preview} alt={`Car photo ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all">
                    <div className="absolute top-1 right-1 flex gap-1">
                      {coverPhotoIndex === idx && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-orange-500 text-white rounded">
                          <Star className="h-3 w-3 mr-1" /> Cover Photo
                        </span>
                      )}
                      <button
                        onClick={() => removePhoto(photo.id)}
                        className="h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                        aria-label={`Remove photo ${idx + 1}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                    {coverPhotoIndex !== idx && (
                      <button
                        onClick={() => setCoverPhoto(idx)}
                        className="absolute top-1 left-1 h-6 px-2 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
                        aria-label={`Set as cover photo`}
                      >
                        Set Cover
                      </button>
                    )}
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-sm">Uploading...</p>
                      </div>
              </div>
              )}
            </div>
              );
            } else {
              // Empty slot
              return (
                <div
                  key={`empty-${idx}`}
                  onClick={canAddMore ? handleBoxClick : undefined}
                  className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center bg-gray-50 transition-colors group cursor-pointer ${canAddMore ? 'hover:bg-gray-100 hover:border-primary/50' : 'opacity-50 cursor-not-allowed'}`}
                >
                  <Camera className="h-4 w-4 text-gray-400 mx-auto mb-1 group-hover:text-primary/70" />
                  <span className="text-xs text-gray-500 block">Photo {idx + 1}</span>
                </div>
              );
            }
          })}
        </div>
        {/* Add more photos button */}
        {canAddMore && (
          <div className="mt-4 flex justify-center">
            <Button
              type="button"
              onClick={handleAddMore}
              disabled={isUploading || !canAddMore}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              {isUploading ? 'Uploading...' : `Add more photos (${MAX_PHOTOS - photos.length} remaining)`}
            </Button>
          </div>
        )}
        {/* Drag & drop area */}
        {canAddMore && (
        <div className="mt-4">
            <div
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={handleBoxClick}
              className={`flex items-center justify-center space-x-3 p-6 rounded-lg border-2 border-dashed transition-colors cursor-pointer ${
                dragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-blue-200 bg-blue-50 hover:bg-blue-100'
              }`}
            >
            <ImagePlus className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-blue-800 font-medium">
                {dragActive ? 'Drop photos here' : 'Drag & drop photos here or click to browse'}
              </span>
            </div>
          </div>
        )}
        {/* Max limit message */}
        {!canAddMore && (
          <div className="mt-4 text-center text-red-600 text-sm font-medium">Maximum 10 photos allowed</div>
        )}
      </div>
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Supported formats: JPG, PNG, HEIC (max 5MB each)</p>
        <p>• Clear, well-lit photos get more inquiries</p>
        <p>• Include all 4 sides, interior, dashboard, and engine bay</p>
        <p>• {photos.length} of {MAX_PHOTOS} photos uploaded</p>
      </div>
      {photos.length === 0 && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <span className="text-sm text-yellow-800">
            Photos help buyers make informed decisions. Upload at least 3-5 photos for better results.
          </span>
        </div>
      )}
    </div>
  );
};

export default PhotosStep;
