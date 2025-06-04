import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const TraditionalMealSection: React.FC = () => {
  const { scrollY } = useScroll();
  const [fallbackY, setFallbackY] = useState(0);

  // Fallback scroll tracking for mobile
  useEffect(() => {
    const handleScroll = () => {
      setFallbackY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Motion value with fallback for mobile
  const yMobile = useTransform(scrollY, [0, 300], [0, -40]);

  // Debug log
  useEffect(() => {
    const unsubscribe = scrollY.onChange((v) => {
      console.log('Framer scrollY:', v);
    });
    return () => unsubscribe();
  }, [scrollY]);

  return (
    <section
      className="traditional-section relative h-[50vh] flex items-center justify-center bg-center bg-cover bg-scroll md:bg-fixed"
      style={{
        backgroundImage: "url('https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg')"
      }}
    >
      {/* Zigzag Borders */}
      <div className="zigzag-edge zigzag-top z-10" />
      <div className="zigzag-edge zigzag-bottom z-10" />

      {/* Mobile motion background */}
      <motion.div
        className="absolute inset-0 block md:hidden z-0"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: `translateY(${fallbackY > 0 ? -Math.min(fallbackY / 7.5, 40) : 0}px)`
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Centered Text */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        viewport={{ once: true }}
        className="relative z-30 w-full px-6 max-w-4xl text-center"
      >
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-cormorant font-bold text-white leading-snug tracking-wide">
          EXPERIENCE THE AUTHENTIC QUALITY OF A TRADITIONAL MEAL<br className="hidden sm:block" />
          SERVED ON A MEAL BOX
        </h2>
      </motion.div>
    </section>
  );
};

export default TraditionalMealSection;
