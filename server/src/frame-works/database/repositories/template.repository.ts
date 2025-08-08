import { Types } from 'mongoose';
import { TemplateDataValue } from '../models/template.model';
import TemplateModel from '../models/template.model';

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
});

export const templateRepository = createTemplateRepository();
