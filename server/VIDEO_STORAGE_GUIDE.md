# Video Storage System - ClipConnect

## Overview
All videos submitted by clippers are now stored in **Cloudinary** (cloud storage), not in MongoDB. This provides better performance, scalability, and video optimization.

## How Video Submission Works

### Current Flow:

1. **Clipper uploads video** → File selected in browser
2. **Upload to Cloudinary** → Video is uploaded to Cloudinary via `/api/upload/video`
3. **Get Cloudinary URL** → Cloudinary returns a permanent URL
4. **Submit application** → Only the URL is saved to MongoDB (not the actual video)
5. **Creator views video** → Video is streamed from Cloudinary URL

### Benefits:

✅ **No size limits** - MongoDB 16MB limit doesn't apply
✅ **Fast streaming** - Cloudinary CDN delivers videos globally
✅ **Automatic optimization** - Videos are compressed and optimized
✅ **Video transformations** - Can resize, crop, or convert formats
✅ **Bandwidth savings** - Don't serve large files from your server

## Video Submission Implementation

### Backend (Server)

#### Application Model
```typescript
// Location: server/src/models/Application.model.ts
submittedVideo: string;      // Cloudinary URL
videoPublicId: string;       // For deletion/management
```

#### Submit Video Controller
```typescript
// Location: server/src/controllers/application.controller.ts
// Expects: { videoUrl, videoPublicId }
// Saves: Only URLs to MongoDB, not video data
```

### Frontend (Client)

#### Step 1: Upload Video to Cloudinary
```typescript
const uploadVideo = async (videoFile: File) => {
  const token = localStorage.getItem("token");
  
  const formData = new FormData();
  formData.append("video", videoFile);

  const response = await fetch("http://localhost:5000/api/upload/video", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json();
  return {
    url: data.data.url,           // Cloudinary URL
    publicId: data.data.publicId  // For future reference
  };
};
```

#### Step 2: Submit Video URL to Application
```typescript
const submitVideoToApplication = async (applicationId: string, videoFile: File) => {
  // First, upload video to Cloudinary
  const { url, publicId } = await uploadVideo(videoFile);
  
  // Then, submit the URL to the application
  await gigService.submitVideo(applicationId, url, publicId);
};
```

## Storage Locations

### Videos: **Cloudinary**
- **Folder**: `clipconnect/videos/`
- **Format**: MP4, MOV, AVI, WebM, etc.
- **Max Size**: 100MB (configurable)
- **Optimization**: Automatic compression and format selection
- **Access**: Public URLs with CDN delivery

### Video Metadata: **MongoDB**
- **Collection**: `applications`
- **Fields**:
  - `submittedVideo`: Cloudinary URL (string)
  - `videoPublicId`: Cloudinary ID (string)
  - `submittedAt`: Submission timestamp (Date)

### Images: **Cloudinary**
- **Gig Images**: `clipconnect/images/`
- **Profile Pictures**: `clipconnect/profiles/`
- **Max Size**: 5MB (configurable)

## API Endpoints

### Upload Video
```http
POST /api/upload/video
Authorization: Bearer <token>
Content-Type: multipart/form-data

Body:
- video: <video-file>

Response:
{
  "message": "Video uploaded successfully",
  "data": {
    "url": "https://res.cloudinary.com/.../video.mp4",
    "publicId": "clipconnect/videos/abc123",
    "format": "mp4",
    "duration": 120.5,
    "size": "25.4 MB"
  }
}
```

### Submit Video to Application
```http
POST /api/applications/:id/submit
Authorization: Bearer <token>
Content-Type: application/json

Body:
{
  "videoUrl": "https://res.cloudinary.com/.../video.mp4",
  "videoPublicId": "clipconnect/videos/abc123"
}

Response:
{
  "message": "Video submitted successfully",
  "application": { ... }
}
```

## Complete Example: Video Submission Page

```tsx
import { useState } from "react";
import { gigService } from "@/services/gig.service";

export default function SubmitVideo({ applicationId }: { applicationId: string }) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        alert("Video must be under 100MB");
        return;
      }
      setVideoFile(file);
    }
  };

  const handleSubmit = async () => {
    if (!videoFile) return;

    setUploading(true);

    try {
      // Step 1: Upload to Cloudinary
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("video", videoFile);

      const uploadResponse = await fetch("http://localhost:5000/api/upload/video", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      // Step 2: Submit video URL to application
      await gigService.submitVideo(
        applicationId,
        uploadData.data.url,
        uploadData.data.publicId
      );

      alert("Video submitted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to submit video");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" accept="video/*" onChange={handleVideoChange} />
      <button onClick={handleSubmit} disabled={uploading || !videoFile}>
        {uploading ? "Uploading..." : "Submit Video"}
      </button>
    </div>
  );
}
```

## Video Management

### View Video
```tsx
// Videos can be displayed directly using the URL
<video src={application.submittedVideo} controls />
```

### Delete Video (Optional)
```http
DELETE /api/upload/:publicId
Authorization: Bearer <token>

// This deletes the video from Cloudinary
// You may want to also clear the URLs from MongoDB
```

## Configuration

### Cloudinary Settings (`.env`)
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MAX_FILE_SIZE=5242880  # 5MB for images
```

### Video Size Limits
- **Default**: 100MB (20x MAX_FILE_SIZE)
- **Location**: `server/src/middleware/upload.middleware.ts`
- **To change**: Modify the multiplier in `uploadVideo` middleware

```typescript
limits: {
  fileSize: env.maxFileSize * 20,  // Change 20 to your desired multiplier
}
```

## Migration Notes

### If You Have Existing Base64 Videos in MongoDB:

1. **Fetch applications with base64 videos**
2. **Upload each base64 video to Cloudinary**
3. **Update application records with Cloudinary URLs**
4. **Clear base64 data from MongoDB**

Example migration script:
```typescript
// Run this once to migrate existing videos
const migrateVideos = async () => {
  const applications = await Application.find({ 
    submittedVideo: { $exists: true, $ne: null }
  });

  for (const app of applications) {
    // Check if it's base64 (not a URL)
    if (app.submittedVideo.startsWith('data:')) {
      // Upload to Cloudinary
      const result = await uploadVideo(app.submittedVideo, 'clipconnect/videos');
      
      // Update with URL
      app.submittedVideo = result.url;
      app.videoPublicId = result.publicId;
      await app.save();
    }
  }
};
```

## Troubleshooting

### Error: "Failed to upload video"
- Check Cloudinary credentials in `.env`
- Verify file size is under limit
- Check video format is supported

### Error: "Video URL is required"
- Ensure video was uploaded to Cloudinary first
- Check that you're sending `videoUrl` not `videoData`

### Video not playing
- Verify Cloudinary URL is accessible
- Check video format is browser-compatible
- Ensure Cloudinary transformation settings are correct

## Summary

**Current System:**
- ✅ Videos stored in Cloudinary (cloud)
- ✅ URLs stored in MongoDB (database)
- ✅ Optimized, scalable, and fast
- ✅ No size limits or performance issues

**Old System (deprecated):**
- ❌ Videos stored as base64 in MongoDB
- ❌ 16MB document limit
- ❌ Slow queries and performance issues
- ❌ Not scalable

Your videos are safely stored in Cloudinary with permanent URLs! 🎥
