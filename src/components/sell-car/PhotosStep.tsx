
import { Camera, Upload, Star } from 'lucide-react';

const PhotosStep = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Photos</h2>
      <div className="text-sm text-gray-600 mb-4">
        <p className="mb-2">Include exterior, interior, engine, and documents photos. Upload up to 10 photos.</p>
        <p className="text-xs text-blue-600">💡 Tip: First photo will be your cover photo</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((index) => (
          <div key={index} className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer relative">
            <div className="text-center">
              <Camera className="h-6 w-6 text-gray-400 mx-auto mb-1" />
              <span className="text-xs text-gray-500">
                {index === 1 ? 'Cover Photo' : `Photo ${index}`}
              </span>
            </div>
            {index === 1 && (
              <Star className="h-4 w-4 text-orange-500 absolute top-1 right-1" />
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center space-x-4 p-4 bg-blue-50 rounded-lg">
        <Upload className="h-5 w-5 text-blue-600" />
        <span className="text-sm text-blue-800">Drag & drop photos here or click to browse</span>
      </div>
    </div>
  );
};

export default PhotosStep;
