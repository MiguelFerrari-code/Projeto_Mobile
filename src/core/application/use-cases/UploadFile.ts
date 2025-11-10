import { IStorageService } from '../../infra/supabase/storage/storageService';

type UploadFileInput = {
  imageUri: string;
  bucket: string;
  userId: string;
  folder?: string;
};

export type UploadFileOutput = {
  path: string;
  publicUrl: string;
};

export class UploadFileUseCase {
  constructor(private readonly storageService: IStorageService) {}

  async execute({ imageUri, bucket, userId, folder = 'uploads' }: UploadFileInput): Promise<UploadFileOutput> {
    if (!imageUri) {
      throw new Error('Parametro obrigatorio: imageUri');
    }

    if (!bucket) {
      throw new Error('Parametro obrigatorio: bucket');
    }

    if (!userId) {
      throw new Error('Parametro obrigatorio: userId');
    }

    const normalizedFolder = folder.replace(/^\/+|\/+$/g, '');
    const filePath = `${userId}/${normalizedFolder}/${Date.now()}.jpg`;
    const path = await this.storageService.uploadImage(imageUri, bucket, filePath);
    const publicUrl = this.storageService.getPublicUrl(bucket, path);

    return {
      path,
      publicUrl,
    };
  }
}
