import * as React from 'react';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { DefaultButton } from '@fluentui/react/lib/Button';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Une erreur est survenue lors du chargement de l\'annuaire.',
  onRetry
}) => {
  return (
    <MessageBar
      messageBarType={MessageBarType.error}
      isMultiline={false}
      actions={
        <DefaultButton onClick={onRetry}>Réessayer</DefaultButton>
      }
    >
      {message}
    </MessageBar>
  );
};

export default ErrorState;
