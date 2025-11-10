import { useCallback, useMemo, useState } from 'react';
import { SupabaseStorageService } from '../core/infra/supabase/storage/storageService';
import { UploadFileUseCase } from '../core/application/use-cases/UploadFile';
import { useAuth } from '../context/auth';

type UploadResult = {
  publicUrl: string;
  path: string;
};

export function useImageUpload(defaultBucket = 'user-uploads', defaultFolder = 'images') {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const storageService = useMemo(() => new SupabaseStorageService(), []);
  const uploadUseCase = useMemo(() => new UploadFileUseCase(storageService), [storageService]);

  const uploadFromUri = useCallback(
    async (imageUri: string, bucket = defaultBucket, folder = defaultFolder): Promise<UploadResult> => {
      if (!user) {
        throw new Error('Usuario nao autenticado.');
      }

      setUploading(true);
      setError(null);

      try {
        const { publicUrl, path } = await uploadUseCase.execute({
          imageUri,
          bucket,
          userId: user.id,
          folder,
        });

        return { publicUrl, path };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao fazer upload da imagem.';
        setError(message);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [defaultBucket, defaultFolder, uploadUseCase, user]
  );

  const pickAndUpload = useCallback(
    async (bucket = defaultBucket, folder = defaultFolder): Promise<UploadResult> => {
      if (!user) {
        throw new Error('Usuario nao autenticado.');
      }

      setUploading(true);
      setError(null);

      try {
        const filePath = await storageService.pickAndUploadImage(bucket, `${user.id}/${folder}`);
        const publicUrl = storageService.getPublicUrl(bucket, filePath);

        return { publicUrl, path: filePath };
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao selecionar a imagem.';
        setError(message);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [defaultBucket, defaultFolder, storageService, user]
  );

  const deleteFile = useCallback(
    async (path: string, bucket = defaultBucket): Promise<void> => {
      if (!path) {
        return;
      }

      setUploading(true);
      setError(null);

      try {
        await storageService.deleteFile(bucket, path);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao deletar imagem.';
        setError(message);
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [defaultBucket, storageService]
  );

  return {
    uploadFromUri,
    pickAndUpload,
    deleteFile,
    uploading,
    error,
  };
}
