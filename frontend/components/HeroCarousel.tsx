'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const SLIDES = [
  {
    bg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAL692MgkJEPB_UPHgZRgOOLlPz9gOSk-mguRUyKC9oeNAmfhjr85YyY0hZ43FvMaKb7xGhb9SVpQKPSpYyaZj1QPge6RkiOsYP4GuCu6peXt8cbUf5h5VddgsjWmidjn4Sx_BSi8r1-PB5qdK-FJOPAzSa-MUw6OGnvbMmfr9PPRsQkG3WyiHUC5ahyCPXeh-M47osT5K5i-2yp7K3v3mDGnApdqLhUunW8ccJAGDVJDclnQak4NjZzaUSH0yhwZ1pJ0Rc-5yWwaw',
    overlay: 'bg-primary/20',
    badge: 'Corporate Excellence',
    title: 'Your Complete\nProfessional Workspace Hub.',
    body: 'From premium tactile stationery to high-performance ICT hardware. We curate the essential tools that power modern business productivity.',
    cta1: { label: 'Shop Stationery', icon: 'edit', href: '/collections/paper' },
    cta2: { label: 'Browse Hardware', icon: 'computer', href: '/collections/ict-accessories' },
  },
  {
    bg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD11Fbr40O5T_MQV37FMZ665Mj5UtsjR9IL9VVmrBHNNdXTnueBKjSaipZCvUc49Bw7FhX8V6CzAHxYRGrtUKBKnyMg6gxxx5rAHKeglg1sL2rzFuZYoTYoRxzL6TAd-Ohwc9qzVb36cg8GQ2RUXfHT4aJPVoMRKAho7pHBfYh9kRc2edfVg6O5G7PFHIiY4P0vibT5uAzn9dsDmY-GUez_VWgYSkm10tq35zMTOFFPJ9vizBsn2vIAdVFH5lb09C3UUrW318WNgls',
    overlay: 'bg-secondary/20',
    badge: 'Digital Performance',
    title: 'Next-Gen Computing\nEssentials',
    body: 'Upgrade your digital workflow with professional peripherals, storage solutions, and ergonomic hardware for high-end workstations.',
    cta1: { label: 'View Hardware', icon: 'mouse', href: '/collections/ict-accessories' },
    cta2: { label: 'Tech Deals', icon: 'bolt', href: '/collections/ict-accessories' },
  },
  {
    bg: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD11Fbr40O5T_MQV37FMZ665Mj5UtsjR9IL9VVmrBHNNdXTnueBKjSaipZCvUc49Bw7FhX8V6CzAHxYRGrtUKBKnyMg6gxxx5rAHKeglg1sL2rzFuZYoTYoRxzL6TAd-Ohwc9qzVb36cg8GQ2RUXfHT4aJPVoMRKAho7pHBfYh9kRc2edfVg6O5G7PFHIiY4P0vibT5uAzn9dsDmY-GUez_VWgYSkm10tq35zMTOFFPJ9vizBsn2vIAdVFH5lb09C3UUrW318WNgls',
    overlay: 'bg-primary-container/30',
    badge: 'Business Logistics',
    title: 'Enterprise Procurement\nMade Simple',
    body: 'Customized bulk ordering systems for corporate fleets. Streamline your office supplies procurement with dedicated account management.',
    cta1: { label: 'Get a Quote', icon: 'request_quote', href: '/contact' },
    cta2: { label: 'Business Portal', icon: 'corporate_fare', href: '/collections' },
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const scrollTo = useCallback((index: number) => {
    if (!containerRef.current) return;
    const width = containerRef.current.offsetWidth;
    containerRef.current.scrollTo({ left: width * index, behavior: 'smooth' });
    setCurrent(index);
  }, []);

  const startAutoPlay = useCallback(() => {
    autoPlayRef.current = setInterval(() => {
      setCurrent((prev) => {
        const next = (prev + 1) % SLIDES.length;
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          containerRef.current.scrollTo({ left: width * next, behavior: 'smooth' });
        }
        return next;
      });
    }, 5000);
  }, []);

  useEffect(() => {
    startAutoPlay();
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [startAutoPlay]);

  const pause = () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  const resume = () => startAutoPlay();

  // Sync dot on manual scroll
  const onScroll = () => {
    if (!containerRef.current) return;
    const index = Math.round(containerRef.current.scrollLeft / containerRef.current.offsetWidth);
    setCurrent(index);
  };

  return (
    <section className="relative w-full h-[700px] mt-4 px-6 overflow-hidden">
      <div
        ref={containerRef}
        onScroll={onScroll}
        onMouseEnter={pause}
        onMouseLeave={resume}
        className="carousel-container flex w-full h-full overflow-x-auto"
      >
        {SLIDES.map((slide, i) => (
          <div key={i} className="carousel-slide relative w-full h-full flex items-center justify-center flex-shrink-0">
            {/* Background */}
            <div className="absolute inset-4 rounded-xl overflow-hidden shadow-2xl z-0">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${slide.bg}')` }} />
              <div className={`absolute inset-0 ${slide.overlay} backdrop-brightness-75`} />
            </div>

            {/* Glass card */}
            <div className="relative z-10 glass-panel rounded-xl max-w-4xl w-full p-16 text-center flex flex-col items-center">
              <span className="text-xs font-bold uppercase tracking-widest text-primary-container mb-4">{slide.badge}</span>
              <h1 className="text-[48px] leading-[1.1] tracking-[-0.02em] font-bold text-primary mb-6 whitespace-pre-line">{slide.title}</h1>
              <p className="text-base text-on-surface-variant max-w-xl mx-auto mb-10 leading-relaxed">{slide.body}</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href={slide.cta1.href}
                  className="bg-primary text-white font-semibold px-10 py-4 rounded-full btn-primary hover:bg-primary-container transition-colors flex items-center gap-2 group"
                >
                  {slide.cta1.label}
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">{slide.cta1.icon}</span>
                </Link>
                <Link
                  href={slide.cta2.href}
                  className="bg-secondary text-white font-semibold px-10 py-4 rounded-full shadow-lg hover:bg-secondary-container transition-colors flex items-center gap-2 group"
                >
                  {slide.cta2.label}
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">{slide.cta2.icon}</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'dot-active' : 'w-2 bg-outline/30 hover:bg-primary/50'}`}
          />
        ))}
      </div>
    </section>
  );
}
