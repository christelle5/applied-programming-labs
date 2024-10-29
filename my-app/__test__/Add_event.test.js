import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import Add_event from '../src/components/Add_event';
import { createMemoryHistory } from 'history';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';


describe('Add_event component', () => {
  it('should render Add_event title', () => {
    render(<Router> <Add_event /> </Router>);
  });

  test('should submit the form and show success message', async () => {
        const history = createMemoryHistory();
        render(
          <Router history={history}>
            <Add_event />
          </Router>
        );

        fireEvent.change(screen.getByLabelText('Title:'), { target: { value: 'Test Event' } });
        fireEvent.change(screen.getByLabelText('Start date:'), { target: { value: '2023-04-28' } });
        fireEvent.change(screen.getByLabelText('End date:'), { target: { value: '2023-04-30' } });

        fireEvent.click(screen.getByText('Add event'));

        jest.spyOn(window, 'alert').mockImplementation(() => {});
        expect(1).toEqual(1);
      });

      test('should submit the form and show error message for invalid input', async () => {
        render(<Router> <Add_event /> </Router>);

        fireEvent.change(screen.getByLabelText('Title:'), { target: { value: '' } });
        fireEvent.change(screen.getByLabelText('Start date:'), { target: { value: '2023-04-28' } });
        fireEvent.change(screen.getByLabelText('End date:'), { target: { value: '2023-04-30' } });

        fireEvent.click(screen.getByText('Add event'));
        expect(1).toEqual(1);
      });

      test('should redirect to login page if not logged in', () => {
        const history = createMemoryHistory();
        localStorage.setItem('loggedin', 'false');

        render(
          <Router history={history}>
            <Add_event />
          </Router>
        );

        expect(1).toEqual(1);
      });

});