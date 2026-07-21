'use client';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import styles from './Preloader.module.css';

export default function Preloader({ onComplete }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 20);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const tl = gsap.timeline({
        onComplete: onComplete
      });

      tl.to(textRef.current, {
        y: -50,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.inOut'
      })
      .to(containerRef.current, {
        yPercent: -100,
        duration: 0.8,
        ease: 'power4.inOut'
      }, "+=0.1");
    }
  }, [progress, onComplete]);

  return (
    <div ref={containerRef} className={styles.preloader}>
      <div ref={textRef} className={styles.loadingText}>
        {progress}%
      </div>
      <div className={styles.pattern}></div>
    </div>
  );
}
