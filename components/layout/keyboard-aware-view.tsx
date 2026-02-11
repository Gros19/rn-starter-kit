import { type PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

interface KeyboardAwareViewProps extends PropsWithChildren {
  className?: string;
  scrollEnabled?: boolean;
}

export function KeyboardAwareView({
  children,
  className = '',
  scrollEnabled = true,
}: KeyboardAwareViewProps) {
  return (
    <KeyboardAvoidingView
      className={`flex-1 ${className}`}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      {scrollEnabled ? (
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        children
      )}
    </KeyboardAvoidingView>
  );
}
