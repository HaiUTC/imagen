import { imagenRepository } from '~/frame-works/database/repositories/imagen.repository';

const getImagen = async (id: string) => {
  try {
    const imagen = await imagenRepository.findOne({ _id: id });
    return imagen;
  } catch (error) {
    console.error('Error fetching imagen:', error);
    throw new Error('Failed to fetch imagen');
  }
};

export const ImagenService = {
  getImagen,
};
