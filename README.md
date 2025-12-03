# QR Code Decoder API

A Node.js web API that accepts HTTP URLs of QR code images and returns the decoded content.

## Features

- ✅ Decode QR codes from remote image URLs
- ✅ Support for common image formats (PNG, JPG, GIF, BMP, etc.)
- ✅ RESTful API design
- ✅ Comprehensive error handling
- ✅ Health check endpoint
- ✅ Input validation

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd claude
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The API will start on port 3000 by default (or the port specified in the `PORT` environment variable).

## API Documentation

### Endpoints

#### 1. Decode QR Code

**Endpoint:** `POST /api/decode-qr`

Decodes a QR code from an image URL and returns the content.

**Request Body:**
```json
{
  "imageUrl": "https://example.com/path/to/qrcode.png"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": "Decoded QR code content",
  "imageUrl": "https://example.com/path/to/qrcode.png"
}
```

**Error Responses:**

- **400 Bad Request** - Invalid or missing imageUrl:
```json
{
  "success": false,
  "error": "imageUrl is required in request body"
}
```

- **404 Not Found** - No QR code found in image:
```json
{
  "success": false,
  "error": "No QR code found in the provided image"
}
```

- **500 Internal Server Error** - Processing error:
```json
{
  "success": false,
  "error": "Internal server error while processing QR code"
}
```

#### 2. Health Check

**Endpoint:** `GET /health`

Returns the health status of the API.

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2025-11-30T12:00:00.000Z"
}
```

#### 3. API Information

**Endpoint:** `GET /`

Returns information about the API and available endpoints.

**Response (200 OK):**
```json
{
  "name": "QR Code Decoder API",
  "version": "1.0.0",
  "endpoints": {
    "POST /api/decode-qr": "Decode QR code from image URL",
    "GET /health": "Health check",
    "GET /": "API information"
  },
  "usage": {
    "endpoint": "/api/decode-qr",
    "method": "POST",
    "body": {
      "imageUrl": "http://example.com/qrcode.png"
    }
  }
}
```

## Usage Examples

### cURL

```bash
curl -X POST http://localhost:3000/api/decode-qr \
  -H "Content-Type: application/json" \
  -d '{"imageUrl": "https://example.com/qrcode.png"}'
```

### JavaScript (fetch)

```javascript
const response = await fetch('http://localhost:3000/api/decode-qr', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    imageUrl: 'https://example.com/qrcode.png'
  })
});

const result = await response.json();
console.log(result.data); // Decoded QR code content
```

### Python (requests)

```python
import requests

response = requests.post('http://localhost:3000/api/decode-qr', json={
    'imageUrl': 'https://example.com/qrcode.png'
})

result = response.json()
print(result['data'])  # Decoded QR code content
```

### Node.js (axios)

```javascript
const axios = require('axios');

const response = await axios.post('http://localhost:3000/api/decode-qr', {
  imageUrl: 'https://example.com/qrcode.png'
});

console.log(response.data.data); // Decoded QR code content
```

## Configuration

### Environment Variables

- `PORT` - Server port (default: 3000)

Example:
```bash
PORT=8080 npm start
```

## Dependencies

- **express** - Web framework
- **jsqr** - QR code decoder
- **jimp** - Image processing library
- **axios** - HTTP client for fetching images

## Error Handling

The API includes comprehensive error handling for:

- Missing or invalid URL parameters
- Network errors when fetching images
- Invalid image formats
- Images without QR codes
- Timeout errors (10 second timeout for image fetching)

## Development

### Project Structure

```
.
├── qr-decoder-api.js       # Main API server
├── package.json            # Dependencies and scripts
├── README.md              # This file
├── CLAUDE.md              # AI assistant guide
└── node_modules/          # Installed dependencies
```

### Running in Development Mode

```bash
npm run dev
```

## Testing

You can test the API with these free QR code generators:
- https://www.qr-code-generator.com/
- https://www.the-qrcode-generator.com/

Generate a QR code, host it online (or use a public QR code image URL), and test with the API.

## Limitations

- Maximum image size depends on available memory
- 10 second timeout for fetching images from URLs
- Only supports standard QR codes (not other barcode formats)
- Image must be publicly accessible via HTTP/HTTPS

## License

ISC

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues or questions, please open an issue in the repository.
