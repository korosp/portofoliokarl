'use client';

import { motion } from 'framer-motion';
import { Layers, Database, Layout, Globe, Code2, Server, Terminal, Command, Cpu } from 'lucide-react';

const categories = [
    {
        title: "Backend",
        subtitle: "System Architecture",
        icon: Server,
        skills: ["PHP", "Laravel", "MySQL", "Node.js"]
    },
    {
        title: "Frontend",
        subtitle: "Interface Engineering",
        icon: Layout,
        skills: ["HTML5", "CSS3", "React", "Next.js", "Tailwind CSS"]
    },
    {
        title: "Tools & Langs",
        subtitle: "Essential Toolkit",
        icon: Terminal,
        skills: ["TypeScript", "Git", "VS Code", "Figma"]
    }
];

export function TechStack() {
    return (
        <section id="skills" className="py-20 px-4 md:px-12 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col items-center md:items-start text-center md:text-left mb-16">
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight mb-4">
                        Tech Stack.
                    </h2>
                    <p className="max-w-xl text-zinc-400 text-sm leading-relaxed">
                        A curated technical arsenal focused on performance, scalability, and maintainability.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2, duration: 0.5 }}
                            className="bg-[#0a0a0a] border border-white/10 p-8 rounded-3xl hover:bg-white/5 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform">
                                <cat.icon size={24} />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{cat.title}</h3>
                            <span className="text-xs font-bold tracking-widest text-zinc-500 uppercase mb-8 block">
                                {cat.subtitle}
                            </span>

                            <ul className="space-y-3">
                                {cat.skills.map((skill, j) => (
                                    <li key={j} className="flex items-center gap-3 text-zinc-400 group-hover:text-zinc-300 transition-colors">
                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 group-hover:bg-white transition-colors" />
                                        <span className="text-sm font-medium">{skill}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
