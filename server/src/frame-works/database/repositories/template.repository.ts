import { Types } from 'mongoose';
import TemplateModel from '../models/template.model';
import { TemplateDataValue, TemplateValueFully } from '~/domains/entities/template.entity';
import { ImagenValue } from '~/domains/entities/imagen.entity';
import { PaginationEntity } from '~/domains/entities/pagination.entity';

const createTemplateRepository = () => ({
  create: async (data: TemplateDataValue) => {
    const template = await TemplateModel.create(data);
    return template;
  },
  findAll: async () => {
    const templates = await TemplateModel.aggregate([
      {
        $lookup: {
          from: 'imagens',
          let: { imagenIds: '$imagen' },
          pipeline: [{ $match: { $expr: { $in: ['$_id', '$$imagenIds'] } } }, { $project: { _id: 1, imagens: 1 } }, { $limit: 1 }],
          as: 'imagen',
        },
      },
      {
        $addFields: {
          imagen: { $arrayElemAt: ['$imagen', 0] },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          imagen: 1,
        },
      },
    ]);

    return templates;
  },
  findById: async (id: string) => {
    const template = await TemplateModel.findById(id).populate('imagen');
    return template;
  },
  findByIdNoPopulate: async (id: string) => {
    const template = (await TemplateModel.findById(id)) as TemplateDataValue;
    return template;
  },
  update: async (id: string, data: Partial<TemplateDataValue>) => {
    const template = await TemplateModel.findByIdAndUpdate(id, data, { new: true }).populate('imagen');
    return template;
  },
  addImagenToTemplate: async (id: string, imagenId: string) => {
    const template = await TemplateModel.findByIdAndUpdate(id, { $push: { imagen: new Types.ObjectId(imagenId) } }, { new: true }).populate(
      'imagen',
    );
    return template;
  },
  removeImagenFromTemplate: async (id: string, imagenId: string) => {
    const template = await TemplateModel.findByIdAndUpdate(id, { $pull: { imagen: new Types.ObjectId(imagenId) } }, { new: true }).populate(
      'imagen',
    );
    return template;
  },
  delete: async (id: string) => {
    const template = await TemplateModel.findByIdAndDelete(id);
    return template;
  },
  getImagensPaginated: async (templateId?: string, beforeId?: string): Promise<PaginationEntity<TemplateValueFully>> => {
    const limit = 30;

    // Build match conditions
    const matchConditions: any = {};

    if (templateId) {
      const template = (await TemplateModel.findById(templateId)) as TemplateDataValue;
      if (!template) {
        return { data: [], beforeId: null, hasNext: false, hasPrevious: false };
      }
      matchConditions._id = { $in: template.imagens };
    }

    if (beforeId) {
      const beforeImagen = await TemplateModel.db.collection('imagens').findOne({ _id: new Types.ObjectId(beforeId) });
      if (beforeImagen) {
        matchConditions.updatedAt = { $lt: beforeImagen.updatedAt };
      }
    }

    // Get imagenes with pagination
    const imagenes = (await TemplateModel.db
      .collection('imagens')
      .find(matchConditions)
      .sort({ updatedAt: -1 })
      .limit(limit + 1) // Get one extra to check if there are more
      .toArray()) as unknown as TemplateValueFully[];

    const hasNext = imagenes.length > limit;
    const resultImagenes = hasNext ? imagenes.slice(0, limit) : imagenes;

    // Check if there are previous pages
    let hasPrevious = false;
    if (beforeId) {
      const beforeImagen = await TemplateModel.db.collection('imagens').findOne({ _id: new Types.ObjectId(beforeId) });
      if (beforeImagen) {
        const previousCount = await TemplateModel.db.collection('imagens').countDocuments({
          ...matchConditions,
          updatedAt: { $gt: beforeImagen.updatedAt },
        });
        hasPrevious = previousCount > 0;
      }
    } else if (templateId) {
      // If no beforeId but templateId exists, check if there are newer imagenes
      const template = (await TemplateModel.findById(templateId)) as TemplateDataValue;
      if (template && template.imagens && template.imagens.length > 0) {
        const newestImagen = await TemplateModel.db
          .collection('imagens')
          .find({ _id: { $in: template.imagens } })
          .sort({ updatedAt: -1 })
          .limit(1)
          .toArray();

        if (newestImagen.length > 0 && resultImagenes.length > 0) {
          hasPrevious = newestImagen[0].updatedAt > resultImagenes[0].updatedAt;
        }
      }
    }

    return {
      data: resultImagenes,
      beforeId: resultImagenes.length > 0 ? resultImagenes[resultImagenes.length - 1]._id.toString() : null,
      hasNext,
      hasPrevious,
    };
  },
});

export const templateRepository = createTemplateRepository();
