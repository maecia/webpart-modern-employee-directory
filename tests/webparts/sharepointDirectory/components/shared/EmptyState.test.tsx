import * as React from 'react';
import { render } from '@testing-library/react';
import EmptyState from '../../../../../src/webparts/sharepointDirectory/components/shared/EmptyState';

describe('EmptyState', () => {
  it('renders empty state message', () => {
    const { getByText } = render(React.createElement(EmptyState));
    expect(getByText('Aucun collaborateur trouvé')).toBeTruthy();
    expect(getByText('Essayez de modifier vos critères de recherche ou vos filtres.')).toBeTruthy();
  });
});
