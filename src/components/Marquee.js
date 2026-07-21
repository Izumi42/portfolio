import styles from './Marquee.module.css';

export default function Marquee({ text = "Full Stack Developer", speed = 20 }) {
  return (
    <div className={styles.marqueeContainer}>
      <div 
        className={styles.marqueeContent} 
        style={{ animationDuration: `${speed}s` }}
      >
        <span>{text}</span>
        <span className={styles.separator}>✦</span>
        <span>{text}</span>
        <span className={styles.separator}>✦</span>
        <span>{text}</span>
        <span className={styles.separator}>✦</span>
        <span>{text}</span>
        <span className={styles.separator}>✦</span>
      </div>
      {/* Duplicate for seamless infinite loop */}
      <div 
        className={styles.marqueeContent} 
        style={{ animationDuration: `${speed}s` }}
      >
        <span>{text}</span>
        <span className={styles.separator}>✦</span>
        <span>{text}</span>
        <span className={styles.separator}>✦</span>
        <span>{text}</span>
        <span className={styles.separator}>✦</span>
        <span>{text}</span>
        <span className={styles.separator}>✦</span>
      </div>
    </div>
  );
}
