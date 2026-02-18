import { Component, type ErrorInfo, type PropsWithChildren } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps extends PropsWithChildren {
  fallback?: (props: { error: Error; reset: () => void }) => React.ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback({ error: this.state.error, reset: this.reset });
      }

      return (
        <View className="flex-1 items-center justify-center p-6 bg-background">
          <Text className="text-xl font-bold text-foreground mb-2">
            문제가 발생했습니다
          </Text>
          <Text className="text-sm text-muted-foreground text-center mb-6">
            {this.state.error.message}
          </Text>
          <TouchableOpacity
            onPress={this.reset}
            className="bg-primary px-6 py-3 rounded-xl"
            accessibilityRole="button"
            accessibilityLabel="다시 시도"
          >
            <Text className="text-white font-semibold">다시 시도</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
