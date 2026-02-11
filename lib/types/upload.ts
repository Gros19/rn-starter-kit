export type UploadSource = 'camera' | 'gallery' | 'document';
export type UploadStatus = 'queued' | 'uploading' | 'completed' | 'failed';

export interface UploadItem {
  id: string;
  uri: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  source: UploadSource;
  status: UploadStatus;
  progress: number; // 0-100
  remoteUrl?: string;
  error?: string;
  retryCount: number;
}

export interface UploadConfig {
  maxRetries: number;
  maxFileSize: number; // bytes
  allowedTypes: string[];
  bucket: string;
}
