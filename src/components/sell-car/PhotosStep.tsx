import { useState } from 'react';
import { Camera, Upload, Star, ImagePlus, Plus } from 'lucide-react';

const MAX_PHOTOS = 10;
const INITIAL_PHOTOS = 4;

const PhotosStep = () => {
  const [visibleBoxes, setVisibleBoxes] = useState(INITIAL_PHOTOS);

  const handleAddMore = () => {
    setVisibleBoxes((prev) => Math.min(prev + 2, MAX_PHOTOS));
  };

  return (
    <div className="space-y-4 pb-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Upload Photos</h2>
        <div className="text-sm text-gray-600">
          <p className="mb-1">Include exterior, interior, engine, and documents photos. Upload up to 10 photos.</p>
          <p className="text-xs text-blue-600">💡 Tip: First photo will be your cover photo</p>
        </div>
      </div>
      {/* Unified grid layout for both mobile and desktop */}
      <div className="w-full px-4 md:px-0">
        {/* Mobile grid */}
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto md:hidden">
          {[...Array(visibleBoxes)].map((_, index) => (
            <div
              key={index}
              className={
                index === 0
                  ? 'w-full h-28 border-2 border-dashed border-primary rounded-lg flex flex-col items-center justify-center bg-white hover:bg-blue-50 hover:border-primary/70 cursor-pointer relative transition-colors group'
                  : 'w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-primary/50 cursor-pointer relative transition-colors group'
              }
            >
              <div className="text-center">
                <Camera className={index === 0 ? 'h-5 w-5 text-primary mx-auto mb-1 group-hover:text-primary/70' : 'h-4 w-4 text-gray-400 mx-auto mb-1 group-hover:text-primary/70'} />
                <span className={index === 0 ? 'text-xs font-semibold text-primary block' : 'text-xs text-gray-500 block'}>
                  {index === 0 ? 'Cover Photo' : `Photo ${index + 1}`}
                </span>
              </div>
              {index === 0 && (
                <Star className="h-4 w-4 text-orange-500 absolute top-1 right-1" />
              )}
            </div>
          ))}
        </div>
        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-3 gap-3 justify-center mx-auto max-w-none">
          {[...Array(visibleBoxes)].map((_, index) => (
            <div
              key={index}
              className={
                index === 0
                  ? 'w-full h-36 border-2 border-dashed border-primary rounded-lg flex flex-col items-center justify-center bg-white hover:bg-blue-50 hover:border-primary/70 cursor-pointer relative transition-colors group'
                  : 'w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-primary/50 cursor-pointer relative transition-colors group'
              }
            >
              <div className="text-center">
                <Camera className={index === 0 ? 'h-5 w-5 text-primary mx-auto mb-1 group-hover:text-primary/70' : 'h-4 w-4 text-gray-400 mx-auto mb-1 group-hover:text-primary/70'} />
                <span className={index === 0 ? 'text-xs font-semibold text-primary block' : 'text-xs text-gray-500 block'}>
                  {index === 0 ? 'Cover Photo' : `Photo ${index + 1}`}
                </span>
              </div>
              {index === 0 && (
                <Star className="h-4 w-4 text-orange-500 absolute top-1 right-1" />
              )}
            </div>
          ))}
        </div>
        {/* Add more photos button (both views) */}
        {visibleBoxes < MAX_PHOTOS && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={handleAddMore}
              className="flex items-center gap-2 px-4 py-2 rounded-md border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              <Plus className="h-4 w-4" /> Add more photos
            </button>
          </div>
        )}
        {/* Drag & drop area (both views) */}
        <div className="mt-4">
          <div className="flex items-center justify-center space-x-3 p-4 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200 hover:bg-blue-100 cursor-pointer transition-colors">
            <ImagePlus className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-blue-800 font-medium">Drag & drop photos here or click to browse</span>
          </div>
        </div>
      </div>
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Supported formats: JPG, PNG, HEIC (max 5MB each)</p>
        <p>• Clear, well-lit photos get more inquiries</p>
        <p>• Include all 4 sides, interior, dashboard, and engine bay</p>
      </div>
    </div>
  );
};

export default PhotosStep;
