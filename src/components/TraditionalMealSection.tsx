import React from 'react';
import { motion } from 'framer-motion';

const TraditionalMealSection: React.FC = () => {
  const images = [
    'https://images.pexels.com/photos/5410418/pexels-photo-5410418.jpeg',
    'https://images.pexels.com/photos/9609847/pexels-photo-9609847.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  ];

  return (
    <>
      {/* Desktop version - fixed background */}
      <section
        className="traditional-section relative h-[50vh] hidden md:flex items-center justify-center bg-fixed bg-center bg-cover"
        style={{
          backgroundImage: `url('${images[0]}')`,
        }}
      >
        <div className="zigzag-edge zigzag-top z-10" />
        <div className="zigzag-edge zigzag-bottom z-10" />
        <div className="absolute inset-0 bg-black/60 z-0" />

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

      {/* Mobile version - horizontal scroll */}
      <section className="relative h-[60vh] md:hidden overflow-hidden">
        <div className="zigzag-edge zigzag-top z-10" />
        <div className="zigzag-edge zigzag-bottom z-10" />

        {/* Auto-scrolling background */}
        <motion.div
          className="absolute top-0 left-0 h-full w-[400vw] flex z-0"
          animate={{ x: ['0vw', '-200vw'] }}
          transition={{
            repeat: Infinity,
            duration: 25,
            ease: 'linear',
          }}
        >
          {[...images, ...images].map((img, idx) => (
            <div
              key={idx}
              className="w-screen h-full bg-cover bg-center flex-shrink-0"
              style={{ backgroundImage: `url('${img}')` }}
            />
          ))}
        </motion.div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60 z-10" />

        {/* Text overlay */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          viewport={{ once: true }}
          className="relative z-30 w-full px-6 max-w-4xl text-center flex items-center justify-center h-full"
        >
          <h2 className="text-base sm:text-lg font-cormorant font-bold text-white leading-snug tracking-wide">
            EXPERIENCE THE AUTHENTIC QUALITY OF A TRADITIONAL MEAL
            SERVED ON A MEAL BOX
          </h2>
        </motion.div>
      </section>
    </>
  );
};

export default TraditionalMealSection;
