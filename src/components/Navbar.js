import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navInner}>
        <Link href="/" className={styles.brand}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            {/* AP Shared Stem Monogram */}
            <path d="M 12 30 L 20 10 L 20 30 M 16 20 L 20 20 M 20 10 C 30 10 30 20 20 20" 
                  stroke="var(--color-lime)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
                  filter="url(#neonGlow)"/>
          </svg>
        </Link>
        <div className={styles.menuToggle}>
          <span>MENU</span>
        </div>
      </div>
    </nav>
  );
}
