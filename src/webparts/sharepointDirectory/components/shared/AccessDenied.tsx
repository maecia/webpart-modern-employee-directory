import * as React from 'react';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { Stack } from '@fluentui/react/lib/Stack';
import { Icon } from '@fluentui/react/lib/Icon';
import { strings } from '../../loc/mystrings';

const AccessDenied: React.FC = () => {
  return (
    <Stack horizontalAlign="center" verticalAlign="center" tokens={{ padding: 40 }}>
      <Icon iconName="Lock" style={{ fontSize: 48, color: '#605e5c', marginBottom: 12 }} />
      <MessageBar messageBarType={MessageBarType.warning} isMultiline={false}>
        {strings.AccessDeniedMessage}
      </MessageBar>
    </Stack>
  );
};

export default AccessDenied;
