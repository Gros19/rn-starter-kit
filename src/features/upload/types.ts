export type UploadStatus = 'pending' | 'uploading' | 'success' | 'error';

export interface UploadItem {
  id: string;
  uri: string;
  name: string;
  size: number;
  mimeType: string;
  status: UploadStatus;
  progress: number;
  retryCount: number;
}
