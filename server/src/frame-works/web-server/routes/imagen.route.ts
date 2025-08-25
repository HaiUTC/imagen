import { Controller, Get, Path, Route, Tags } from 'tsoa';
import { ImagenService } from '~/controllers/imagen.controller';

@Route('/imagens')
@Tags('Imagens')
export class ImagenController extends Controller {
  /**
   * Get imagen by id
   */
  @Get('/{id}')
  public async getImagenById(@Path() id: string): Promise<any> {
    try {
      const imagen = await ImagenService.getImagen(id);
      if (!imagen) {
        throw new Error('Imagen not found');
      }
      return imagen;
    } catch (error) {
      console.error('Get imagen by id error:', error);
      this.setStatus(500);
      throw new Error('Failed to retrieve imagen');
    }
  }
}
