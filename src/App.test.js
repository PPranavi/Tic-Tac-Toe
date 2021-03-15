/* eslint-disable */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('Leaderboard appearance', () => {
  const result = render(<App />);
  const leadeboardButtonElement = screen.getByText('Leaderboard');
  
  expect(leadeboardButtonElement).toBeInTheDocument();
  
  fireEvent.click(leadeboardButtonElement);
  const message = screen.getByText('LeaderBoard');
  expect(message).toBeInTheDocument();
  
  fireEvent.click(leadeboardButtonElement);
  expect(message).not.toBeInTheDocument();
});

test('Board appearance', () => {
  const result = render(<App />);
  const loginButtonElement = screen.getByText('Login');
  
  expect(loginButtonElement).toBeInTheDocument();
  
  fireEvent.click(loginButtonElement);
  const message = screen.getByText('Current user:');
  expect(message).toBeInTheDocument();
});

test('Leaderboard is available even after logging in', () => {
  const result = render(<App />);
  const leadeboardButtonElement = screen.getByText('Leaderboard');
  const loginButtonElement = screen.getByText('Login');
  
  expect(loginButtonElement).toBeInTheDocument();
  expect(leadeboardButtonElement).toBeInTheDocument();
  
  fireEvent.click(loginButtonElement);
  expect(leadeboardButtonElement).toBeInTheDocument();
});
