import * as React from 'react';
import { Stack } from '@fluentui/react/lib/Stack';
import { Icon } from '@fluentui/react/lib/Icon';
import { Text } from '@fluentui/react/lib/Text';

const EmptyState: React.FC = () => {
  return (
    <Stack horizontalAlign="center" verticalAlign="center" tokens={{ padding: 40, childrenGap: 12 }}>
      <Icon iconName="SearchIssue" style={{ fontSize: 48, color: '#a19f9d' }} aria-hidden="true" />
      <Text variant="large" role="status">Aucun résultat trouvé</Text>
      <Text variant="medium" style={{ color: '#605e5c' }}>
        Essayez de modifier vos critères de recherche ou vos filtres.
      </Text>
    </Stack>
  );
};

export default EmptyState;
