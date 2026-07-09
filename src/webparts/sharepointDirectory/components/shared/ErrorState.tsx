import * as React from 'react';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { strings } from '../../loc/mystrings';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry
}) => {
  return (
    <MessageBar
      messageBarType={MessageBarType.error}
      isMultiline={false}
      actions={
        <DefaultButton onClick={onRetry}>{strings.Retry}</DefaultButton>
      }
    >
      {message || strings.ErrorLoading}
    </MessageBar>
  );
};

export default ErrorState;
