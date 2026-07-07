import * as React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ErrorState from '../../../../src/webparts/sharepointDirectory/components/shared/ErrorState';

describe('ErrorState', () => {
  it('renders error message', () => {
    const { getByText } = render(React.createElement(ErrorState, { onRetry: jest.fn() }));
    expect(getByText(/Une erreur est survenue/)).toBeTruthy();
  });

  it('renders custom error message', () => {
    const { getByText } = render(React.createElement(ErrorState, { message: 'Custom error', onRetry: jest.fn() }));
    expect(getByText('Custom error')).toBeTruthy();
  });

  it('calls onRetry when retry button clicked', () => {
    const onRetry = jest.fn();
    const { getByText } = render(React.createElement(ErrorState, { onRetry }));
    fireEvent.click(getByText('Réessayer'));
    expect(onRetry).toHaveBeenCalled();
  });
});
