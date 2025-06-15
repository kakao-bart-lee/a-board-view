import { render } from '@testing-library/react';
import { AuthContext } from './AuthContext';
import { useApi } from './api';

let captured;
function TestComponent() {
  captured = useApi();
  return null;
}

function renderWithToken(token) {
  return render(
    <AuthContext.Provider value={{ token }}>
      <TestComponent />
    </AuthContext.Provider>
  );
}

test('useApi returns stable function when token is unchanged', () => {
  const { rerender } = renderWithToken('abc');
  const first = captured;
  rerender(
    <AuthContext.Provider value={{ token: 'abc' }}>
      <TestComponent />
    </AuthContext.Provider>
  );
  expect(captured).toBe(first);
});
