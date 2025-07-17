import { ImagenDataValue } from '../models/imagen.model';
import ImagenModel from '../models/imagen.model';

const createImagenRepository = () => ({
  create: async (data: ImagenDataValue) => {
    const imagen = await ImagenModel.create(data);
    return imagen;
  },
});

export const imagenRepository = createImagenRepository();
