import { z } from 'zod';

// Every `VITE_*` variable is inlined into the bundle at build time and can be
// read by anyone who loads the app: never put secrets here.
const envSchema = z.object({
  VITE_API_BASE_URL: z.string().min(1).default('/api'),
});

// A misconfigured build fails here with a clear validation error, instead of
// sending requests to a malformed URL.
export const env = envSchema.parse(import.meta.env);
