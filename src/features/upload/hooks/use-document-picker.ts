import { useCallback } from 'react';
import * as DocumentPicker from 'expo-document-picker';

export function useDocumentPicker() {
  const pickDocument = useCallback(async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets[0]) return null;

    const asset = result.assets[0];
    return {
      uri: asset.uri,
      name: asset.name,
      size: asset.size ?? 0,
      mimeType: asset.mimeType ?? 'application/octet-stream',
    };
  }, []);

  return { pickDocument };
}
