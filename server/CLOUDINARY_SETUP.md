# Cloudinary Integration Setup

## Overview
Cloudinary is integrated into the server for handling image and video uploads. All uploads are stored securely in your Cloudinary account.

## Configuration

### 1. Environment Variables
Add your Cloudinary credentials to the `.env` file in the server directory:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# File Upload Settings
MAX_FILE_SIZE=5242880  # 5MB in bytes (adjust as needed)
```

### 2. Get Cloudinary Credentials
1. Go to [Cloudinary](https://cloudinary.com/)
2. Sign up or log in to your account
3. Navigate to your Dashboard
4. Find your credentials:
   - **Cloud Name**: Found at the top of your dashboard
   - **API Key**: Found in the "Account Details" section
   - **API Secret**: Found in the "Account Details" section (click "Reveal" to see it)

## API Endpoints

All upload endpoints require authentication (JWT token).

### Upload Image
```http
POST /api/upload/image
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- image: <image-file>
```

**Response:**
```json
{
  "message": "Image uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "clipconnect/images/abc123",
    "format": "jpg",
    "size": "2.5 MB"
  }
}
```

### Upload Video
```http
POST /api/upload/video
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- video: <video-file>
```

**Response:**
```json
{
  "message": "Video uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/...",
    "publicId": "clipconnect/videos/xyz789",
    "format": "mp4",
    "duration": 30.5,
    "size": "15.2 MB"
  }
}
```

### Upload Any File (Auto-detect)
```http
POST /api/upload/file
Content-Type: multipart/form-data
Authorization: Bearer <token>

Body:
- file: <image-or-video-file>
```

### Delete File
```http
DELETE /api/upload/:publicId
Authorization: Bearer <token>
```

## Usage Examples

### Frontend (React/TypeScript)

#### Upload Image
```typescript
const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('http://localhost:5000/api/upload/image', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const data = await response.json();
  return data.data.url; // Returns Cloudinary URL
};
```

#### Upload Video
```typescript
const uploadVideo = async (file: File) => {
  const formData = new FormData();
  formData.append('video', file);

  const response = await fetch('http://localhost:5000/api/upload/video', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    body: formData
  });

  const data = await response.json();
  return data.data.url;
};
```

### Backend Integration

#### In Controllers
```typescript
import { uploadImage } from '../config/cloudinary';
import { bufferToDataURI } from '../utils/file.utils';

// Example: Update user profile picture
export const updateProfilePicture = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const dataURI = bufferToDataURI(req.file.buffer, req.file.mimetype);
    const result = await uploadImage(dataURI, 'clipconnect/profiles');

    // Update user model with the image URL
    await User.findByIdAndUpdate(req.user.id, {
      profilePicture: result.url
    });

    res.json({ url: result.url });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed' });
  }
};
```

## File Organization

Cloudinary files are organized in folders:
- `clipconnect/images` - General images
- `clipconnect/videos` - Video files
- `clipconnect/profiles` - Profile pictures
- `clipconnect/gigs` - Gig-related media

## Features

✅ **Automatic Optimization**: Images and videos are automatically optimized
✅ **Transformation**: Images are limited to 1000x1000px, maintaining aspect ratio
✅ **Format Conversion**: Automatic format selection for best performance
✅ **Quality Optimization**: Auto quality adjustment for faster loading
✅ **Secure Storage**: All files are stored securely with HTTPS URLs
✅ **Memory Efficient**: Uses memory storage (no disk writes)

## File Size Limits

- **Images**: 5MB (configurable via MAX_FILE_SIZE)
- **Videos**: 100MB (20x MAX_FILE_SIZE)

To change limits, update the `.env` file:
```env
MAX_FILE_SIZE=10485760  # 10MB for images
```

## Supported File Types

### Images
- JPEG/JPG
- PNG
- GIF
- WebP
- SVG

### Videos
- MP4
- MOV
- AVI
- WebM
- MKV

## Error Handling

Common errors and solutions:

1. **"Only image files are allowed!"**
   - Solution: Ensure you're uploading an image file to the `/image` endpoint

2. **"File too large"**
   - Solution: Compress your file or increase MAX_FILE_SIZE in .env

3. **"Failed to upload image"**
   - Solution: Check your Cloudinary credentials in .env file

4. **"No file uploaded"**
   - Solution: Ensure the FormData field name matches the middleware configuration

## Testing

Test the upload functionality using tools like:
- **Postman**: Import the API endpoints and test with sample files
- **Thunder Client**: VS Code extension for API testing
- **cURL**: Command-line testing

Example cURL command:
```bash
curl -X POST http://localhost:5000/api/upload/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@/path/to/image.jpg"
```

## Next Steps

To integrate Cloudinary in your existing models (User, Gig, etc.):

1. Add image/video URL fields to your models
2. Use the upload middleware in your routes
3. Save the returned Cloudinary URLs to your database
4. Display images/videos using the Cloudinary URLs in your frontend

## Support

For issues or questions:
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Multer Documentation](https://github.com/expressjs/multer)
