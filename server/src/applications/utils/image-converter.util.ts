import sharp from 'sharp';

/**
 * Supported image formats that don't need conversion
 */
const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

/**
 * Interface for the converted image result
 */
export interface ConvertedImage {
  buffer: Buffer;
  mimetype: string;
  originalname: string;
  size: number;
}

/**
 * Converts an image to WebP format if it's not already in a supported format
 * @param file - The uploaded file from multer
 * @returns Promise<ConvertedImage> - The converted image or original if already supported
 */
export const convertToSupportedFormat = async (file: Express.Multer.File): Promise<ConvertedImage> => {
  // Check if the image is already in a supported format
  if (SUPPORTED_FORMATS.includes(file.mimetype.toLowerCase())) {
    return {
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname,
      size: file.size,
    };
  }

  try {
    // Convert the image to WebP format using sharp
    const convertedBuffer = await sharp(file.buffer)
      .webp({
        quality: 90, // High quality WebP
        effort: 4, // Good compression effort
      })
      .toBuffer();

    // Generate new filename with .webp extension
    const originalNameWithoutExt = file.originalname.replace(/\.[^/.]+$/, '');
    const newFilename = `${originalNameWithoutExt}.webp`;

    return {
      buffer: convertedBuffer,
      mimetype: 'image/webp',
      originalname: newFilename,
      size: convertedBuffer.length,
    };
  } catch (error) {
    throw new Error(`Failed to convert image format: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Validates if the file is a valid image format
 * @param file - The uploaded file from multer
 * @returns boolean - True if valid image format
 */
export const isValidImageFormat = (file: Express.Multer.File): boolean => {
  const validImageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/tiff',
    'image/svg+xml',
    'image/avif',
    'image/heic',
    'image/heif',
  ];

  return validImageTypes.includes(file.mimetype.toLowerCase());
};

/**
 * Gets information about the image format
 * @param file - The uploaded file from multer
 * @returns object with format information
 */
export const getImageFormatInfo = (file: Express.Multer.File) => {
  return {
    mimetype: file.mimetype,
    isSupported: SUPPORTED_FORMATS.includes(file.mimetype.toLowerCase()),
    needsConversion: !SUPPORTED_FORMATS.includes(file.mimetype.toLowerCase()),
    originalSize: file.size,
    originalName: file.originalname,
  };
};

export const imageURLToBase64 = async (imageURL: string) => {
  const response = await fetch(imageURL);
  const blob = await response.blob();
  return `data:${blob.type};base64,${Buffer.from(await blob.arrayBuffer()).toString('base64')}`;
};
