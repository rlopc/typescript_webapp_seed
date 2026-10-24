import { HealthStatus } from '../features/health/health-status';

export function StatusPage() {
  return (
    <>
      <title>API status · TypeScript web app seed</title>
      <h1>API status</h1>
      <HealthStatus />
    </>
  );
}
