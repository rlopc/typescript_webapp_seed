import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { routes } from './app/routes';
import './styles.css';

const queryClient = new QueryClient();
const router = createBrowserRouter(routes);

const container = document.querySelector('#root');
if (!container) {
  throw new Error('Missing the #root element in index.html');
}

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
