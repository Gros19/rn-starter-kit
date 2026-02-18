import { useQuery } from '@tanstack/react-query';
import * as galleryMock from '../mock';

const GALLERY_KEY = ['gallery'] as const;

export function useGallery() {
  return useQuery({
    queryKey: GALLERY_KEY,
    queryFn: () => galleryMock.getGalleryItems(),
  });
}
