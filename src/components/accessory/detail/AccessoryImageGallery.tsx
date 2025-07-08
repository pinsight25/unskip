
interface AccessoryImageGalleryProps {
  images: string[];
  name: string;
  selectedImage: number;
  onImageSelect: (index: number) => void;
}

const AccessoryImageGallery = ({ 
  images, 
  name, 
  selectedImage, 
  onImageSelect 
}: AccessoryImageGalleryProps) => {
  return (
    <div className="space-y-4">
      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
        <img
          src={images[selectedImage]}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="flex space-x-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onImageSelect(index)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                selectedImage === index ? 'border-primary' : 'border-gray-200'
              }`}
            >
              <img
                src={image}
                alt={`${name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AccessoryImageGallery;
