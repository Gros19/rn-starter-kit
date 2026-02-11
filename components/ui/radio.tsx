import { Pressable, View, Text } from 'react-native';

interface RadioOption<T extends string> {
  label: string;
  value: T;
  description?: string;
}

interface RadioGroupProps<T extends string> {
  options: RadioOption<T>[];
  value: T;
  onChange: (value: T) => void;
  direction?: 'vertical' | 'horizontal';
}

export function RadioGroup<T extends string>({
  options,
  value,
  onChange,
  direction = 'vertical',
}: RadioGroupProps<T>) {
  return (
    <View className={direction === 'horizontal' ? 'flex-row flex-wrap gap-4' : 'gap-3'}>
      {options.map((option) => {
        const selected = value === option.value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            className="flex-row items-start"
            accessibilityRole="radio"
            accessibilityState={{ selected }}
          >
            <View
              className={`w-5 h-5 rounded-full border-2 items-center justify-center mt-0.5 ${
                selected ? 'border-primary-500' : 'border-neutral-300 dark:border-neutral-600'
              }`}
            >
              {selected && <View className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
            </View>
            <View className="ml-2 flex-1">
              <Text className="text-base text-neutral-900 dark:text-neutral-100">
                {option.label}
              </Text>
              {option.description && (
                <Text className="text-sm text-neutral-500 mt-0.5">{option.description}</Text>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}
