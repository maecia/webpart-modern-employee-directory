import * as React from 'react';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { strings } from '../../loc/mystrings';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(_error: Error, _errorInfo: React.ErrorInfo): void {
    this.setState({ hasError: true });
  }

  private handleRetry = (): void => {
    this.setState({ hasError: false });
  };

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <MessageBar
          messageBarType={MessageBarType.error}
          isMultiline={false}
          actions={
            <DefaultButton onClick={this.handleRetry}>
              {strings.Retry}
            </DefaultButton>
          }
        >
          {strings.ErrorBoundaryMessage}
        </MessageBar>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
