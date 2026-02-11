import { Pressable, View, Text } from 'react-native';
import { Check } from 'lucide-react-native';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onToggle: (checked: boolean) => void;
  disabled?: boolean;
}

export function Checkbox({ label, checked, onToggle, disabled = false }: CheckboxProps) {
  return (
    <Pressable
      onPress={() => !disabled && onToggle(!checked)}
      className="flex-row items-center"
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
    >
      <View
        className={`w-5 h-5 rounded border-2 items-center justify-center ${
          checked
            ? 'bg-primary-500 border-primary-500'
            : 'border-neutral-300 dark:border-neutral-600'
        } ${disabled ? 'opacity-50' : ''}`}
      >
        {checked && <Check size={14} color="#fff" strokeWidth={3} />}
      </View>
      {label && (
        <Text
          className={`ml-2 text-base text-neutral-900 dark:text-neutral-100 ${disabled ? 'opacity-50' : ''}`}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
