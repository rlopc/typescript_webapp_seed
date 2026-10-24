import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ErrorPage } from '../routes/error-page';
import { renderRoute } from '../test/render-route';

function Broken(): never {
  throw new Error('Boom');
}

describe('routes', () => {
  it('renders the home page at the root', async () => {
    renderRoute('/');

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'TypeScript web app seed',
      }),
    ).toBeInTheDocument();
  });

  it('navigates to the status page from the main navigation', async () => {
    const user = userEvent.setup();
    renderRoute('/');

    await user.click(await screen.findByRole('link', { name: 'API status' }));

    expect(
      await screen.findByRole('heading', { level: 1, name: 'API status' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'API status' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  });

  it('renders the not-found page for an unknown path', async () => {
    renderRoute('/does-not-exist');

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Page not found' }),
    ).toBeInTheDocument();
  });

  it('renders the error page when a route throws', async () => {
    renderRoute('/', [
      { path: '/', Component: Broken, ErrorBoundary: ErrorPage },
    ]);

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Something went wrong',
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Boom')).toBeInTheDocument();
  });
});
