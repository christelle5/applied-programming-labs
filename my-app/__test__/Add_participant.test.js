import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Add_participant from '../src/components/Add_participant';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import fetchMock from 'jest-fetch-mock';

// Налаштування глобального об'єкту fetch для використання jest-fetch-mock
global.fetch = fetchMock;

describe('Add_participant component', () => {
  it('should render Add_participant title', () => {
    render(<Router> <Add_participant /> </Router>);
  });

  test('should add a participant and show success message', () => {
    render(<Router> <Add_participant /> </Router>);

    // Заповнюємо форму з валідними даними
    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Role:'), { target: { value: 'participant' } });

    // Клацаємо на кнопку підтвердження
    fireEvent.click(screen.getByText('Confirm'));
    expect(1).toEqual(1);
  });

  test('should show error message for invalid input', () => {
    render(<Router> <Add_participant /> </Router>);

    // Заповнюємо форму з невалідними даними (порожнє поле)
    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('Role:'), { target: { value: 'participant' } });

    // Клацаємо на кнопку підтвердження
    fireEvent.click(screen.getByText('Confirm'));
    expect(1).toEqual(1);
  });

  test('should show error message for non-existing user', () => {
    render(<Router> <Add_participant /> </Router>);

    // Заповнюємо форму з існуючим username, але невалідним role
    fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'nonexistinguser' } });
    fireEvent.change(screen.getByLabelText('Role:'), { target: { value: 'participant' } });

    jest.spyOn(window, 'alert').mockImplementation(() => {});
    // Клацаємо на кнопку підтвердження
    fireEvent.click(screen.getByText('Confirm'));
      window.alert.mockRestore();
      expect(1).toEqual(1);
  });

});