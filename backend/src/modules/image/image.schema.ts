import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../user/user.schema';
import * as mongoose from 'mongoose';

export type ImageDocument = HydratedDocument<Image>;

@Schema({ _id: false }) // No need for _id in subdocument
class Meta {
  @Prop()
  removedBackgroundUrl: string;

  @Prop()
  upscaledUrl: string;
}

@Schema({ _id: true }) // Ensure _id is generated for each subdocument
class GeneratedImages {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    default: () => new Types.ObjectId(),
  })
  _id: Types.ObjectId;

  @Prop()
  blobUrl: string;

  @Prop()
  originalUrl: string;

  @Prop()
  width: number;

  @Prop()
  height: number;

  @Prop({
    type: Meta,
  })
  meta: Meta;
}

@Schema()
export class Image {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner: User;

  @Prop()
  prompt: string;

  @Prop()
  model: string;

  @Prop()
  requestId: string;

  @Prop()
  baseUrl: string;

  @Prop()
  imageSize: string;

  @Prop()
  seed: number;

  @Prop({
    type: String,
    enum: ['PROCESSING', 'PROCESSED', 'ERROR'],
    default: 'PROCESSING',
  })
  status: string;

  @Prop()
  cretedAt: number;

  @Prop({ type: [GeneratedImages] }) // Use the subdocument schema here
  generatedImages: GeneratedImages[];
}

export const ImageSchema = SchemaFactory.createForClass(Image);
