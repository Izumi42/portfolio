'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import styles from './Hero.module.css';

export default function Hero({ startAnimation }) {
  const containerRef = useRef(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!startAnimation) {
        gsap.set('.reveal', { yPercent: 100, opacity: 0 });
        gsap.set('.overlay-anim', { scale: 1.1, opacity: 0 });
        return;
      }
      
      // Use fromTo to ensure deterministic values and fix mobile Safari rendering bugs
      gsap.fromTo('.reveal', 
        { yPercent: 100, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power4.out',
          delay: 0.2
        }
      );
      
      gsap.fromTo('.overlay-anim', 
        { scale: 1.1, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 2,
          ease: 'power3.out'
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [startAnimation]);

  return (
    <section ref={containerRef} className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.overflowHidden}>
          <div className="reveal eyebrow" style={{ opacity: 0, transform: 'translateY(100%)' }}>
            <p className="text-eyebrow">Abhishek Patel &mdash; Portfolio</p>
          </div>
        </div>
        
        <h1 className={styles.title}>
          <div className={styles.overflowHidden}>
            <span className="reveal" style={{ display: 'inline-block', opacity: 0, transform: 'translateY(100%)' }}>Full Stack</span>
          </div>
          <div className={styles.overflowHidden}>
            <span className="reveal" style={{ display: 'inline-block', opacity: 0, transform: 'translateY(100%)' }}>Developer.</span>
          </div>
        </h1>
        
        <div className={styles.overflowHidden}>
          <p className={`reveal ${styles.subtitle}`} style={{ opacity: 0, transform: 'translateY(100%)' }}>
            Building robust web applications from database to deployment, 
            focusing on scalable architectures, seamless APIs, and premium user experiences.
          </p>
        </div>
      </div>
      
      <div className={`${styles.heroVideo} overlay-anim`} style={{ opacity: 0, transform: 'scale(1.1)' }}>
        {/* Pattern overlay like Lando site */}
        <div className={styles.heroPattern}></div>
        <div className={styles.overlay}></div>
      </div>
    </section>
  );
}
