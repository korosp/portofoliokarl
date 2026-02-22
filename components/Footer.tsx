'use client';

import { Github, Instagram, Linkedin, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

export function Footer() {
    return (
        <footer className="py-12 border-t border-white/5 bg-black/20 backdrop-blur-sm relative z-10 px-6">
            <div className="max-w-7xl mx-auto flex flex-col items-center gap-8">

                {/* Social Links */}
                <div className="flex items-center gap-6">
                    <a href="https://github.com/korosp" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
                        <Github size={20} />
                    </a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
                        <Linkedin size={20} />
                    </a>
                    <a href="https://instagram.com/kkarlzy_" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
                        <Instagram size={20} />
                    </a>
                    {/* Optional Twitter/X */}
                    {/* <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-white transition-colors hover:scale-110 transform duration-200">
                        <Twitter size={20} />
                    </a> */}
                </div>

                {/* Brand / Copyright */}
                <div className="flex flex-col items-center gap-2">
                    <span className="text-xl font-bold tracking-tighter text-white">Portfolio</span>
                    <span className="text-xs font-medium text-zinc-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        Based in Medan, Indonesia 🇮🇩
                    </span>
                    <span className="text-xs text-zinc-500">
                        © {new Date().getFullYear()} Karl. All rights reserved.
                    </span>
                </div>
            </div>
        </footer>
    );
}
