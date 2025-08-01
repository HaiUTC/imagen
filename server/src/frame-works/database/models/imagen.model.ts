import { model, Schema, SchemaDefinition } from 'mongoose';

export interface ImagenDataValue {
  format: string;
  data: {
    model?: string;
    prompt?: string;
    aspectRatio?: string;
    style?: string;
    reference?: string[];
    n?: number;
    image?: string;
    magic_prompt?: string;
  };
  taskId?: string;
  imagens: string[];
}

export interface ImagenDbModel extends SchemaDefinition<ImagenDataValue> {}

const ImagenSchema = new Schema<ImagenDbModel>(
  {
    format: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true },
    taskId: { type: String, required: false },
    imagens: { type: [String], required: true },
  },
  { timestamps: true },
);

export default model<ImagenDbModel>('imagen', ImagenSchema);
