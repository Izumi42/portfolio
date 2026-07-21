'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import styles from './InteractiveGrid.module.css';

export default function InteractiveGrid({ items }) {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    let ctx = gsap.context(() => {
      // Animate the header
      gsap.from('.grid-header-anim', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        }
      });

      // Stagger fade-in for grid items
      gsap.from('.grid-item-anim', {
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.grid-container-anim',
          start: "top 75%",
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.gridSection}>
      <div className="container">
        <div className={`${styles.header} grid-header-anim`}>
          <h2 className="text-impact-sm">
            Skills &<br/>
            <span style={{ color: 'var(--color-lime-off)' }}>Expertise</span>
          </h2>
        </div>
        
        <div className={`${styles.grid} grid-container-anim`}>
          {items.map((item, index) => (
            <div key={index} className={`${styles.gridItem} grid-item-anim`}>
              <div className={styles.imageWrapper}>
                <div className={styles.baseImage}>
                  <div className={styles.placeholderBase}>{index + 1}</div>
                </div>
                <div className={styles.hoverImage}>
                  <div className={styles.placeholderHover}>View</div>
                </div>
                
                <div className={styles.svgFrame}>
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <rect x="1" y="1" width="98" height="98" rx="2" fill="none" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </div>

                <div className={styles.textWrapper}>
                  <span className={styles.itemDate}>{item.year}</span>
                  <h3 className={styles.itemTitle}>{item.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
