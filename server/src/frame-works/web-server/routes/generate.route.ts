import { Controller, Post, Request, Route, Tags, FormField, UploadedFiles } from 'tsoa';
import { Request as RequestExpress, Response as ResponseExpress } from 'express';
import { GenerateImagePort } from '~/domains/ports/imagen.port';
import { GenerateImageService } from '~/controllers/generate-image.controller';
import { CustomInstructions } from '~/domains/entities/imagen.entity';
import { convertToSupportedFormat, isValidImageFormat } from '~/applications/utils/image-converter.util';
import { StreamingEvent } from '~/applications/events/streaming-event.class';

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

  /**
   * Generate content streaming for real-time updates (FormData with file upload)
   */
  @Post('/image/streaming')
  public async generativeImageStreaming(
    @Request() req: RequestExpress & { res: ResponseExpress },
    @FormField() prompt: string,
    @FormField() n: string,
    @FormField() aspect_ratio: string,
    @FormField() style: string,
    @UploadedFiles() images?: Express.Multer.File[],
    @UploadedFiles() perspectives?: Express.Multer.File[],
  ): Promise<any> {
    try {
      const res = req.res;

      // Set headers for Server-Sent Events
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      });

      // Parse the custom_instructions
      let parsedCustomInstructions: CustomInstructions = {
        prompt,
        n: parseInt(n),
        aspect_ratio,
        style,
        images: [],
        perspectives: [],
      };

      // Process uploaded images
      if (images && images.length) {
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          if (!isValidImageFormat(image)) {
            throw new Error(`Unsupported reference image format: ${image.mimetype}. Please upload a valid image file.`);
          }
          const processedReferenceImage = await convertToSupportedFormat(image);
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

      const data: GenerateImagePort = {
        user_prompt: prompt,
        custom_instructions: parsedCustomInstructions,
      };

      // Stream the generation process
      const result = await GenerateImageService.generateImageStreaming(data, (event: StreamingEvent) => {
        res.write(`event: ${event.type}\n`);
        res.write(`data: ${JSON.stringify(event.toJSON())}\n\n`);

        if (res.flushHeaders) {
          res.flushHeaders();
        }
      });

      res.end();

      return result;
    } catch (error) {
      console.log('Generate image streaming error ====> ', error);
      const res = req.res;
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        });
      } else {
        res.write(`event: error\n`);
        res.write(
          `data: ${JSON.stringify({
            type: 'error',
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            timestamp: new Date().toISOString(),
          })}\n\n`,
        );
        res.end();
      }
      return { images: [], taskId: '', id: '' };
    }
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

  /**
   * Upscale image with streaming updates
   */
  @Post('/upscale')
  public async upscaleImageStreaming(@Request() req: RequestExpress & { res: ResponseExpress }): Promise<any> {
    try {
      const res = req.res;

      // Set headers for Server-Sent Events
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control',
      });

      // Stream the upscale process
      const result = await GenerateImageService.upscaleImageStreaming(req.body.id, (event: StreamingEvent) => {
        res.write(`event: ${event.type}\n`);
        res.write(`data: ${JSON.stringify(event.toJSON())}\n\n`);

        if (res.flushHeaders) {
          res.flushHeaders();
        }
      });

      res.end();

      return result;
    } catch (error) {
      console.log('Upscale image streaming error ====> ', error);
      const res = req.res;
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        });
      } else {
        res.write(`event: error\n`);
        res.write(
          `data: ${JSON.stringify({
            type: 'error',
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            timestamp: new Date().toISOString(),
          })}\n\n`,
        );
        res.end();
      }
      return { images: [], id: '' };
    }
  }
}
