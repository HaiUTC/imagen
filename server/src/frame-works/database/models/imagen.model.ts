import { model, Schema, SchemaDefinition } from 'mongoose';
import { ImagenValue } from '~/domains/entities/imagen.entity';

export interface ImagenDbModel extends SchemaDefinition<ImagenValue> {}

const ImagenSchema = new Schema<ImagenDbModel>(
  {
    format: { type: String, required: true },
    data: { type: Schema.Types.Mixed, required: true },
    taskId: { type: String, required: false },
    status: { type: String, required: true },
    imagens: { type: [String], required: true },
  },
  { timestamps: true },
);

export default model<ImagenDbModel>('imagen', ImagenSchema);
