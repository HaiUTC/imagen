import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { decode } from 'base64-arraybuffer';
const createS3Service = () => {
  const s3Client = new S3Client({
    endpoint: `https://${process.env.S3_ENDPOINT}`,
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.S3_KEYID!,
      secretAccessKey: process.env.S3_ACCESS!,
    },
    forcePathStyle: true,
  });

  const uploadImage = async (image: string, type: 'base64' | 'url', uniqueId: string): Promise<string> => {
    let buffer: Buffer;
    let contentType = 'image/jpeg';

    if (type === 'base64') {
      buffer = Buffer.from(decode(image));
    } else {
      const response = await fetch(image);
      const arrayBuffer = await response.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      
      const contentTypeHeader = response.headers.get('content-type');
      if (contentTypeHeader) {
        contentType = contentTypeHeader;
      }
    }

    const key = `${uniqueId}.jpg`;
    
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    return `https://${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${key}`;
  };

  return { uploadImage };
};

export const s3Service = createS3Service();