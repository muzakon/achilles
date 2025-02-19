import { Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User } from '../user/user.schema';
import * as mongoose from 'mongoose';
import { FalModelOutputMap } from './image.interface';
import Configuration from '../../config/configuration';
import { GoogleCloudStorageService } from 'src/lib/cloud_storage';
import dotenv from 'dotenv';

console.log(dotenv);
export type ImageGenerationTaskDocument = HydratedDocument<ImageGenerationTask>;

@Schema({ _id: false }) // No need for _id in subdocument
class Meta {
  @Prop({ type: String, default: null })
  removedBackgroundUrl: string | null;

  @Prop({ type: String, default: null })
  upscaledUrl: string | null;
}

@Schema({ _id: true }) // Ensure _id is generated for each subdocument
export class GeneratedImages {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  })
  _id: mongoose.Types.ObjectId;

  @Prop({ type: String, default: null })
  blobUrl: string | null;

  @Prop({ type: String, default: null })
  originalUrl: string | null;

  @Prop({ type: Number, default: null })
  width: number | null;

  @Prop({ type: Number, default: null })
  height: number | null;

  @Prop({
    type: Meta,
  })
  meta: Meta;

  @Virtual({
    get: function (this: GeneratedImages) {
      const configuration = Configuration();

      const storageService = new GoogleCloudStorageService(
        configuration.GCS_BUCKET_NAME as string,
        configuration.SERVICE_ACCOUNT,
        false,
      );
      console.log(configuration);
      return this.blobUrl ? storageService.createSignedUrl(this.blobUrl) : null;
    },
  })
  signedUrl: string | null;
}

export const GeneratedImageSchema =
  SchemaFactory.createForClass(GeneratedImages);

@Schema({ collection: 'image_generation_tasks' })
export class ImageGenerationTask {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner: User;

  @Prop()
  prompt: string;

  @Prop({ type: String, default: null })
  model: keyof FalModelOutputMap;

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
  status: 'PROCESSING' | 'PROCESSED' | 'ERROR';

  @Prop()
  cretedAt: number;

  @Prop({ type: [GeneratedImageSchema] }) // Use the subdocument schema here
  generatedImages: GeneratedImages[];
}

export const ImageGenerationTaskSchema =
  SchemaFactory.createForClass(ImageGenerationTask);
