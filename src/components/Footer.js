import styles from './Footer.module.css';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.socials}>
            <Link href="#" className={styles.link}>Instagram</Link>
            <Link href="#" className={styles.link}>LinkedIn</Link>
            <Link href="#" className={styles.link}>Twitter</Link>
          </div>
          <div className={styles.contact}>
            <p>business@example.com</p>
          </div>
        </div>
        <div className={styles.hugeText}>
          <h2>LET&apos;S TALK</h2>
        </div>
        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
