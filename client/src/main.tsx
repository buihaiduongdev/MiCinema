import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
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
        <MantineProvider defaultColorScheme="dark">
          <Notifications position="top-right" zIndex={1000} />
          <App />
        </MantineProvider>
      </QueryProvider>
    </BrowserRouter>
  </StrictMode>,
);
