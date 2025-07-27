import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

// Mock axios
vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('App', () => {
  it('renders without crashing', () => {
    localStorageMock.getItem.mockReturnValue(null);
    renderWithRouter(<App />);
    expect(screen.getByText(/体育活动室/i)).toBeInTheDocument();
  });

  it('shows login when no token', () => {
    localStorageMock.getItem.mockReturnValue(null);
    renderWithRouter(<App />);
    expect(screen.getByText(/登录/i)).toBeInTheDocument();
  });
}); 