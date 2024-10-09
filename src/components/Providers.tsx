'use client';
import React, { ReactNode } from 'react';
import { ThemeProvider } from './ui/ThemeProvider';
import { AnimatePresence } from 'framer-motion';

function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AnimatePresence>{children};</AnimatePresence>
    </ThemeProvider>
  );
}

export default Providers;
