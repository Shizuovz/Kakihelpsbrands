# Image Upload Feature

## Overview
This feature allows service providers to upload images for their hoardings/unipoles directly from their system.

## Setup

### Dependencies
- `multer` - File upload middleware
- `uploads/` directory - Stores uploaded files

### Server Configuration
- **Endpoint**: `POST /api/upload`
- **Authentication**: Required (Bearer token)
- **Max Files**: 5 images per request
- **Max Size**: 10MB per file
- **Allowed Types**: Images only (PNG, JPG, GIF)
- **Storage**: Local filesystem in `uploads/` directory

### File Access
Uploaded files are accessible via:
```
http://localhost:3001/uploads/{filename}
```

## Usage

### Frontend Integration
1. User selects images via file input
2. Files are validated (size, type)
3. FormData is created and sent to `/api/upload`
4. Server processes files and returns URLs
5. URLs are stored in hoarding data

### Error Handling
- File size validation (10MB limit)
- File type validation (images only)
- Authentication required
- Graceful fallback to URL input

## File Naming
Files are named with timestamp and random suffix:
```
images-{timestamp}-{random}.{extension}
```

## Security
- Authentication required for uploads
- File type validation
- Size limits enforced
- Files stored in dedicated directory

## Future Enhancements
- Cloud storage integration (AWS S3, Cloudinary)
- Image compression and optimization
- CDN integration for faster delivery
- Image watermarking for branding
