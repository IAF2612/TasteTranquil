
import { motion, AnimatePresence } from 'framer-motion';

export const LogoAnimation = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ rotate: 0, scale: 1 }}
        animate={{ 
          rotate: [0, -10, 10, -10, 0],
          scale: [1, 1.1, 0.9, 1.1, 1]
        }}
        transition={{ duration: 0.5 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 text-center"
      >
        <img 
          src="/TasteTranquil-removebg-preview.png" 
          alt="TasteTranquil" 
          className="h-24 md:h-[6rem]" 
        />
        <div className="text-center mt-4 text-2xl font-semibold bg-gradient-to-r from-blue-200 to-pink-200 bg-clip-text text-transparent transition-all duration-300">
          TasteTranquil
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
