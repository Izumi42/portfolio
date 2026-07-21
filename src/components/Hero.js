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
      // Stagger reveal for the eyebrow, title lines, and subtitle
      gsap.from('.reveal', {
        yPercent: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power4.out',
        delay: 0.2
      });
      
      // Scale down overlay slightly to give depth
      gsap.from('.overlay-anim', {
        scale: 1.1,
        opacity: 0,
        duration: 2,
        ease: 'power3.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, [startAnimation]);

  return (
    <section ref={containerRef} className={styles.hero}>
      <div className={styles.heroContent}>
        <div className={styles.overflowHidden}>
          <div className="reveal eyebrow">
            <p className="text-eyebrow">Abhishek Patel &mdash; Portfolio</p>
          </div>
        </div>
        
        <h1 className={styles.title}>
          <div className={styles.overflowHidden}>
            <span className="reveal" style={{ display: 'inline-block' }}>Full Stack</span>
          </div>
          <div className={styles.overflowHidden}>
            <span className="reveal" style={{ display: 'inline-block' }}>Developer.</span>
          </div>
        </h1>
        
        <div className={styles.overflowHidden}>
          <p className={`reveal ${styles.subtitle}`}>
            Building robust web applications from database to deployment, 
            focusing on scalable architectures, seamless APIs, and premium user experiences.
          </p>
        </div>
      </div>
      
      <div className={`${styles.heroVideo} overlay-anim`}>
        {/* Pattern overlay like Lando site */}
        <div className={styles.heroPattern}></div>
        <div className={styles.overlay}></div>
      </div>
    </section>
  );
}
