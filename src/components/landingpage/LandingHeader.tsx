'use client';
import { motion } from 'framer-motion';
import React from 'react';

function LandingHeader() {
  return (
    <div>
      <motion.h2
        initial={{
          y: 40,
          opacity: 0.2,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
        className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight"
      >
        Multiwallet, <br /> Generate Cryptowallets.
      </motion.h2>
      <motion.p
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        transition={{ delay: 1 }}
        className="max-w-xl mx-auto text-sm md:text-lg text-neutral-700 dark:text-neutral-400 text-center"
      >
        Get your wallets with ease of simple click, start by selecting your
        wallet type. Following are the wallet types.
      </motion.p>
    </div>
  );
}

export default LandingHeader;
