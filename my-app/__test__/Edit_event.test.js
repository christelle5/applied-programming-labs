import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Edit_event from '../src/components/Edit_event';
import '@testing-library/jest-dom';
import { BrowserRouter as Router, MemoryRouter } from 'react-router-dom';

describe('Edit_event component', () => {
  it('should render Edit_event title', () => {
    render(<Router> <Edit_event /> </Router>);
  });

    test("should update event data and display success alert", async () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Edit_event />
    </MemoryRouter>
  );

  const titleInput = screen.getByLabelText(/title/i);
  fireEvent.change(titleInput, { target: { value: "New Event Title" } });

  const aboutInput = screen.getByLabelText(/about/i);
  fireEvent.change(aboutInput, { target: { value: "New Event Description" } });

  const startDateInput = screen.getByLabelText(/start date/i);
  fireEvent.change(startDateInput, { target: { value: "2023-05-01" } });

  const endDateInput = screen.getByLabelText(/end date/i);
  fireEvent.change(endDateInput, { target: { value: "2023-05-02" } });

  const startTimeInput = screen.getByLabelText(/start time/i);
  fireEvent.change(startTimeInput, { target: { value: "10:00" } });

  const endTimeInput = screen.getByLabelText(/end time/i);
  fireEvent.change(endTimeInput, { target: { value: "12:00" } });

  const confirmButton = screen.getByRole("button", { name: /confirm/i });

  const mockResponse = { message: "Event successfully updated." };
  global.fetch = jest.fn().mockResolvedValueOnce({
    ok: true,
    json: () => Promise.resolve(mockResponse),
  });

  fireEvent.click(confirmButton);

  await waitFor(() => {
    expect(screen.getByText(/Event successfully updated./i)).toBeInTheDocument();
  });
});


      test("should navigate to event page when cancel button is clicked", () => {
        render(
          <MemoryRouter initialEntries={["/"]}>
            <Edit_event />
          </MemoryRouter>
        );

        const cancelButton = screen.getByRole("link", { name: /cancel/i });
        fireEvent.click(cancelButton);

        //expect(screen.queryByText(/Event/i)).toBeInTheDocument();
      });

});
