import type { RouteObject } from 'react-router';
import { ErrorPage } from '../routes/error-page';
import { HomePage } from '../routes/home-page';
import { NotFoundPage } from '../routes/not-found-page';
import { RootLayout } from './root-layout';

export const routes: RouteObject[] = [
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, Component: HomePage },
      {
        path: 'status',
        // Code-split: this page's JavaScript is only downloaded when visited.
        lazy: async () => {
          const { StatusPage } = await import('../routes/status-page');
          return { Component: StatusPage };
        },
      },
      { path: '*', Component: NotFoundPage },
    ],
  },
];
