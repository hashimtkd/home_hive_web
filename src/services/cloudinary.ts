import api from './api';

interface CloudinarySignature {
  signature: string;
  timestamp: number;
  folder: string;
  apiKey: string;
  cloudName: string;
}

/**
 * Fetches a signed upload payload from the backend.
 * The backend uses Cloudinary API Secret server-side — nothing sensitive is exposed to the frontend.
 */
const getUploadSignature = async (): Promise<CloudinarySignature> => {
  const response = await api.get('/api/v1/admin/cloudinary/signature');
  return response.data;
};

/**
 * Uploads an image directly to Cloudinary using backend-signed parameters.
 * No upload preset or Cloudinary secret is needed in the frontend.
 *
 * @param file - The File to upload
 * @param onProgress - Optional callback reporting upload progress (0–100)
 * @returns The secure Cloudinary URL of the uploaded image
 */
export const uploadImageToCloudinary = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  // 1. Get signed payload from our backend
  const { signature, timestamp, folder, apiKey, cloudName } = await getUploadSignature();

  // 2. Build multipart form data with signed params
  const formData = new FormData();
  formData.append('file', file);
  formData.append('signature', signature);
  formData.append('timestamp', String(timestamp));
  formData.append('folder', folder);
  formData.append('api_key', apiKey);

  // 3. Upload directly to Cloudinary with progress tracking via XHR
  return new Promise<string>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const responseData = JSON.parse(xhr.responseText);
          resolve(responseData.secure_url);
        } catch {
          reject(new Error('Failed to parse Cloudinary response'));
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          reject(new Error(errorData?.error?.message || `Upload failed: ${xhr.statusText}`));
        } catch {
          reject(new Error(`Image upload failed: ${xhr.statusText}`));
        }
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network error during image upload'));
    };

    xhr.send(formData);
  });
};
