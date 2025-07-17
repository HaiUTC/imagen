import { model, Schema, SchemaDefinition } from 'mongoose';

export interface ImagenDataValue {
  model: string;
  prompt: string;
  aspectRatio: string;
  style: string;
  reference?: string;
  imagens: string[];
}

export interface ImagenDbModel extends SchemaDefinition<ImagenDataValue> {}

const ImagenSchema = new Schema<ImagenDbModel>(
  {
    model: {
      type: String,
    },
    prompt: {
      type: String,
      required: true,
    },
    aspectRatio: {
      type: String,
      required: true,
    },
    style: {
      type: String,
    },
    reference: {
      type: String,
    },
    imagens: {
      type: [String],
    },
  },
  { timestamps: true },
);

export default model<ImagenDbModel>('imagen', ImagenSchema);
