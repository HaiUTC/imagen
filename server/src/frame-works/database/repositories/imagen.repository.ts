import { ImagenDataValue } from '../models/imagen.model';
import ImagenModel from '../models/imagen.model';

const createImagenRepository = () => ({
  create: async (data: ImagenDataValue) => {
    const imagen = await ImagenModel.create(data);
    return imagen;
  },
  update: async (id: string, images: string[]) => {
    const imagen = await ImagenModel.findOneAndUpdate({ taskId: id }, { $push: { imagens: { $each: images } } }, { new: true });
    return imagen;
  },
});

export const imagenRepository = createImagenRepository();
