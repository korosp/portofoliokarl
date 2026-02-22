'use client';

import { motion } from 'framer-motion';
import { Mail, Github, Instagram, Linkedin, Twitter } from 'lucide-react';

export function Contact() {
    return (
        <section
            id="contact"
            className="py-20 px-4 md:px-12 border-t border-white/5 bg-[#050505] relative overflow-hidden"
        >

            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="flex flex-col items-center text-center mb-16"
                >
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium mb-4">
                        Get in Touch
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-8">
                        Let's build <br /> something great.
                    </h2>
                    <a
                        href="mailto:contact@karl.dev"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-full font-bold text-sm tracking-widest uppercase hover:scale-105 transition-transform"
                    >
                        <Mail size={16} /> Kirim Email
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
