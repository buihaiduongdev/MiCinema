import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router-dom';
import { QueryProvider } from './app/providers/QueryProvider.tsx';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryProvider>
        <MantineProvider defaultColorScheme="light">
          <Notifications position="top-right" zIndex={1000} />
          <App />
        </MantineProvider>
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>,
);
