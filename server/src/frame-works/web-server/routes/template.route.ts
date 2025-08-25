import { Controller, Get, Route, Tags, Path, Response, Post, Body, Delete, Query } from 'tsoa';
import { TemplateService } from '~/controllers/template.controller';
import { PaginationEntity } from '~/domains/entities/pagination.entity';
import { TemplateValueFully } from '~/domains/entities/template.entity';

@Route('/templates')
@Tags('Templates')
export class TemplateController extends Controller {
  /**
   * Get all templates
   * @summary Retrieve all templates from the database
   */
  @Get('/')
  @Response(200, 'Successfully retrieved all templates')
  @Response(500, 'Internal server error')
  public async getAllTemplates(): Promise<any[]> {
    try {
      const templates = await TemplateService.getAllTemplates();
      return templates;
    } catch (error) {
      console.error('Get all templates error:', error);
      this.setStatus(500);
      throw new Error('Failed to retrieve templates');
    }
  }

  /**
   * Get list imagens paginated based on template id
   * @summary Retrieve list imagens paginated based on template id
   */
  @Get('/imagens')
  @Response(200, 'Successfully retrieved imagens')
  @Response(404, 'Template not found')
  @Response(500, 'Internal server error')
  public async getImagensPaginated(@Query() before?: string, @Query() template?: string): Promise<PaginationEntity<TemplateValueFully>> {
    try {
      const imagens = await TemplateService.getImagensPaginated(template, before);
      return imagens;
    } catch (error) {
      console.error('Get imagens error:', error);
      this.setStatus(500);
      throw new Error('Failed to retrieve imagens');
    }
  }

  /**
   * Get template by ID
   * @summary Retrieve a specific template by its ID
   * @param id The template ID
   */
  @Get('/{id}')
  @Response(200, 'Successfully retrieved template')
  @Response(404, 'Template not found')
  @Response(500, 'Internal server error')
  public async getTemplateById(@Path() id: string): Promise<any> {
    try {
      const template = await TemplateService.getTemplateById(id);
      console.log('template: ', template);
      console.log('id:', id);
      if (!template) {
        this.setStatus(404);
        throw new Error('Template not found');
      }
      return template;
    } catch (error) {
      console.error('Get template by ID error:', error);
      if (error instanceof Error && error.message === 'Template not found') {
        this.setStatus(404);
      } else {
        this.setStatus(500);
      }
      throw error;
    }
  }

  @Post('/imagen')
  @Response(200, 'Successfully add imagen to template')
  @Response(404, 'Template not found')
  @Response(500, 'Internal server error')
  public async addImagenToTemplate(@Body() body: { imagenId: string; id?: string; name?: string; description?: string }): Promise<any> {
    try {
      const template = await TemplateService.addImagenToTemplate(body);
      return template;
    } catch (error) {
      console.error('Add imagen to template error:', error);
      this.setStatus(500);
      throw new Error('Failed to add imagen to template');
    }
  }

  @Post('/{id}')
  @Response(200, 'Successfully update template')
  @Response(404, 'Template not found')
  @Response(500, 'Internal server error')
  public async updateTemplate(@Path() id: string, @Body() body: { name: string; description: string }): Promise<any> {
    try {
      const template = await TemplateService.updateTemplate(id, body.name, body.description);
      return template;
    } catch (error) {
      console.error('Update template error:', error);
      this.setStatus(500);
      throw new Error('Failed to update template');
    }
  }

  @Delete('/{id}')
  @Response(200, 'Successfully delete template')
  @Response(404, 'Template not found')
  @Response(500, 'Internal server error')
  public async deleteTemplate(@Path() id: string): Promise<any> {
    try {
      const template = await TemplateService.deleteTemplate(id);
      return template;
    } catch (error) {
      console.error('Delete template error:', error);
      this.setStatus(500);
      throw new Error('Failed to delete template');
    }
  }

  @Delete('/{id}/imagen')
  @Response(200, 'Successfully delete imagen from template')
  @Response(404, 'Template not found')
  @Response(500, 'Internal server error')
  public async deleteImagenFromTemplate(@Path() id: string, @Body() body: { imagenId: string }): Promise<any> {
    try {
      const template = await TemplateService.deleteImagenFromTemplate(id, body.imagenId);
      return template;
    } catch (error) {
      console.error('Delete imagen from template error:', error);
      this.setStatus(500);
      throw new Error('Failed to delete imagen from template');
    }
  }
}
