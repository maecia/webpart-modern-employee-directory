import * as React from 'react';
import { render } from '@testing-library/react';
import AccessDenied from '../../../../src/webparts/sharepointDirectory/components/shared/AccessDenied';

describe('AccessDenied', () => {
  it('renders access denied message', () => {
    const { getByText } = render(React.createElement(AccessDenied));
    expect(getByText(/Vous n'avez pas les droits nécessaires pour accéder à cet annuaire/)).toBeTruthy();
  });
});
