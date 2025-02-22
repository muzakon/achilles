import { Storage, ApiError } from '@google-cloud/storage';
import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import ky from 'ky';

export class GoogleCloudStorageService {
  private readonly storage: Storage;
  private readonly bucketName: string;
  private readonly raiseExceptions: boolean;
  private readonly logger = new Logger(GoogleCloudStorageService.name);

  /**
   * Constructs a new instance of GoogleCloudStorageService.
   * @param bucketName - The name of the Google Cloud Storage bucket to use.
   * @param raiseExceptions - Whether to throw exceptions on errors (default: true).
   */
  constructor(
    bucketName: string,
    serviceAccountData: object,
    raiseExceptions: boolean = true,
  ) {
    this.storage = new Storage({
      credentials: serviceAccountData,
    }); // Initialize Google Cloud Storage client
    this.bucketName = bucketName; // Set the bucket name
    this.raiseExceptions = raiseExceptions; // Configure exception handling
  }

  /**
   * Uploads an image from a given URL to Google Cloud Storage.
   * @param imageUrl - The URL of the image to upload.
   * @param destinationFileName - The name of the file to save in the bucket.
   * @throws HttpException - If an error occurs and `raiseExceptions` is true.
   */
  async uploadImageFromUrl(
    imageUrl: string,
    destinationFileName: string,
  ): Promise<void> {
    try {
      // Fetch the image from the provided URL
      const response = await ky
        .get(imageUrl, {
          retry: {
            limit: 3,
            statusCodes: [408, 429, 500, 502, 503, 504],
            backoffLimit: 10000,
          },
        })
        .arrayBuffer();

      // Get a reference to the bucket and file
      const bucket = this.storage.bucket(this.bucketName);
      const file = bucket.file(destinationFileName);

      // Save the image to Google Cloud Storage
      await file.save(Buffer.from(response));
      this.logger.log(`Image successfully uploaded to ${destinationFileName}.`);
    } catch (error: any) {
      // Log the error
      if (error instanceof ApiError) {
        this.logger.error(`Google Cloud Storage error: ${error.message}`);
      } else {
        this.logger.error(`Unexpected error: ${error}`);
      }

      // Throw an exception if configured to do so
      if (this.raiseExceptions) {
        throw new HttpException(
          'An error occurred while uploading the image. Please try again later.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  async createSignedUrl(destinationFileName: string) {
    const options = {
      version: 'v4' as const,
      action: 'read' as const,
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    try {
      const [url] = await this.storage
        .bucket(this.bucketName)
        .file(destinationFileName)
        .getSignedUrl(options);

      return url;
    } catch (error) {
      this.logger.error(`Error creating signed URL: ${error}`);
      if (this.raiseExceptions) {
        throw new HttpException(
          'An error occurred while processing your request. Please try again later.',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      return false;
    }
  }
}
