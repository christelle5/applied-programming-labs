import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Calendar from '../src/components/Calendar';
import fetchMock from 'jest-fetch-mock';
import { createMemoryHistory } from 'history';

describe('Calendar component', () => {
  test('should render calendar title', () => {
    render(
      <Router>
        <Calendar />
      </Router>
    );
  });

  test('should render event details', () => {
    const events = [
      {
        id: 1,
        title: 'Event 1',
        startDate: '2023-04-28T10:00',
        endDate: '2023-04-28T12:00',
        role: 'Participant',
        aboutEvent: 'About event 1',
      },
      {
        id: 2,
        title: 'Event 2',
        startDate: '2023-04-29T14:00',
        endDate: '2023-04-29T16:00',
        role: 'Creator',
        aboutEvent: 'About event 2',
      },
    ];

    render(
      <Router>
        <Calendar />
      </Router>
    );

    // Set events in localStorage
    localStorage.setItem('loggedin', 'true');
    localStorage.setItem('userId', '1');
    localStorage.setItem('user', JSON.stringify({ username: 'test', password: 'test' }));
    localStorage.setItem('eventId', '1');

    // Set events in component state
    const fetchDataSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(events),
    });

    fireEvent.click(screen.getByText('More details'));

    expect(fetchDataSpy).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Event 1')).toBeInTheDocument();
    expect(screen.getByText('Start date: 2023-04-28T10:00')).toBeInTheDocument();
    expect(screen.getByText('End date: 2023-04-28T12:00')).toBeInTheDocument();
    expect(screen.getByText('Status: You are just a participant of \'Event 1\'.')).toBeInTheDocument();
    expect(screen.getByText('About:')).toBeInTheDocument();
    expect(screen.getByText('About event 1')).toBeInTheDocument();

    fetchDataSpy.mockRestore();
  });

  test('should redirect to event page for creator', () => {
    const events = [
      {
        id: 1,
        title: 'Event 1',
        startDate: '2023-04-28T10:00',
        endDate: '2023-04-28T12:00',
        role: 'Creator',
        aboutEvent: 'About event 1',
      },
    ];

    const history = createMemoryHistory();
    localStorage.setItem('loggedin', 'true');
    localStorage.setItem('userId', '1');
    localStorage.setItem('user', JSON.stringify({ username: 'test', password: 'test' }));
    localStorage.setItem('eventId', '1');

    render(
      <Router history={history}>
        <Calendar />
      </Router>
    );

    const fetchDataSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(events),
    });

    fireEvent.click(screen.getByText('More details'));

    expect(fetchDataSpy).toHaveBeenCalledTimes(1);
    expect(history.location.pathname).toBe('/event-creator');

    fetchDataSpy.mockRestore();
  });

  test('should redirect to event page for participant', () => {
    const events = [
      {
        id: 1,
        title: 'Event 1',
        startDate: '2023-04-28T10:00',
        endDate: '2023-04-28T12:00',
        role: 'Participant',
        aboutEvent: 'About event 1',
      },
    ];

    const history = createMemoryHistory();
    localStorage.setItem('loggedin', 'true');
    localStorage.setItem('userId', '1');
    localStorage.setItem('user', JSON.stringify({ username: 'test', password: 'test' }));
    localStorage.setItem('eventId', '1');

    render(
      <Router history={history}>
        <Calendar />
      </Router>
    );

    const fetchDataSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(events),
    });

    fireEvent.click(screen.queryByTestId('more-details-button'));

    expect(fetchDataSpy).toHaveBeenCalledTimes(1);
    expect(history.location.pathname).toBe('/event-participant');

    fetchDataSpy.mockRestore();
  });

  test('should redirect to login page if not logged in', () => {
    const history = createMemoryHistory();
    localStorage.setItem('loggedin', 'false');

    render(
      <Router history={history}>
        <Calendar />
      </Router>
    );

    expect(history.location.pathname).toBe('/');
  });
});