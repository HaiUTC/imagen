import { Types } from 'mongoose';
import TemplateModel from '../models/template.model';
import { TemplateDataValue, TemplateValueFully } from '~/domains/entities/template.entity';
import { PaginationEntity } from '~/domains/entities/pagination.entity';

// Helper functions for pagination
const buildMatchConditions = async (templateId?: string, beforeId?: string, addConditions?: any) => {
  const conditions: any = {
    ...(addConditions || {}),
  };

  if (templateId) {
    const template = (await TemplateModel.findById(templateId)) as TemplateDataValue;
    if (!template) {
      return null;
    }
    conditions._id = { $in: template.imagens };
  }

  let beforeImagen: any = null;
  if (beforeId) {
    beforeImagen = await TemplateModel.db.collection('imagens').findOne({ _id: new Types.ObjectId(beforeId) });
    if (beforeImagen) {
      conditions.updatedAt = { $lt: beforeImagen.updatedAt };
    }
  }

  return { conditions, beforeImagen };
};

const fetchImagenesWithPagination = async (conditions: any, limit: number): Promise<TemplateValueFully[]> => {
  return (await TemplateModel.db
    .collection('imagens')
    .find(conditions)
    .project({
      _id: 1,
      format: 1,
      imagen: { $arrayElemAt: ['$imagens', -1] },
      status: 1,
      updatedAt: 1,
    })
    .sort({ updatedAt: -1 })
    .limit(limit + 1)
    .toArray()) as unknown as TemplateValueFully[];
};

const processImagenResults = (imagenes: TemplateValueFully[], limit: number) => {
  const hasNext = imagenes.length > limit;
  const data = hasNext ? imagenes.slice(0, limit) : imagenes;
  return { data, hasNext };
};

const checkHasPrevious = async (
  templateId?: string,
  beforeId?: string,
  beforeImagen?: any,
  conditions?: any,
  resultImagenes?: TemplateValueFully[],
): Promise<boolean> => {
  if (beforeId && beforeImagen) {
    const previousCount = await TemplateModel.db.collection('imagens').countDocuments({
      ...conditions,
      updatedAt: { $gt: beforeImagen.updatedAt },
    });
    return previousCount > 0;
  }

  if (templateId && resultImagenes && resultImagenes.length > 0) {
    const firstImagenUpdatedAt = resultImagenes[0].updatedAt;
    const newerCount = await TemplateModel.db.collection('imagens').countDocuments({
      ...conditions,
      updatedAt: { $gt: firstImagenUpdatedAt },
    });
    return newerCount > 0;
  }

  return false;
};

const createTemplateRepository = () => ({
  create: async (data: TemplateDataValue) => {
    const template = await TemplateModel.create(data);
    return template;
  },
  findAll: async () => {
    const templates = await TemplateModel.aggregate([
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
        },
      },
    ]);

    return templates;
  },
  findById: async (id: string) => {
    const template = await TemplateModel.findById(new Types.ObjectId(id)).populate('imagen');
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
    const LIMIT = 20;
    const EMPTY_RESULT = { data: [], count: 0, beforeId: null, hasNext: false, hasPrevious: false };

    const matchConditions = await buildMatchConditions(templateId, beforeId, { imagens: { $exists: true, $gt: [] } });
    if (!matchConditions) {
      return EMPTY_RESULT;
    }

    const { conditions, beforeImagen } = matchConditions;

    const imagenes = await fetchImagenesWithPagination(conditions, LIMIT);
    const { data: resultImagenes, hasNext } = processImagenResults(imagenes, LIMIT);

    if (resultImagenes.length === 0) {
      return EMPTY_RESULT;
    }

    const hasPrevious = await checkHasPrevious(templateId, beforeId, beforeImagen, conditions, resultImagenes);

    return {
      data: resultImagenes,
      beforeId: resultImagenes[resultImagenes.length - 1]._id?.toString() || null,
      count: resultImagenes.length,
      hasNext,
      hasPrevious,
    };
  },
});

export const templateRepository = createTemplateRepository();
