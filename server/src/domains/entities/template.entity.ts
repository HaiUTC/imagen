import { Types } from 'mongoose';
import { ImagenValue } from './imagen.entity';

export interface TemplateDataValue {
  name: string;
  description: string;
  imagens: Types.ObjectId[];
}

export interface TemplateValueFully extends Pick<TemplateDataValue, 'name' | 'description'> {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  imagens: ImagenValue[];
}
