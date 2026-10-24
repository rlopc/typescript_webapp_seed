import { Link } from 'react-router';

export function NotFoundPage() {
  return (
    <>
      <title>Page not found · TypeScript web app seed</title>
      <h1>Page not found</h1>
      <p>
        <Link to="/">Back to the home page</Link>
      </p>
    </>
  );
}
