import sharp from 'sharp';
import { s3Service } from '~/infrastructures/services/s3.service';
import { uid } from '../utils/uid';

async function splitImageIntoFour(imageUrl: string): Promise<string[]> {
  // Download image from URL
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const imageBuffer = Buffer.from(await response.arrayBuffer());

  // Get image metadata
  const input = sharp(imageBuffer);
  const meta = await input.metadata();

  if (!meta.width || !meta.height) {
    throw new Error('Could not read image dimensions.');
  }

  const width = meta.width;
  const height = meta.height;

  // Half sizes; make right/bottom tiles consume the remainder to handle odd dims.
  const halfW = Math.floor(width / 2);
  const halfH = Math.floor(height / 2);

  // Regions: [left, top, tileWidth, tileHeight]
  const regions = [
    { left: 0, top: 0, width: halfW, height: halfH }, // part1 (TL)
    { left: halfW, top: 0, width: width - halfW, height: halfH }, // part2 (TR)
    { left: 0, top: halfH, width: halfW, height: height - halfH }, // part3 (BL)
    { left: halfW, top: halfH, width: width - halfW, height: height - halfH }, // part4 (BR)
  ];

  // Extract each region and upload to S3
  const uploadPromises = regions.map(async (region, idx) => {
    const extractedBuffer = await sharp(imageBuffer).extract(region).jpeg().toBuffer();

    // Convert buffer to base64 for S3 upload
    const base64Image = extractedBuffer.toString('base64');
    const uniqueId = uid('generate_');

    // Upload to S3
    const uploadedUrl = await s3Service.uploadImage(base64Image, 'base64', uniqueId);
    return uploadedUrl;
  });

  return await Promise.all(uploadPromises);
}

export const splitImageFlow = async (imageUrl: string): Promise<string[]> => {
  try {
    const splitImages = await splitImageIntoFour(imageUrl);
    return splitImages;
  } catch (error) {
    console.error('Failed to split image:', error);
    throw error;
  }
};
