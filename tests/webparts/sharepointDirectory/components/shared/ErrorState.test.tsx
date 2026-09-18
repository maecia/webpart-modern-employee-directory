import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ErrorState from '../../../../../src/webparts/sharepointDirectory/components/shared/ErrorState';

describe('ErrorState', () => {
  it('renders the default error message', async () => {
    const { findByText } = render(React.createElement(ErrorState, { onRetry: jest.fn() }));
    expect(await findByText(/Impossible de charger les données/)).toBeTruthy();
  });

  it('renders a custom error message', async () => {
    const { findByText } = render(
      React.createElement(ErrorState, { message: 'Custom error', onRetry: jest.fn() })
    );
    expect(await findByText('Custom error')).toBeTruthy();
  });

  it('calls onRetry when the retry button is clicked', async () => {
    const onRetry = jest.fn();
    const { findByText } = render(React.createElement(ErrorState, { onRetry }));
    fireEvent.click(await findByText('Réessayer'));
    expect(onRetry).toHaveBeenCalled();
  });
});
