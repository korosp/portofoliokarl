'use client';

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Home, User, Briefcase, Mail, Github, Instagram, Linkedin, ExternalLink } from 'lucide-react';
import Link from 'next/link';

// Component for individual Dock Item
function DockItem({ mouseX, icon: Icon, label, href, onClick }: any) {
    const ref = useRef<HTMLDivElement>(null);

    const distance = useTransform(mouseX, (val: number) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    const widthSync = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            ref={ref}
            style={{ width }}
            className="aspect-square rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center relative group cursor-pointer hover:bg-white/20 transition-colors"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, x: "-50%" }}
                        animate={{ opacity: 1, y: -45, x: "-50%" }}
                        exit={{ opacity: 0, y: 10, x: "-50%" }}
                        className="absolute left-1/2 -top-2 bg-black/90 border border-white/10 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full whitespace-nowrap z-50 pointer-events-none"
                    >
                        {label}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/90 border-r border-b border-white/10 rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>

            {href ? (
                <Link href={href} target={href.startsWith('http') ? '_blank' : '_self'}>
                    <Icon className="w-1/2 h-1/2 text-white/80 group-hover:text-white transition-colors" />
                </Link>
            ) : (
                <Icon className="w-1/2 h-1/2 text-white/80 group-hover:text-white transition-colors" />
            )}
        </motion.div>
    );
}

export function DockMenu({ scrollToSection }: { scrollToSection: (id: string) => void }) {
    const mouseX = useMotionValue(Infinity);

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: 'spring', damping: 20 }}
            onMouseMove={(e) => mouseX.set(e.pageX)}
            onMouseLeave={() => mouseX.set(Infinity)}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex h-16 items-end gap-4 rounded-2xl bg-black/40 px-4 pb-3 border border-white/5 shadow-2xl backdrop-blur-xl"
        >
            <DockItem mouseX={mouseX} icon={Home} label="Home" onClick={() => scrollToSection('home')} />
            <DockItem mouseX={mouseX} icon={User} label="About" onClick={() => scrollToSection('about')} />
            <DockItem mouseX={mouseX} icon={Briefcase} label="Works" onClick={() => scrollToSection('works')} />
            <DockItem mouseX={mouseX} icon={Mail} label="Contact" onClick={() => scrollToSection('contact')} />

            <div className="w-[1px] h-10 bg-white/10 mx-1 self-center" />

            <DockItem mouseX={mouseX} icon={Github} label="Github" href="https://github.com" />
            <DockItem mouseX={mouseX} icon={Instagram} label="Instagram" href="https://instagram.com" />
        </motion.div>
    );
}
