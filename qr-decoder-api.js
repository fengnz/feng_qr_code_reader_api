const express = require('express');
const axios = require('axios');
const { Jimp } = require('jimp');
const jsQR = require('jsqr');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

/**
 * Decode QR code from image URL
 * @param {string} imageUrl - HTTP URL of the image containing QR code
 * @returns {Promise<string>} Decoded QR code content
 */
async function decodeQRCodeFromUrl(imageUrl) {
  try {
    // Fetch the image from the URL
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 10000, // 10 second timeout
      headers: {
        'User-Agent': 'QR-Code-Decoder/1.0'
      }
    });

    // Load image with Jimp
    const image = await Jimp.read(Buffer.from(response.data));

    // Get image data in the format jsQR expects
    const imageData = {
      data: new Uint8ClampedArray(image.bitmap.data),
      width: image.bitmap.width,
      height: image.bitmap.height
    };

    // Decode QR code
    const decodedQR = jsQR(imageData.data, imageData.width, imageData.height);

    if (!decodedQR) {
      throw new Error('No QR code found in the image');
    }

    return decodedQR.data;
  } catch (error) {
    if (error.message === 'No QR code found in the image') {
      throw error;
    }
    throw new Error(`Failed to decode QR code: ${error.message}`);
  }
}

/**
 * POST /api/decode-qr
 * Request body: { "imageUrl": "http://example.com/qrcode.png" }
 * Response: { "success": true, "data": "decoded content" }
 */
app.post('/api/decode-qr', async (req, res) => {
  try {
    const { imageUrl } = req.body;

    // Validate input
    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'imageUrl is required in request body'
      });
    }

    // Validate URL format
    try {
      new URL(imageUrl);
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid URL format'
      });
    }

    // Ensure it's an HTTP or HTTPS URL
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      return res.status(400).json({
        success: false,
        error: 'URL must use HTTP or HTTPS protocol'
      });
    }

    // Decode the QR code
    const decodedContent = await decodeQRCodeFromUrl(imageUrl);

    res.json({
      success: true,
      data: decodedContent,
      imageUrl: imageUrl
    });

  } catch (error) {
    console.error('Error decoding QR code:', error);

    // Handle specific error cases
    if (error.message.includes('No QR code found')) {
      return res.status(404).json({
        success: false,
        error: 'No QR code found in the provided image'
      });
    }

    if (error.code === 'ENOTFOUND' || error.message.includes('timeout')) {
      return res.status(400).json({
        success: false,
        error: 'Failed to fetch image from the provided URL'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Internal server error while processing QR code'
    });
  }
});

/**
 * GET /health
 * Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /
 * Root endpoint with API information
 */
app.get('/', (req, res) => {
  res.json({
    name: 'QR Code Decoder API',
    version: '1.0.0',
    endpoints: {
      'POST /api/decode-qr': 'Decode QR code from image URL',
      'GET /health': 'Health check',
      'GET /': 'API information'
    },
    usage: {
      endpoint: '/api/decode-qr',
      method: 'POST',
      body: {
        imageUrl: 'http://example.com/qrcode.png'
      }
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`QR Code Decoder API is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`API endpoint: http://localhost:${PORT}/api/decode-qr`);
});

module.exports = app;
