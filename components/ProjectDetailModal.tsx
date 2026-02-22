'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface Project {
    id: number;
    title: string;
    category: string;
    image: string;
    description: string;
    fullDescription?: string;
    screenshots?: string[];
    features?: string[];
    tech: string[];
    link: string;
    github?: string;
}

interface ProjectDetailModalProps {
    project: Project | null;
    onClose: () => void;
}

export function ProjectDetailModal({ project, onClose }: ProjectDetailModalProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Prevent body scroll when modal is open - STRONG LOCK
    useEffect(() => {
        // Store original overflow and position
        const originalOverflow = document.body.style.overflow;
        const originalPosition = document.body.style.position;
        const originalTop = document.body.style.top;
        const scrollY = window.scrollY;

        // Lock body scroll
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';

        return () => {
            // Restore body scroll
            document.body.style.overflow = originalOverflow;
            document.body.style.position = originalPosition;
            document.body.style.top = originalTop;
            document.body.style.width = '';
            window.scrollTo(0, scrollY);
        };
    }, []);

    // Close on ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!project) return null;

    const images = project.screenshots || [project.image];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <AnimatePresence>
            {/* Backdrop - PREVENT ALL SCROLLING - HIGHEST Z-INDEX */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                onWheel={(e) => e.preventDefault()}
                className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-start justify-center p-0 md:p-4 md:py-8 overflow-hidden"
            >
                {/* Fixed Close Button - ALWAYS ON TOP */}
                <button
                    onClick={onClose}
                    className="fixed top-4 right-4 md:top-6 md:right-6 z-[101] p-4 md:p-4 bg-black/80 backdrop-blur-md rounded-full hover:bg-white hover:text-black hover:rotate-90 transition-all duration-300 border-2 border-white/50 shadow-2xl group"
                    aria-label="Close modal"
                >
                    <X size={24} strokeWidth={2.5} className="text-white group-hover:text-black group-hover:scale-110 transition-all" />
                </button>
                {/* Modal Container - ONLY THIS SCROLLS */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 30, stiffness: 300 }}
                    onClick={(e) => e.stopPropagation()}
                    onWheel={(e) => e.stopPropagation()}
                    className="bg-[#0a0a0a] border-0 md:border md:border-white/10 md:rounded-3xl w-full max-w-4xl max-h-screen md:max-h-[95vh] overflow-y-auto relative"
                    style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}
                >


                    {/* Image Gallery */}
                    <div className="relative aspect-video md:aspect-[21/9] overflow-hidden bg-zinc-900 md:rounded-t-3xl">
                        <Image
                            src={images[currentImageIndex]}
                            alt={`${project.title} screenshot ${currentImageIndex + 1}`}
                            fill
                            className="object-contain md:object-cover"
                            priority
                        />

                        {/* Gallery Controls */}
                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                    className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-black/70 backdrop-blur-sm rounded-full hover:bg-black/90 transition-colors border border-white/20"
                                    aria-label="Previous image"
                                >
                                    <ChevronLeft size={20} className="text-white" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                    className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 p-2 md:p-3 bg-black/70 backdrop-blur-sm rounded-full hover:bg-black/90 transition-colors border border-white/20"
                                    aria-label="Next image"
                                >
                                    <ChevronRight size={20} className="text-white" />
                                </button>

                                {/* Image Counter */}
                                <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/70 backdrop-blur-sm rounded-full border border-white/20">
                                    <span className="text-xs font-medium text-white">
                                        {currentImageIndex + 1} / {images.length}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6 md:p-8 lg:p-10">
                        {/* Header */}
                        <div className="mb-8">
                            <span className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 block">
                                {project.category}
                            </span>
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
                                {project.title}
                            </h2>
                            <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
                                {project.fullDescription || project.description}
                            </p>
                        </div>

                        {/* Features */}
                        {project.features && project.features.length > 0 && (
                            <div className="mb-8">
                                <h3 className="text-lg md:text-xl font-bold text-white mb-4">Key Features</h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {project.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <span className="text-purple-400 text-lg mt-0.5 flex-shrink-0">•</span>
                                            <span className="text-sm md:text-base text-zinc-300 leading-relaxed">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Tech Stack */}
                        <div className="mb-8">
                            <h3 className="text-lg md:text-xl font-bold text-white mb-4">Technologies Used</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.tech.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-3 md:px-4 py-1.5 md:py-2 bg-white/5 rounded-full text-xs md:text-sm font-medium text-zinc-300 border border-white/10 hover:bg-white/10 transition-colors"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Links */}
                        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-6 border-t border-white/10">
                            {project.github && (
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/10"
                                >
                                    <Github size={18} className="text-white" />
                                    <span className="text-sm font-bold text-white">View Code</span>
                                </a>
                            )}
                            {project.link && project.link !== '#' && (
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-full hover:bg-white/90 transition-colors font-bold"
                                >
                                    <ExternalLink size={18} />
                                    <span className="text-sm font-bold">Visit Project</span>
                                </a>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
