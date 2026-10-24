import { screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { renderRoute } from '../../test/render-route';
import { server } from '../../test/server';

describe('HealthStatus', () => {
  it('shows the status reported by the API', async () => {
    renderRoute('/status');

    expect(await screen.findByText('ok')).toBeInTheDocument();
  });

  it('shows an alert when the API fails', async () => {
    server.use(
      http.get(
        '/api/health',
        () => new HttpResponse(undefined, { status: 500 }),
      ),
    );
    renderRoute('/status');

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'The API is unreachable',
    );
  });
});
