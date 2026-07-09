import * as React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { Icon } from '@fluentui/react/lib/Icon';
import { Text } from '@fluentui/react/lib/Text';
import { strings } from '../../loc/mystrings';

const EmptyState: React.FC = () => {
  return (
    <Stack horizontalAlign="center" verticalAlign="center" tokens={{ padding: 40, childrenGap: 12 }}>
      <Icon iconName="SearchIssue" style={{ fontSize: 48, color: '#605e5c' }} aria-hidden="true" />
      <Text variant="large" role="status">{strings.NoResults}</Text>
      <Text variant="medium" style={{ color: '#605e5c' }}>
        {strings.EmptyStateHint}
      </Text>
    </Stack>
  );
};

export default EmptyState;
