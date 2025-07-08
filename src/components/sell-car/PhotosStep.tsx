
import { Camera, Upload, Star, ImagePlus } from 'lucide-react';

const PhotosStep = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Upload Photos</h2>
        <div className="text-sm text-gray-600">
          <p className="mb-1">Include exterior, interior, engine, and documents photos. Upload up to 10 photos.</p>
          <p className="text-xs text-blue-600">💡 Tip: First photo will be your cover photo</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
          <div 
            key={index} 
            className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-primary/50 cursor-pointer relative transition-colors group"
          >
            <div className="text-center">
              <Camera className="h-4 w-4 text-gray-400 mx-auto mb-1 group-hover:text-primary/70" />
              <span className="text-xs text-gray-500 block">
                {index === 1 ? 'Cover' : `Photo ${index}`}
              </span>
            </div>
            {index === 1 && (
              <Star className="h-3 w-3 text-orange-500 absolute top-1 right-1" />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center space-x-3 p-4 bg-blue-50 rounded-lg border-2 border-dashed border-blue-200 hover:bg-blue-100 cursor-pointer transition-colors">
        <ImagePlus className="h-5 w-5 text-blue-600" />
        <span className="text-sm text-blue-800 font-medium">Drag & drop photos here or click to browse</span>
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
