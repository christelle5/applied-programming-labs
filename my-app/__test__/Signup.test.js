import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Signup from '../src/components/Signup';

describe('Signup component', () => {

  it('should render Sign up title', () => {
    render(<Router> <Signup /> </Router>);
  });

  it('should show error toast when passwords do not match', () => {
    render(<Router><Signup /></Router>);

    const passwordInput = screen.getByPlaceholderText('p4sSw0_rd&%d1');
    const confirmPasswordInput = screen.getByPlaceholderText('p4sSw0_rd&%d2');
    const signupButton = screen.getByText('SignUp');

    fireEvent.change(passwordInput, { target: { value: 'password1' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'password2' } });

    // Перехоплюємо виклик функції alert
    jest.spyOn(window, 'alert').mockImplementation(() => {});

    fireEvent.click(signupButton);

    // Перевіряємо, що функція alert була викликана з очікуваним повідомленням
    expect(window.alert).toHaveBeenCalledWith('Passwords are different!');

    // Відновлюємо оригінальну реалізацію функції alert
    window.alert.mockRestore();
  });

  it('should show success message when new user is created', async () => {
      render(<Router><Signup /></Router>);

      const usernameInput = screen.getByPlaceholderText('user_n4me');
      const firstNameInput = screen.getByPlaceholderText('John');
      const lastNameInput = screen.getByPlaceholderText('Kim');
      const emailInput = screen.getByPlaceholderText('johnkim@yahoo.com');
      const passwordInput = screen.getByPlaceholderText('p4sSw0_rd&%d1');
      const confirmPasswordInput = screen.getByPlaceholderText('p4sSw0_rd&%d2');
      const signupButton = screen.getByText('SignUp');

      fireEvent.change(usernameInput, { target: { value: 'new_user' } });
      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Kim' } });
      fireEvent.change(emailInput, { target: { value: 'johnkim@yahoo.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password' } });
      fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });

      jest.spyOn(window, 'alert').mockImplementation(() => {});

      fireEvent.click(signupButton);

      // Відновлюємо оригінальну реалізацію функції alert
      window.alert.mockRestore();
    });
});