import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { supabase } from '../../supabase/client/supabaseClient';

export interface IStorageService {
  pickAndUploadImage(bucket: string, pathPrefix: string): Promise<string>;
  uploadImage(imageUri: string, bucket: string, path: string): Promise<string>;
  deleteFile(bucket: string, path: string): Promise<void>;
  getPublicUrl(bucket: string, path: string): string;
}

type MediaAsset = ImagePicker.ImagePickerAsset;

export class SupabaseStorageService implements IStorageService {
  async pickAndUploadImage(bucket: string, pathPrefix: string): Promise<string> {
    await this.ensureMediaLibraryPermission();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
      base64: true,
    });

    if (result.canceled || !result.assets?.length) {
      throw new Error('Selecao de imagem cancelada.');
    }

    const asset = result.assets[0];
    const filePath = this.buildFilePath(pathPrefix, asset);

    if (!asset.base64) {
      // fallback: upload using uri if base64 not available
      return this.uploadImage(asset.uri, bucket, filePath);
    }

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, decode(asset.base64), {
        contentType: asset.mimeType ?? 'image/jpeg',
        upsert: false,
      });

    if (error) {
      throw new Error(`Falha ao subir arquivo: ${error.message}`);
    }

    return filePath;
  }

  async uploadImage(imageUri: string, bucket: string, path: string): Promise<string> {
    const response = await fetch(imageUri);

    if (!response.ok) {
      throw new Error('Nao foi possivel ler o arquivo local.');
    }

    const contentType = response.headers.get('Content-Type') ?? 'image/jpeg';
    const arrayBuffer = await response.arrayBuffer();

    const { error, data } = await supabase.storage.from(bucket).upload(path, arrayBuffer, {
      contentType,
      upsert: false,
    });

    if (error) {
      throw new Error(`Falha ao subir arquivo: ${error.message}`);
    }

    return data?.path ?? path;
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      throw new Error(`Falha ao remover arquivo: ${error.message}`);
    }
  }

  getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }

  private async ensureMediaLibraryPermission(): Promise<void> {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== ImagePicker.PermissionStatus.GRANTED) {
      throw new Error('Permissao para acessar a galeria foi negada.');
    }
  }

  private buildFilePath(pathPrefix: string, asset: MediaAsset): string {
    const sanitizedPrefix = pathPrefix.replace(/\/+$/, '');
    const extension = this.getExtension(asset.fileName) ?? this.mimeToExtension(asset.mimeType) ?? 'jpg';
    return `${sanitizedPrefix}/${Date.now()}.${extension}`;
  }

  private getExtension(fileName?: string | null): string | undefined {
    if (!fileName) {
      return undefined;
    }

    const parts = fileName.split('.');
    return parts.length > 1 ? parts.pop() : undefined;
  }

  private mimeToExtension(mime?: string | null): string | undefined {
    if (!mime) {
      return undefined;
    }

    const [type, ext] = mime.split('/');
    if (type !== 'image' || !ext) {
      return undefined;
    }

    return ext === 'jpeg' ? 'jpg' : ext;
  }
}
