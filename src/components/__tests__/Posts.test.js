import { render, screen } from '@testing-library/react';
import Posts from '../Posts';
import { AuthContext } from '../../AuthContext';
import { MemoryRouter } from 'react-router-dom';

function renderWithProviders(ui) {
  return render(
    <AuthContext.Provider value={{ token: null }}>
      <MemoryRouter>{ui}</MemoryRouter>
    </AuthContext.Provider>
  );
}

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders posts from api', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => [{ id: 1, title: 'First Post' }],
  });

  renderWithProviders(<Posts />);

  expect(await screen.findByRole('link', { name: 'First Post' })).toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/posts'), expect.any(Object));
});
