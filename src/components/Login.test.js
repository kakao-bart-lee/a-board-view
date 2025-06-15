import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from './Login';
import { AuthContext } from '../AuthContext';

function renderWithContext(ui, { login = jest.fn() } = {}) {
  return {
    login,
    ...render(
      <AuthContext.Provider value={{ token: null, login }}>
        {ui}
      </AuthContext.Provider>
    ),
  };
}

afterEach(() => {
  jest.restoreAllMocks();
});

test('submits user id and stores token', async () => {
  const { login } = renderWithContext(<Login />);
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ token: 'abc123' }),
  });

  userEvent.type(screen.getByPlaceholderText(/User ID/i), '42');
  userEvent.click(screen.getByRole('button', { name: /Login/i }));

  await waitFor(() => expect(fetch).toHaveBeenCalled());
  await waitFor(() => expect(login).toHaveBeenCalledWith('abc123'));
});
