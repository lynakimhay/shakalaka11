import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    // Check file size limit (50MB max for Vercel)
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > 50 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 50MB for video uploads.' 
      }, { status: 413 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'movies';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Additional size check for videos
    const isVideo = file.type.startsWith('video/');
    if (isVideo && file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'Video file too large. Maximum size is 50MB.' 
      }, { status: 413 });
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    
    // Convert buffer to base64 data URL
    const base64String = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64String}`;
    
    // Determine resource type
    const resourceType = isVideo ? 'video' : 'image';

    // Sanitize filename and create safe public_id
    const sanitizedName = file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '');
    const publicId = `${Date.now()}-${sanitizedName}`;

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUrl, {
      resource_type: resourceType,
      folder: folder,
      public_id: publicId,
      overwrite: true,
      chunk_size: 6000000, // 6MB chunks for large files
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Handle different error types
    let errorMessage = 'Upload failed';
    if (error instanceof Error) {
      if (error.message.includes('Request Entity Too Large')) {
        errorMessage = 'File too large. Maximum size is 50MB.';
      } else if (error.message.includes('JSON')) {
        errorMessage = 'Invalid file format. Please try a different file.';
      } else {
        errorMessage = error.message;
      }
    }
    
    return NextResponse.json({ 
      error: errorMessage 
    }, { status: 500 });
  }
}
