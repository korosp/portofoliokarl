'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export function Navbar({ scrollToSection }: { scrollToSection: (id: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);

    // Links configuration
    const links = [
        { name: 'Home', id: 'home' },
        { name: 'About', id: 'about' },
        { name: 'Skills', id: 'skills' },
        { name: 'Projects', id: 'works' },
        { name: 'Contact', id: 'contact' },
    ];

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 backdrop-blur-sm bg-black/0 transition-all duration-300"
        >
            {/* Logo area */}
            <div className="text-xl font-bold tracking-tighter text-white cursor-pointer z-50" onClick={() => scrollToSection('home')}>
                <span className="text-white">Karlzy Expert</span>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex gap-8">
                {links.map((link) => (
                    <button
                        key={link.name}
                        onClick={() => scrollToSection(link.id)}
                        className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                    >
                        {link.name}
                    </button>
                ))}
            </div>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden text-white z-50 p-2.5 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 hover:bg-white/10 transition-all"
                aria-label="Toggle Menu"
            >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 md:hidden"
                    >
                        {links.map((link, i) => (
                            <motion.button
                                key={link.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                onClick={() => {
                                    scrollToSection(link.id);
                                    setIsOpen(false);
                                }}
                                className="text-2xl font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest"
                            >
                                {link.name}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
