import { http, HttpResponse } from 'msw';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { server } from '../test/server';
import { ApiError, getJson } from './api-client';

const schema = z.object({ id: z.number() });

describe('getJson', () => {
  it('returns the validated response body', async () => {
    server.use(http.get('/api/items/1', () => HttpResponse.json({ id: 1 })));

    await expect(getJson('/items/1', schema)).resolves.toEqual({ id: 1 });
  });

  it('throws an ApiError with the status on a non-2xx response', async () => {
    server.use(
      http.get(
        '/api/items/1',
        () => new HttpResponse(undefined, { status: 503 }),
      ),
    );

    const request = getJson('/items/1', schema);

    await expect(request).rejects.toBeInstanceOf(ApiError);
    await expect(request).rejects.toMatchObject({ status: 503 });
  });

  it('rejects a body that does not match the schema', async () => {
    server.use(
      http.get('/api/items/1', () => HttpResponse.json({ id: 'one' })),
    );

    await expect(getJson('/items/1', schema)).rejects.toBeInstanceOf(
      z.ZodError,
    );
  });
});
