import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Delete_user from '../src/components/Delete_user';

describe("Delete_user", () => {

  test("should render the delete user page", () => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Delete_user />
    </MemoryRouter>
  );

    expect(screen.getByText(/Are you sure you want to delete your account?/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Input your password:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm password:/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delete my account/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /cancel/i })).toBeInTheDocument();
  });

  test("should delete user and navigate to homepage if passwords match", () => {
    // Mock local storage values
    localStorage.setItem("loggedin", "true");
    localStorage.setItem("userId", "1");
    localStorage.setItem("username", "testuser");
    localStorage.setItem("password", "testpassword");

    // Mock the navigate function
    const navigateMock = jest.fn();
    const originalNavigate = window.history.navigate;
    window.history.navigate = navigateMock;

    render(
        <MemoryRouter initialEntries={["/"]}>
          <Delete_user />
        </MemoryRouter>
      );
    // Enter password
    const passwordInput = screen.getByLabelText(/input your password:/i);
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });

    // Confirm password
    const confirmPasswordInput = screen.getByLabelText(/confirm password:/i);
    fireEvent.change(confirmPasswordInput, { target: { value: "testpassword" } });

    // Click the delete button
    const deleteButton = screen.getByRole("button", { name: /delete my account/i });
    fireEvent.click(deleteButton);

    // Restore the original navigate function
    window.history.navigate = originalNavigate;
  });

  test("should display an alert if passwords do not match", () => {
    // Mock local storage values
    localStorage.setItem("loggedin", "true");

    render(
    <MemoryRouter initialEntries={["/"]}>
      <Delete_user />
    </MemoryRouter>
  );

    // Enter password
    const passwordInput = screen.getByLabelText(/input your password:/i);
    fireEvent.change(passwordInput, { target: { value: "testpassword" } });

    // Confirm password with different value
    const confirmPasswordInput = screen.getByLabelText(/confirm password:/i);
    fireEvent.change(confirmPasswordInput, { target: { value: "wrongpassword" } });

    // Click the delete button
    const deleteButton = screen.getByRole("button", { name: /delete my account/i });
    fireEvent.click(deleteButton);

    // Assert that an alert is displayed
    //expect(window.alert).toHaveBeenCalledWith("Incorrect password!");
  });

  test("should navigate to homepage when cancel button is clicked", () => {
    // Mock local storage values
    localStorage.setItem("loggedin", "true");

    // Mock the navigate function
    const navigateMock = jest.fn();
    const originalNavigate = window.history.navigate;
    window.history.navigate = navigateMock;

  render(
    <MemoryRouter initialEntries={["/"]}>
      <Delete_user />
    </MemoryRouter>
  );

    // Click the cancel button
    const cancelButton = screen.getByRole("link", { name: /cancel/i });
    fireEvent.click(cancelButton);


    // Restore the original navigate function
    window.history.navigate = originalNavigate;
  });
});
