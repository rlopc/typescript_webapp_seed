import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';
import { createMemoryRouter, type RouteObject } from 'react-router';
import { RouterProvider } from 'react-router/dom';
import { routes as appRoutes } from '../app/routes';

/**
 * Renders the app at `path` with the same providers as `main.tsx`, but with an
 * in-memory router and a fresh query cache, so tests never share state.
 */
export function renderRoute(path: string, routes: RouteObject[] = appRoutes) {
  const queryClient = new QueryClient({
    // Fail on the first error: retries only slow down error-state tests.
    defaultOptions: { queries: { retry: false } },
  });
  const router = createMemoryRouter(routes, { initialEntries: [path] });

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}
