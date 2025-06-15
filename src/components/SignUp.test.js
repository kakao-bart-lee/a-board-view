import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUp from './SignUp';
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

test('creates user and requests token', async () => {
  const { login } = renderWithContext(<SignUp />);
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 1 }) })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ token: 'jwt' }) });

  userEvent.type(screen.getByPlaceholderText(/Name/i), 'Jane');
  userEvent.selectOptions(screen.getByLabelText(/Gender/i), 'female');
  userEvent.type(screen.getByPlaceholderText(/Birth Year/i), '2000');
  userEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  await waitFor(() => expect(login).toHaveBeenCalledWith('jwt'));
});

test('shows error message on failure', async () => {
  renderWithContext(<SignUp />);
  global.fetch = jest.fn().mockRejectedValueOnce(new Error('network'));

  userEvent.type(screen.getByPlaceholderText(/Name/i), 'Jane');
  userEvent.selectOptions(screen.getByLabelText(/Gender/i), 'female');
  userEvent.type(screen.getByPlaceholderText(/Birth Year/i), '2000');
  userEvent.click(screen.getByRole('button', { name: /Sign Up/i }));

  await screen.findByRole('alert');
});
