import { motion } from 'framer-motion'

function PageTransition({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, filter: 'blur(8px)', scale: 0.98 }}
            animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
            exit={{ opacity: 0, filter: 'blur(8px)', scale: 0.98 }}
            transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1]
            }}
        >
            {children}
        </motion.div>
    )
}

export default PageTransition