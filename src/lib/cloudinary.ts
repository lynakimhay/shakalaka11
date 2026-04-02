import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(file: File, folder: string = 'movies') {
  try {
    // Convert File to buffer
    const buffer = await file.arrayBuffer();
    
    // Determine resource type based on file type
    const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
    
    // Create a unique filename
    const publicId = `${Date.now()}-${file.name.split('.')[0]}`;
    
    // Convert buffer to base64 for Cloudinary upload
    const base64String = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64String}`;
    
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      dataUrl,
      {
        resource_type: resourceType,
        folder: folder,
        public_id: publicId,
        overwrite: true,
      }
    );

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

export async function deleteFromCloudinary(publicId: string, resourceType: 'video' | 'image' = 'image') {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return { success: true };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Delete failed' };
  }
}
