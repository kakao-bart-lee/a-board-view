import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import CreatePost from '../CreatePost';
import { AuthContext } from '../../AuthContext';

function renderWithRouter(ui) {
  return render(
    <AuthContext.Provider value={{ token: null }}>
      <MemoryRouter initialEntries={["/create"]}>
        <Routes>
          <Route path="/create" element={ui} />
          <Route path="/" element={<div>Home</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

afterEach(() => {
  jest.restoreAllMocks();
});

test('submits new post and navigates home', async () => {
  global.fetch = jest.fn().mockResolvedValue({ ok: true });

  renderWithRouter(<CreatePost />);
  userEvent.type(screen.getByPlaceholderText(/Write something/i), 'Hello world');
  userEvent.click(screen.getByRole('button', { name: /Submit/i }));

  await waitFor(() => expect(fetch).toHaveBeenCalled());
  await screen.findByText('Home');
});
