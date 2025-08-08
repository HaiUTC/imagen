import { model, Schema, SchemaDefinition, Types } from 'mongoose';
import { TemplateValueFully } from '~/domains/entities/template.entity';

export interface TemplateDbModel extends SchemaDefinition<TemplateValueFully> {}

const TemplateSchema = new Schema<TemplateDbModel>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    imagens: { type: [Schema.Types.ObjectId], ref: 'imagen', required: true },
  },
  { timestamps: true },
);

export default model<TemplateDbModel>('template', TemplateSchema);
