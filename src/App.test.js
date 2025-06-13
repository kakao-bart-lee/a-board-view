import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navigation links', () => {
  render(<App />);
  const links = screen.getAllByText(/Posts/i);
  expect(links.length).toBeGreaterThan(0);
});
