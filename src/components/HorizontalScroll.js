'use client';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/dist/ScrollTrigger';
import TopographicBackground from './TopographicBackground';
import styles from './HorizontalScroll.module.css';

export default function HorizontalScroll({ items }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const topoRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    let ctx = gsap.context(() => {
      const track = trackRef.current;
      const section = sectionRef.current;
      const amountToScroll = track.scrollWidth - window.innerWidth;

      // Create a unified timeline for the pinned section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${amountToScroll}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (topoRef.current) {
              topoRef.current.setScrollProgress(self.progress);
            }
          }
        }
      });

      // 1. Move the track horizontally
      tl.to(track, {
        x: -amountToScroll,
        ease: "none",
        duration: 1
      }, 0);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.horizontalSection}>
      <TopographicBackground ref={topoRef} />
      <div ref={trackRef} className={styles.track}>
        {items.map((item, i) => (
          <div key={i} className={styles.itemWrapper}>
            <div className={styles.itemInner}>
              <div className="text-eyebrow">
                <p style={{ color: 'var(--color-lime)', marginBottom: '0.5rem' }}>FEATURED PROJECT</p>
                <h3 className="text-body" style={{ color: 'inherit', fontWeight: 600 }}>{item.title}</h3>
              </div>
              <div className={styles.imageContainer}>
                {/* Placeholder for images */}
                <div className={styles.placeholderImage}>
                  {item.id}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
