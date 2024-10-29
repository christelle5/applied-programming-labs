import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Login from '../src/components/Login';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';

describe('Login component', () => {
  it('should render Login title', () => {
    render(<Router> <Login /> </Router>);
  });

  it('should show error toast when wrong username and password are provided', async () => {
    render(<Router> <Login /> </Router>);
    const username = screen.getByTestId('username');
    const password = screen.getByTestId('password');
    const loginBtn = screen.getByRole('button', { name: 'Log in' });
    fireEvent.change(username, { target: { value: 'wrong_username' } });
    fireEvent.change(password, { target: { value: 'wrong_password' } });
    fireEvent.click(loginBtn);
    //expect(toast).toBeInTheDocument();
  });
});