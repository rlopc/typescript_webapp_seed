import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod';
import { getJson } from '../../lib/api-client';

const healthSchema = z.object({
  status: z.string(),
});

// Query key and fetcher defined once, so every component (and a route loader,
// if one is added) shares the same cache entry.
export const healthQueryOptions = queryOptions({
  queryKey: ['health'],
  queryFn: ({ signal }) => getJson('/health', healthSchema, { signal }),
});
