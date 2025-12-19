import * as FileSystem from 'expo-file-system';

function guessExtension(uri: string): string {
  const match = uri.split('?')[0]?.match(/\.([a-zA-Z0-9]+)$/);
  const ext = match?.[1]?.toLowerCase();
  if (ext && ext.length <= 5) {
    return ext === 'jpeg' ? 'jpg' : ext;
  }
  return 'jpg';
}

function ensureTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}

export async function persistLocalImage(
  sourceUri: string,
  folderName: string
): Promise<string> {
  if (!sourceUri) {
    throw new Error('Parametro obrigatorio: sourceUri');
  }

  const documentDir = FileSystem.documentDirectory;

  if (!documentDir) {
    return sourceUri;
  }

  if (sourceUri.startsWith(documentDir)) {
    return sourceUri;
  }

  const folder = ensureTrailingSlash(`${documentDir}${folderName}`);
  await FileSystem.makeDirectoryAsync(folder, { intermediates: true }).catch(() => undefined);

  const extension = guessExtension(sourceUri);
  const destinationUri = `${folder}${Date.now()}.${extension}`;

  await FileSystem.copyAsync({ from: sourceUri, to: destinationUri });
  return destinationUri;
}

