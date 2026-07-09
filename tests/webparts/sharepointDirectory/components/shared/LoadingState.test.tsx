import * as React from 'react';
import { render } from '@testing-library/react';
import LoadingState from '../../../../src/webparts/sharepointDirectory/components/shared/LoadingState';

describe('LoadingState', () => {
  it('renders loading spinner with label', () => {
    const { getByText } = render(React.createElement(LoadingState));
    expect(getByText('Chargement...')).toBeTruthy();
  });
});
