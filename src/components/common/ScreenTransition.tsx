import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScreenTransitionProps {
  children: ReactNode;
  screenKey: string;
}

const variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.03 },
};

export function ScreenTransition({ children, screenKey }: ScreenTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screenKey}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        style={{ minHeight: '100vh' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
