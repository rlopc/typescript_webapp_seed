import type { z } from 'zod';
import { env } from '../config/env';

export class ApiError extends Error {
  override readonly name = 'ApiError';
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * Fetches a JSON resource from the backend and validates it against `schema`.
 * The response comes from outside the type system, so it is checked at this
 * boundary rather than trusted with a type assertion.
 */
export async function getJson<T>(
  path: string,
  schema: z.ZodType<T>,
  init: RequestInit = {},
): Promise<T> {
  // Resolved against the page origin, so a relative base URL such as `/api`
  // works the same in the browser and in jsdom.
  const url = new URL(
    `${env.VITE_API_BASE_URL}${path}`,
    globalThis.location.origin,
  );
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
    ...init,
  });

  if (!response.ok) {
    throw new ApiError(
      response.status,
      `GET ${path} failed with status ${String(response.status)}`,
    );
  }

  return schema.parse(await response.json());
}
