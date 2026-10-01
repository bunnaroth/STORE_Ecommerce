import { useEffect, useRef, useState } from 'react';

const banners = [
  {
    src: '/banners/banner-one.webp',
    alt: 'Fashion promotion banner one',
  },
  {
    src: '/banners/banner-two.webp',
    alt: 'Fashion promotion banner two',
  },
  {
    src: '/banners/banner-three.webp',
    alt: 'Fashion promotion banner three',
  },
  {
    src: '/banners/banner-four.webp',
    alt: 'Fashion promotion banner four',
  },
];

interface PointerStart {
  id: number;
  x: number;
}

export const PromotionalCarousel: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const pointerStart = useRef<PointerStart | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener('change', updatePreference);

    return () => mediaQuery.removeEventListener('change', updatePreference);
  }, []);

  useEffect(() => {
    if (isHovered || isDragging || prefersReducedMotion) return;

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % banners.length);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isDragging, isHovered, prefersReducedMotion, timerResetKey]);

  const goTo = (index: number) => {
    setActiveIndex((index + banners.length) % banners.length);
    setDragOffset(0);
    setTimerResetKey((current) => current + 1);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest('button')) return;

    pointerStart.current = { id: event.pointerId, x: event.clientX };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStart.current?.id !== event.pointerId) return;
    setDragOffset(event.clientX - pointerStart.current.x);
  };

  const finishPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStart.current?.id !== event.pointerId) return;

    const distance = event.clientX - pointerStart.current.x;
    if (distance < -48) goTo(activeIndex + 1);
    else if (distance > 48) goTo(activeIndex - 1);
    else setDragOffset(0);

    pointerStart.current = null;
    setIsDragging(false);
  };

  const cancelPointer = () => {
    pointerStart.current = null;
    setDragOffset(0);
    setIsDragging(false);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-17 sm:px-6 lg:px-8" aria-label="Promotional banners">
      <div
        className="relative touch-pan-y select-none overflow-hidden rounded-2xl bg-gray-100"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointer}
        onPointerCancel={cancelPointer}
        onLostPointerCapture={cancelPointer}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="flex"
          style={{
            transform: `translate3d(calc(-${activeIndex * 100}% + ${dragOffset}px), 0, 0)`,
            transition: isDragging || prefersReducedMotion ? 'none' : 'transform 450ms ease-out',
          }}
        >
          {banners.map((banner) => (
            <div key={banner.src} className="w-full shrink-0">
              <img
                src={banner.src}
                alt={banner.alt}
                draggable={false}
                className="block h-auto w-full select-none"
              />
            </div>
          ))}
        </div>

      </div>

      <div className="mt-4 flex justify-center gap-2" role="group" aria-label="Choose promotional banner">
        {banners.map((banner, index) => (
          <button
            key={banner.src}
            type="button"
            aria-label={`Show banner ${index + 1} of ${banners.length}`}
            aria-pressed={activeIndex === index}
            onClick={() => goTo(index)}
            style={{ height: 10, width: activeIndex === index ? 32 : 10 }}
            className={`rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 ${
              activeIndex === index ? 'bg-indigo-600' : 'bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </section>
  );
};