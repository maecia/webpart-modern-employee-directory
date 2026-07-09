import * as React from 'react';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { Stack } from '@fluentui/react/lib/Stack';
import { strings } from '../../loc/mystrings';

const LoadingState: React.FC = () => {
  return (
    <Stack horizontalAlign="center" verticalAlign="center" tokens={{ padding: 40 }}>
      <Spinner size={SpinnerSize.large} label={strings.LoadingText} />
    </Stack>
  );
};

export default LoadingState;
