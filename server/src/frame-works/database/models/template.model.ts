import { model, Schema, SchemaDefinition, Types } from 'mongoose';

export interface TemplateDataValue {
  name: string;
  description: string;
  imagen: Types.ObjectId[];
}

export interface TemplateDbModel extends SchemaDefinition<TemplateDataValue> {}

const TemplateSchema = new Schema<TemplateDbModel>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    imagen: { type: [Schema.Types.ObjectId], ref: 'imagen', required: true },
  },
  { timestamps: true },
);

export default model<TemplateDbModel>('template', TemplateSchema);
