// 

// File: __tests__/Login.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../src/pages/Login';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

beforeAll(() => {
  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
});

describe('Login Component', () => {
  const setUserMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function renderLogin() {
    return render(
      <BrowserRouter>
        <Login setUser={setUserMock} />
      </BrowserRouter>
    );
  }

  it('renders form inputs and button', () => {
    renderLogin();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows error on invalid email/phone and password', async () => {
    renderLogin();
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'bademail' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    expect(await screen.findByText(/Enter a valid email/i)).toBeInTheDocument();
    expect(await screen.findByText(/Password must be at least 6 characters/i)).toBeInTheDocument();
  });

  it('toggles password visibility', () => {
    renderLogin();
    const passwordInput = screen.getByLabelText(/Password/i);
    const eyeIcon = passwordInput.parentElement?.querySelector('span');
    expect(passwordInput).toHaveAttribute('type', 'password');
    fireEvent.click(eyeIcon!);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('navigates to signup when register is clicked', () => {
    renderLogin();
    fireEvent.click(screen.getByText(/Register/i));
    expect(mockNavigate).toHaveBeenCalledWith('/signup');
  });

  it('opens forgot password dialog', () => {
    renderLogin();
    fireEvent.click(screen.getByText(/Forgot Password\?/i));
    expect(screen.getByText(/Reset Password/i)).toBeInTheDocument();
  });

  it('shows error if passwords do not match in forgot password', async () => {
    renderLogin();
    fireEvent.click(screen.getByText(/Forgot Password\?/i));
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/New Password/i), { target: { value: 'password1' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password2' } });
    fireEvent.click(screen.getByRole('button', { name: /Change Password/i }));
    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    const mockToken = 'mock.jwt.token';
    const payload = { sub: 'test@example.com' };
    const encodedPayload = btoa(JSON.stringify(payload));
    const fullToken = `header.${encodedPayload}.signature`;

    mockedAxios.post.mockResolvedValueOnce({ data: { access_token: fullToken } });
    mockedAxios.get.mockResolvedValueOnce({ data: { bank: 'Mock Bank' } });

    renderLogin();
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('token', fullToken);
      expect(setUserMock).toHaveBeenCalledWith({ email: 'test@example.com', bank: 'Mock Bank' });
      expect(mockNavigate).toHaveBeenCalledWith('/home');
    });
  });

  it('shows snackbar on login failure', async () => {
    mockedAxios.post.mockRejectedValueOnce({ response: { data: { error: 'Invalid credentials' } } });

    renderLogin();
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(await screen.findByText(/Invalid credentials/i)).toBeInTheDocument();
  });
});