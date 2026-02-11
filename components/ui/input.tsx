import { forwardRef, useState } from 'react';
import { TextInput, View, Text, Pressable, type TextInputProps } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  { label, error, hint, leftIcon, rightIcon, containerClassName = '', secureTextEntry, ...props },
  ref,
) {
  const [isSecure, setIsSecure] = useState(secureTextEntry);
  const hasError = !!error;

  return (
    <View className={containerClassName}>
      {label && (
        <Text className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
          {label}
        </Text>
      )}
      <View
        className={`flex-row items-center border rounded-xl px-3 py-3 bg-neutral-50 dark:bg-neutral-900 ${
          hasError
            ? 'border-error-500'
            : 'border-neutral-200 dark:border-neutral-700 focus:border-primary-500'
        }`}
      >
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        <TextInput
          ref={ref}
          className="flex-1 text-base text-neutral-900 dark:text-neutral-100"
          placeholderTextColor="#A3A3A3"
          secureTextEntry={isSecure}
          accessibilityLabel={label}
          {...props}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setIsSecure(!isSecure)} className="ml-2" hitSlop={8}>
            {isSecure ? (
              <EyeOff size={20} color="#A3A3A3" />
            ) : (
              <Eye size={20} color="#A3A3A3" />
            )}
          </Pressable>
        )}
        {rightIcon && !secureTextEntry && <View className="ml-2">{rightIcon}</View>}
      </View>
      {error && <Text className="text-xs text-error-500 mt-1">{error}</Text>}
      {hint && !error && (
        <Text className="text-xs text-neutral-400 mt-1">{hint}</Text>
      )}
    </View>
  );
});
