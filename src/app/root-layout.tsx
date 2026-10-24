import { NavLink, Outlet } from 'react-router';
import styles from './root-layout.module.css';

export function RootLayout() {
  return (
    <>
      <header className={styles.header}>
        <nav aria-label="Main" className={styles.nav}>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/status">API status</NavLink>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </>
  );
}
