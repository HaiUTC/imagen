import { ImagenValue } from '~/domains/entities/imagen.entity';
import ImagenModel from '../models/imagen.model';

const createImagenRepository = () => ({
  create: async (data: ImagenValue) => {
    const imagen = await ImagenModel.create(data);
    return imagen;
  },
  findOne: async (condition: any, selector?: Record<string, number>) => {
    const imagen = (await ImagenModel.findOne(condition, selector).lean()) as ImagenValue;
    return imagen;
  },
  update: async (id: string, images: string[]) => {
    const imagen = await ImagenModel.findOneAndUpdate({ taskId: id }, { $push: { imagens: { $each: images } } }, { new: true });
    return imagen;
  },
  updateOne: async (id: string, data: any) => {
    const imagen = await ImagenModel.findOneAndUpdate({ _id: id }, data, { new: true });
    return imagen;
  },
});

export const imagenRepository = createImagenRepository();
