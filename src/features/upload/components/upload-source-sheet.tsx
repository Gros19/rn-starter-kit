import { View, Pressable } from 'react-native';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Text } from '@/components/ui/text';
import { Camera, Image, FileText } from 'lucide-react-native';

interface UploadSourceSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectCamera: () => void;
  onSelectGallery: () => void;
  onSelectDocument: () => void;
}

export function UploadSourceSheet({
  open,
  onOpenChange,
  onSelectCamera,
  onSelectGallery,
  onSelectDocument,
}: UploadSourceSheetProps) {
  const options = [
    { icon: Camera, label: '카메라', onPress: onSelectCamera },
    { icon: Image, label: '갤러리', onPress: onSelectGallery },
    { icon: FileText, label: '문서', onPress: onSelectDocument },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>파일 선택</DialogTitle>
        </DialogHeader>
        <View className="gap-2">
          {options.map((opt) => {
            const Icon = opt.icon;
            return (
              <Pressable
                key={opt.label}
                onPress={() => {
                  onOpenChange(false);
                  opt.onPress();
                }}
                className="flex-row items-center gap-4 p-3 rounded-lg active:bg-accent"
              >
                <View className="bg-primary/10 p-2 rounded-lg">
                  <Icon size={20} className="text-primary" />
                </View>
                <Text className="font-medium">{opt.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </DialogContent>
    </Dialog>
  );
}
