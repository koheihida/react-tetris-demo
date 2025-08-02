import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test('renders grid dimensions', () => {
  render(<App />);
  const gridDimensionsElement = screen.getByText(/Grid dimensions: 10 x 20/);
  expect(gridDimensionsElement).toBeInTheDocument();
});
