import * as React from 'react';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { Stack } from '@fluentui/react/lib/Stack';

const LoadingState: React.FC = () => {
  return (
    <Stack horizontalAlign="center" verticalAlign="center" tokens={{ padding: 40 }}>
      <Spinner size={SpinnerSize.large} label="Chargement de l'annuaire..." />
    </Stack>
  );
};

export default LoadingState;
