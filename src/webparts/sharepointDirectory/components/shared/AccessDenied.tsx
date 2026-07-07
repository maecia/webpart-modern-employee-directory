import * as React from 'react';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { Stack } from '@fluentui/react/lib/Stack';
import { Icon } from '@fluentui/react/lib/Icon';

const AccessDenied: React.FC = () => {
  return (
    <Stack horizontalAlign="center" verticalAlign="center" tokens={{ padding: 40 }}>
      <Icon iconName="Lock" style={{ fontSize: 48, color: '#a19f9d', marginBottom: 12 }} />
      <MessageBar messageBarType={MessageBarType.warning} isMultiline={false}>
        Vous n'avez pas les droits nécessaires pour accéder à cet annuaire.
      </MessageBar>
    </Stack>
  );
};

export default AccessDenied;
