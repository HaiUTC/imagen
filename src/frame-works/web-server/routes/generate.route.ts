import { Body, Controller, Post, Request, Route, Tags, FormField, UploadedFile } from 'tsoa';
import { Request as RequestExpress } from 'express';
import { GenerateImagePort } from '~/domains/ports/generate-image.port';
import { GenerateImageService } from '~/controllers/generate-image.controller';
import { CustomInstructions } from '~/domains/entities/generate-image.entity';

@Route('/generative')
@Tags('Generative')
export class GenerativeController extends Controller {
  /**
   * Generate content for a section (FormData with file upload)
   */
  @Post('/image')
  public async generativeImageWithUpload(
    @Request() req: RequestExpress,
    @FormField() user_prompt: string,
    @FormField() custom_instructions: string,
    @UploadedFile() reference_image?: Express.Multer.File,
  ): Promise<string[]> {
    try {
      // Parse the custom_instructions JSON string
      let parsedCustomInstructions: CustomInstructions;
      try {
        parsedCustomInstructions = JSON.parse(custom_instructions);
      } catch (parseError) {
        console.log('Failed to parse custom_instructions:', parseError);
        throw new Error('Invalid custom_instructions JSON format');
      }

      // If a reference image was uploaded, convert it to the expected format
      if (reference_image) {
        // Convert Express.Multer.File to File-like object
        const fileBlob = new Blob([reference_image.buffer], { type: reference_image.mimetype });
        const file = new File([fileBlob], reference_image.originalname, { type: reference_image.mimetype });
        parsedCustomInstructions.reference_image = file;
      } else {
        parsedCustomInstructions.reference_image = null;
      }

      // Create the proper GenerateImagePort structure
      const data: GenerateImagePort = {
        user_prompt,
        custom_instructions: parsedCustomInstructions,
      };

      const result = await GenerateImageService.generateImage(data);
      return result;
    } catch (error) {
      console.log('Generate image with upload error ====> ', error);
      return [];
    }
  }
}
