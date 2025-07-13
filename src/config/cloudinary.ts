export const cloudinaryConfig = {
  cloudName: 'dcunskip',
  uploadPreset: 'unskip-cars',
  folder: 'unskip/cars',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  acceptedFormats: ['jpg', 'jpeg', 'png', 'webp'],
  uploadUrl: 'https://api.cloudinary.com/v1_1/dcunskip/image/upload'
}; 