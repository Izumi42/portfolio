'use client';
import { useState } from 'react';
import Preloader from '@/components/Preloader';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import dynamic from 'next/dynamic';

const Marquee = dynamic(() => import('@/components/Marquee'), { ssr: true });
const HorizontalScroll = dynamic(() => import('@/components/HorizontalScroll'), { ssr: false });
const InteractiveGrid = dynamic(() => import('@/components/InteractiveGrid'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: true });
const FluidBackground = dynamic(() => import('@/components/FluidBackground'), { ssr: true });

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

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);

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
