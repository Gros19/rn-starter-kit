import { ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

interface FilterChip<T extends string> {
  label: string;
  value: T;
}

interface FilterChipsProps<T extends string> {
  chips: FilterChip<T>[];
  selected?: T;
  onSelect: (value: T | undefined) => void;
  className?: string;
}

export function FilterChips<T extends string>({
  chips,
  selected,
  onSelect,
  className,
}: FilterChipsProps<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2"
      className={className}
    >
      {chips.map((chip) => {
        const isSelected = selected === chip.value;
        return (
          <Pressable
            key={chip.value}
            onPress={() => onSelect(isSelected ? undefined : chip.value)}
            className={cn(
              'px-3 py-1.5 rounded-full border',
              isSelected
                ? 'bg-primary border-primary'
                : 'bg-background border-border',
            )}
          >
            <Text
              className={cn(
                'text-sm',
                isSelected ? 'text-primary-foreground font-medium' : 'text-foreground',
              )}
            >
              {chip.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
