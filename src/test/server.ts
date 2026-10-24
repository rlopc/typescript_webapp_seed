import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

// The happy path for every endpoint the app calls. Tests that need another
// response override it with `server.use(...)`; `setup.ts` resets it after each
// test.
export const server = setupServer(
  http.get('/api/health', () => HttpResponse.json({ status: 'ok' })),
);
