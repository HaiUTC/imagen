import { Controller, Post, Request, Route, Tags, FormField, UploadedFiles } from 'tsoa';
import { Request as RequestExpress } from 'express';
import { GenerateImagePort } from '~/domains/ports/imagen.port';
import { GenerateImageService } from '~/controllers/generate-image.controller';
import { CustomInstructions } from '~/domains/entities/imagen.entity';
import { convertToSupportedFormat, isValidImageFormat } from '~/applications/utils/image-converter.util';

@Route('/generative')
@Tags('Generative')
export class GenerativeController extends Controller {
  /**
   * Generate content for a section (FormData with file upload)
   */
  @Post('/image')
  public async generativeImageWithUpload(
    @FormField() prompt: string,
    @FormField() n: string,
    @FormField() aspect_ratio: string,
    @FormField() style: string,
    @UploadedFiles() images?: Express.Multer.File[],
    @UploadedFiles() perspectives?: Express.Multer.File[],
  ): Promise<{ images: string[]; taskId?: string; id: string }> {
    try {
      // Parse the custom_instructions JSON string
      let parsedCustomInstructions: CustomInstructions = {
        prompt,
        n: parseInt(n),
        aspect_ratio,
        style,
        images: [],
        perspectives: [],
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

      if (perspectives && perspectives.length) {
        for (let i = 0; i < perspectives.length; i++) {
          const perspective = perspectives[i];
          const perspectiveBlob = new Blob([perspective.buffer], { type: perspective.mimetype });
          const perspectiveFile = new File([perspectiveBlob], perspective.originalname, { type: perspective.mimetype });
          parsedCustomInstructions.perspectives?.push(perspectiveFile);
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
      return { images: [], taskId: '', id: '' };
    }
  }

  @Post('/image/download')
  public async downloadImageGenerated(@Request() req: RequestExpress): Promise<{ images: string[] }> {
    return await GenerateImageService.downloadImageGenerated({
      option: req.body.option,
      id: req.body.id,
    });
  }

  @Post('/edit')
  public async editImage(
    @FormField() prompt: string,
    @UploadedFiles() images: Express.Multer.File[],
  ): Promise<{ images: string[]; taskId?: string; id: string }> {
    try {
      const imagesToEdit: File[] = [];
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
          imagesToEdit.push(file);
        }
      }

      const result = await GenerateImageService.editImage(prompt, imagesToEdit);
      return result;
    } catch (error) {
      console.log('Edit image error ====> ', error);
      return { images: [], taskId: undefined, id: '' };
    }
  }
}
