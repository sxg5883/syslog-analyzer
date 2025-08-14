// Import utilities from React Testing Library for rendering components and querying the DOM
import { render, screen } from '@testing-library/react';

// Import the component we want to test
import App from './App';

// Define a test case named "renders learn react link"
test('renders learn react link', () => {
  // Render the <App /> component into a virtual DOM provided by the testing library
  render(<App />);

  // Search for an element whose text matches "learn react" (case-insensitive)
  const linkElement = screen.getByText(/learn react/i);

  // Assert that the element is present in the document
  expect(linkElement).toBeInTheDocument();
});

