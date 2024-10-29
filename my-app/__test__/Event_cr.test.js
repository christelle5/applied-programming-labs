import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Event_cr from '../src/components/Event_cr';
import '@testing-library/jest-dom';
import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom';

describe('Event_cr component', () => {
  it('should render Event_cr title', () => {
    render(<Router> <Event_cr /> </Router>);
  });

    test("should update event data and display success alert", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Edit_event />
    </MemoryRouter>
    );
  });
});
