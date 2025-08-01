import { Controller, Post, Request, Route, Tags, FormField, UploadedFiles } from 'tsoa';
import { Request as RequestExpress } from 'express';
import { GenerateImagePort } from '~/domains/ports/imagen.port';
import { GenerateImageService } from '~/controllers/generate-image.controller';
import { CustomInstructions } from '~/domains/entities/generate-image.entity';
import { convertToSupportedFormat, isValidImageFormat } from '~/applications/utils/image-converter.util';

@Route('/generative')
@Tags('Generative')
export class GenerativeController extends Controller {
  /**
   * Generate content for a section (FormData with file upload)
   */
  @Post('/image')
  public async generativeImageWithUpload(
    @Request() req: RequestExpress,
    @FormField() prompt: string,
    @FormField() n: string,
    @FormField() aspect_ratio: string,
    @FormField() style: string,
    @UploadedFiles() images?: Express.Multer.File[],
  ): Promise<{ images: string[] }> {
    try {
      // Parse the custom_instructions JSON string
      let parsedCustomInstructions: CustomInstructions = {
        prompt,
        n: parseInt(n),
        aspect_ratio,
        style,
        images: [],
      };

      // If a reference image was uploaded, convert it to the expected format
      if (images && images.length) {
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          // Validate that it's a valid image format
          if (!isValidImageFormat(image)) {
            throw new Error(`Unsupported reference image format: ${image.mimetype}. Please upload a valid image file.`);
          }

          // Convert to supported format if needed
          const processedReferenceImage = await convertToSupportedFormat(image);

          // Convert processed image to File-like object
          const fileBlob = new Blob([processedReferenceImage.buffer], { type: processedReferenceImage.mimetype });
          const file = new File([fileBlob], processedReferenceImage.originalname, { type: processedReferenceImage.mimetype });
          parsedCustomInstructions.images?.push(file);
        }
      }

      // Create the proper GenerateImagePort structure
      const data: GenerateImagePort = {
        user_prompt: prompt,
        custom_instructions: parsedCustomInstructions,
      };

      const result = await GenerateImageService.generateImage(data);
      return result;
    } catch (error) {
      console.log('Generate image with upload error ====> ', error);
      return { images: [] };
    }
  }

  @Post('/image/download')
  public async downloadImageGenerated(@Request() req: RequestExpress): Promise<{ images: string[] }> {
    return await GenerateImageService.downloadImageGenerated({
      option: req.body.option,
      id: req.body.id,
    });
  }

  @Post('/image/advanced')
  public async generativeImageWithImagen(
    @Request() req: RequestExpress,
    @FormField() prompt: string,
    @FormField() n: string,
    @FormField() aspect_ratio: string,
    @FormField() style: string,
    @UploadedFiles() images?: Express.Multer.File[],
  ): Promise<{ images: string[] }> {
    try {
      // Parse the custom_instructions JSON string
      let parsedCustomInstructions: CustomInstructions = {
        prompt,
        n: parseInt(n),
        aspect_ratio,
        style,
        images: [],
      };

      // If a reference image was uploaded, convert it to the expected format
      if (images && images.length) {
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          // Validate that it's a valid image format
          if (!isValidImageFormat(image)) {
            throw new Error(`Unsupported reference image format: ${image.mimetype}. Please upload a valid image file.`);
          }

          // Convert to supported format if needed
          const processedReferenceImage = await convertToSupportedFormat(image);

          // Convert processed image to File-like object
          const fileBlob = new Blob([processedReferenceImage.buffer], { type: processedReferenceImage.mimetype });
          const file = new File([fileBlob], processedReferenceImage.originalname, { type: processedReferenceImage.mimetype });
          parsedCustomInstructions.images?.push(file);
        }
      }

      // Create the proper GenerateImagePort structure
      const data: GenerateImagePort = {
        user_prompt: prompt,
        custom_instructions: parsedCustomInstructions,
      };

      const result = await GenerateImageService.generateImageWithImagen(data);
      return result;
    } catch (error) {
      console.log('Generate image with imagen error ====> ', error);
      return { images: [] };
    }
  }
}
