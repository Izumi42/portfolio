'use client';
import { useState } from 'react';
import Preloader from '@/components/Preloader';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Marquee from '@/components/Marquee';
import HorizontalScroll from '@/components/HorizontalScroll';
import InteractiveGrid from '@/components/InteractiveGrid';
import Footer from '@/components/Footer';
import FluidBackground from '@/components/FluidBackground';

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  const horizontalItems = [
    { id: '01', title: 'SaaS Platform' },
    { id: '02', title: 'Fintech Dashboard' },
    { id: '03', title: 'E-commerce API' },
    { id: '04', title: 'Real-time Chat App' },
  ];

  const gridItems = [
    { name: 'Frontend', year: 'React, Next.js, Vue' },
    { name: 'Backend', year: 'Node.js, Python, Go' },
    { name: 'Database', year: 'PostgreSQL, MongoDB' },
    { name: 'DevOps', year: 'Docker, AWS, CI/CD' },
  ];

  return (
    <main>
      <FluidBackground />
      {!loadingComplete && <Preloader onComplete={() => setLoadingComplete(true)} />}
      <Navbar />
      <Hero startAnimation={loadingComplete} />
      <Marquee text="Available for freelance" speed={15} />
      <HorizontalScroll items={horizontalItems} />
      <Marquee text="Full Stack Developer" speed={20} />
      <InteractiveGrid items={gridItems} />
      <Footer />
    </main>
  );
}
