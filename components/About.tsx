'use client';

import { motion } from 'framer-motion';

const experience = [
    {
        year: "2026 - Present",
        role: "Student Developer",
        company: "Karlzy Company",
        description: "Started my coding journey. Learning software engineering fundamentals and web development."
    }
];

export function About() {
    return (
        <section id="about" className="py-20 px-4 md:px-12 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium mb-6 block">
                        About Me
                    </span>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-[1.1] mb-8 uppercase">
                        Driven by purpose, <br />
                        <span className="text-zinc-600">Defined by code.</span>
                    </h2>
                    <div className="space-y-6 text-sm text-zinc-400 leading-relaxed font-normal">
                        <p>
                            Hi, I'm <span className="text-white font-bold">Karlzy</span>, a Fullstack Developer based in Malang, Indonesia with a deep passion for building
                            elegant, efficient, and scalable web solutions. My journey began with a curiosity
                            about how things work on the internet, which quickly evolved into a career
                            focused on solving complex problems through code.
                        </p>
                        <p>
                            I specialize in Fullstack development with a strong focus on Backend systems.
                            While I am proficient in the modern JavaScript ecosystem like Next.js and React,
                            I am deeply interested in building robust server-side architectures, scalable APIs,
                            and efficient database designs.
                        </p>
                    </div>
                </motion.div>

                {/* Visual / Image Area - Timeline */}
                <div className="pl-4 md:pl-12 border-l border-white/5">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium block mb-8">
                        Experience / Education
                    </span>

                    <div className="space-y-12">
                        {experience.map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2, duration: 0.8 }}
                                className="relative pl-8"
                            >
                                <div className="absolute -left-[33px] top-2 w-3 h-3 rounded-full bg-zinc-900 border border-white/20" />
                                <span className="text-[10px] font-mono text-zinc-500 mb-2 block tracking-widest">{item.year}</span>
                                <h3 className="text-xl font-bold text-white mb-1">{item.role}</h3>
                                <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-3">{item.company}</p>
                                <p className="text-sm text-zinc-500 leading-relaxed font-normal">
                                    {item.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
