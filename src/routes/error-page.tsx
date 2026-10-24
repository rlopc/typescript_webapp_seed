import { isRouteErrorResponse, useRouteError } from 'react-router';

function describeError(error: unknown): string {
  if (isRouteErrorResponse(error)) {
    return `${String(error.status)} ${error.statusText}`;
  }
  return error instanceof Error ? error.message : String(error);
}

export function ErrorPage() {
  const error = useRouteError();

  return (
    <main>
      <title>Error · TypeScript web app seed</title>
      <h1>Something went wrong</h1>
      <p>An unexpected error occurred. Try reloading the page.</p>
      {/* Error details can leak internals: show them only in development. */}
      {import.meta.env.DEV && <pre>{describeError(error)}</pre>}
    </main>
  );
}
