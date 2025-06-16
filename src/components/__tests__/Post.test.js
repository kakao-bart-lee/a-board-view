import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Post from '../Post';
import { AuthContext } from '../../AuthContext';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
}));

function renderWithContext(ui) {
  return render(
    <AuthContext.Provider value={{ token: null }}>{ui}</AuthContext.Provider>
  );
}

afterEach(() => {
  jest.restoreAllMocks();
});

test('loads post and submits comment', async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, text: 'Hello', comments: [] }),
    })
    .mockResolvedValueOnce({ ok: true })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, text: 'Hello', comments: [{ id: 2, text: 'Nice' }] }),
    });

  renderWithContext(<Post />);

  expect(await screen.findByText(/Hello/)).toBeInTheDocument();
  userEvent.type(screen.getByPlaceholderText(/Comment/i), 'Nice');
  userEvent.click(screen.getByRole('button', { name: /Add Comment/i }));

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(3));
  expect(await screen.findByText(/Nice/)).toBeInTheDocument();
  await waitFor(() => expect(screen.getByPlaceholderText(/Comment/i)).toHaveValue(''));
});

test('replies to a comment with parentCommentId', async () => {
  global.fetch = jest
    .fn()
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 1, text: 'Hello', comments: [{ id: 2, text: 'Nice' }] }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 3, text: 'Thanks', parentCommentId: 2 }),
    });

  renderWithContext(<Post />);

  expect(await screen.findByText(/Nice/)).toBeInTheDocument();
  userEvent.click(screen.getByRole('button', { name: '답글' }));
  userEvent.type(screen.getByPlaceholderText(/Comment/i), 'Thanks');
  userEvent.click(screen.getByRole('button', { name: /Add Comment/i }));

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(2));
  const body = JSON.parse(fetch.mock.calls[1][1].body);
  expect(body).toEqual({ text: 'Thanks', parentCommentId: 2 });
  expect(await screen.findByText(/Thanks/)).toBeInTheDocument();
});

test('does not show reply button for a reply comment', async () => {
  global.fetch = jest.fn().mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      id: 1,
      text: 'Hello',
      comments: [
        { id: 2, text: 'Nice', comments: [{ id: 3, text: 'Thanks', comments: [{ id: 4, text: 'More' }] }] },
      ],
    }),
  });

  renderWithContext(<Post />);

  expect(await screen.findByText(/Nice/)).toBeInTheDocument();
  expect(await screen.findByText(/Thanks/)).toBeInTheDocument();
  expect(screen.queryByText(/More/)).not.toBeInTheDocument();

  const replyButtons = screen.getAllByRole('button', { name: '답글' });
  expect(replyButtons).toHaveLength(1);
});
