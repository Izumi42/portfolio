import styles from './FluidBackground.module.css';

export default function FluidBackground() {
  return (
    <div className={styles.fluidContainer}>
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>
      <div className={styles.blob3}></div>
      <div className={styles.noiseOverlay}></div>
    </div>
  );
}
