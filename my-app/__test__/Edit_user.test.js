import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Edit_user from '../src/components/Edit_user';
import '@testing-library/jest-dom';
import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom';

describe('Edit_event component', () => {
  it('should render Edit_user title', () => {
    render(<Router> <Edit_user /> </Router>);
  });

  it('should update username input', () => {
    render(<Router><Edit_user /></Router>);
    const usernameInput = screen.getByTestId('username1');
    fireEvent.change(usernameInput, { target: { value: 'newusername' } });
    expect(usernameInput.value).toBe('newusername');
  });


});