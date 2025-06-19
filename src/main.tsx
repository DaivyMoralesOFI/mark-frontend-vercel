// main.tsx
//
// This file is the main entry point for the React application.
// It sets up the root React DOM, applies global providers (Redux store), and renders the App component.
// StrictMode is enabled for highlighting potential problems in development.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from 'react-redux'
import { store } from './core/store/store'

/**
 * Main entry point for the React application.
 *
 * - Wraps the app in React.StrictMode for development checks
 * - Provides the Redux store to the entire app
 * - Renders the root App component into the #root element
 */
createRoot(document.getElementById('root')!).render(
  // Enable React's StrictMode for highlighting potential problems
  <StrictMode>
    {/* Provide the Redux store to the app */}
    <Provider store={store}>
      {/* Render the main App component */}
      <App />
    </Provider>
  </StrictMode>,
)
