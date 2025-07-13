import { cloudinaryConfig } from '@/config/cloudinary';

export const uploadToCloudinary = async (file: File, folder?: string): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  formData.append('folder', folder || cloudinaryConfig.folder);

  try {
    const response = await fetch(cloudinaryConfig.uploadUrl, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    throw new Error('Failed to upload file. Please try again.');
  }
};

export const uploadMultipleToCloudinary = async (files: File[], folder?: string): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadToCloudinary(file, folder));
  return Promise.all(uploadPromises);
}; 