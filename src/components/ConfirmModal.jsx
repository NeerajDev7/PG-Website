import { motion, AnimatePresence } from 'framer-motion'

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className='fixed inset-0 z-50 flex items-center justify-center px-4'
                        style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
                        onClick={onCancel}
                    >
                        {/* Modal */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.92, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.92, y: 20 }}
                            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                            className='w-full max-w-md rounded-2xl p-8 shadow-2xl'
                            style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className='text-4xl mb-4 text-center'>⚠️</div>
                            <h2 className='text-xl font-bold text-center mb-2' style={{ color: 'var(--text-primary)' }}>
                                {title}
                            </h2>
                            <p className='text-sm text-center mb-8' style={{ color: 'var(--text-secondary)' }}>
                                {message}
                            </p>
                            <div className='flex gap-3'>
                                <button
                                    onClick={onCancel}
                                    className='flex-1 py-3 rounded-lg font-semibold text-sm hover:opacity-80 transition'
                                    style={{ backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className='flex-1 py-3 rounded-lg font-bold text-sm hover:opacity-90 transition'
                                    style={{ backgroundColor: 'var(--danger)', color: 'var(--bg-card)' }}
                                >
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export default ConfirmModal