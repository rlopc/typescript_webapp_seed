import { useQuery } from '@tanstack/react-query';
import { healthQueryOptions } from './health-api';

export function HealthStatus() {
  const health = useQuery(healthQueryOptions);

  if (health.isPending) {
    return <p role="status">Checking the API…</p>;
  }

  if (health.isError) {
    return <p role="alert">The API is unreachable: {health.error.message}</p>;
  }

  return (
    <p role="status">
      API status: <strong>{health.data.status}</strong>
    </p>
  );
}
