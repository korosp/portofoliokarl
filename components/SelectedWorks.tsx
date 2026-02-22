'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export type Project = {
    id: number;
    title: string;
    category: string;
    image: string;
    description: string;
    fullDescription: string;
    features: string[];
    tech: string[];
    link: string;
    github?: string;
    screenshots?: string[];
};

export const projects: Project[] = [
    {
        id: 1,
        title: "Web Absensi",
        category: "Web",
        image: "/project-absensi.png",
        description: "Modul Pelatihan LKS 2025",
        fullDescription: "Website absensi berbasis PHP Native yang dikembangkan sebagai bagian dari modul pelatihan untuk Lomba Kompetensi Siswa (LKS) 2026. Sistem ini dirancang untuk memudahkan pengelolaan kehadiran siswa dan staff dengan interface yang user-friendly dan responsif.",
        features: [
            "Pencatatan kehadiran real-time",
            "Dashboard monitoring kehadiran",
            "Export data ke Excel/PDF",
            "Multi-user role (Admin, Guru, Siswa)",
            "Riwayat kehadiran lengkap"
        ],
        tech: ["PHP Native", "MySQL", "Bootstrap"],
        link: "#",
        screenshots: ["/project-absensi.png"]
    },
    {
        id: 2,
        title: "PerpusAksata",
        category: "Web",
        image: "/project-perpus.png",
        description: "Modul Fullstack Laravel Sekawan Media (1-9), sebuah sistem website yang memiliki 2 role yaitu admin dan peminjam, sudah memiliki fitur CRUD, Search dan pengelolaan peminjaman",
        fullDescription: "PerpusAksata adalah sistem manajemen perpustakaan berbasis web yang dibangun menggunakan Laravel framework. Proyek ini merupakan bagian dari Modul Fullstack Laravel Sekawan Media (modul 1-9), dirancang dengan arsitektur MVC yang clean dan scalable. Sistem ini mendukung dua role utama: Admin untuk pengelolaan penuh sistem dan Peminjam untuk akses peminjaman buku.",
        features: [
            "CRUD lengkap untuk manajemen buku dan anggota",
            "Sistem pencarian buku dengan filter advanced",
            "Pengelolaan peminjaman dan pengembalian buku",
            "Dashboard analytics untuk admin",
            "Role-based access control (Admin & Peminjam)",
            "Notifikasi deadline pengembalian",
            "Laporan statistik peminjaman"
        ],
        tech: ["Laravel", "MySQL", "Tailwind", "PHP"],
        link: "https://github.com/korosp/PerpusAksata",
        github: "https://github.com/korosp/PerpusAksata",
        screenshots: ["/project-perpus.png"]
    },
    {
        id: 3,
        title: "KarlX - AI",
        category: "Web",
        image: "/project-ai.png",
        description: "AI-powered platform with advanced features - Repository: Nexus Core",
        fullDescription: "Karlx - AI adalah platform AI yang powerful dengan berbagai fitur advanced untuk membantu pengguna dalam berbagai task. Dibangun dengan Next.js dan TypeScript untuk performa optimal, platform ini mengintegrasikan teknologi AI terkini dengan user interface yang modern dan intuitif. Repository Nexus Core menyimpan core logic dan AI integration dari platform ini.",
        features: [
            "AI-powered conversation system",
            "Real-time response generation",
            "Modern and intuitive UI/UX",
            "Responsive design untuk semua device",
            "Integration dengan multiple AI models",
            "User authentication dan profile management"
        ],
        tech: ["Next.js", "TypeScript", "Tailwind", "Supabase"],
        link: "https://karl.web.id",
        github: "https://github.com/korosp/AiRULe",
        screenshots: ["/project-ai.png"]
    },
    {
        id: 4,
        title: "TON Monitoring Bot",
        category: "App",
        image: "/project-empty.png",
        description: "Monitoring TON lewat bot Telegram",
        fullDescription: "Bot Telegram yang dirancang khusus untuk memonitoring jaringan TON (The Open Network). Bot ini memberikan update real-time mengenai transaksi, harga, dan aktivitas jaringan lainnya langsung ke chat user secara efisien.",
        features: [
            "Real-time TON transaction monitoring",
            "Price alerts & market data",
            "Network status & gas fee updates",
            "Multi-wallet tracking support"
        ],
        tech: ["Python", "Telethon", "TON API"],
        link: "https://github.com/korosp",
        github: "https://github.com/korosp",
        screenshots: ["/project-empty.png"]
    },
    {
        id: 5,
        title: "Media Downloader Bot",
        category: "App",
        image: "/project-empty.png",
        description: "Download video medsos tanpa watermark",
        fullDescription: "Bot serbaguna untuk mendownload video dari berbagai media sosial populer (TikTok, Instagram, YouTube, dll) tanpa watermark. Menawarkan pengalaman download yang cepat dan kualitas video original.",
        features: [
            "No watermark video downloads",
            "Support TikTok, IG, YT, & more",
            "Original quality preservation",
            "Fast processing & easy commands"
        ],
        tech: ["Python", "Telethon", "yt-dlp", "FFmpeg"],
        link: "https://github.com/korosp",
        github: "https://github.com/korosp/bot-downloader",
        screenshots: ["/project-empty.png"]
    }
];

const tabs = ["All", "Web", "App", "Design"];

export function SelectedWorks({ onProjectClick }: { onProjectClick?: (project: Project) => void }) {
    const [activeTab, setActiveTab] = useState("All");

    const filteredProjects = activeTab === "All"
        ? projects
        : projects.filter(p => p.category === activeTab);

    return (
        <section id="works" className="py-20 px-4 md:px-12 border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                    <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium mb-4 block">
                            Selected Works
                        </span>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight uppercase">
                            Featured <br /> Projects
                        </h2>
                    </div>

                    <div className="flex gap-2 p-1 bg-white/5 rounded-full backdrop-blur-sm border border-white/5">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === tab
                                    ? "bg-white text-black shadow-lg"
                                    : "text-zinc-400 hover:text-white"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredProjects.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={project.id}
                                    onClick={() => onProjectClick?.(project)}
                                    className="group relative bg-[#0a0a0a] rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-colors cursor-pointer"
                                >
                                    {/* Image Container - Top */}
                                    <div className="aspect-[4/3] overflow-hidden bg-zinc-900 relative">
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        {/* Overlay Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
                                    </div>

                                    {/* Content Container - Bottom */}
                                    <div className="p-6 relative">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2 block">{project.category}</span>
                                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">{project.title}</h3>
                                                {project.description && (
                                                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">{project.description}</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <a
                                                    href={project.github || "https://github.com/korosp"}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="p-2 bg-white/5 rounded-full hover:bg-white text-white hover:text-black transition-all"
                                                >
                                                    <Github size={16} />
                                                </a>
                                                <a
                                                    href={project.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="p-2 bg-white/5 rounded-full hover:bg-white text-white hover:text-black transition-all"
                                                >
                                                    <ArrowUpRight size={16} />
                                                </a>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {project.tech.map((t) => (
                                                <span key={t} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-medium text-zinc-400 border border-white/5">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div className="w-full py-20 flex flex-col items-center justify-center text-center border border-white/5 rounded-3xl bg-white/[0.02]">
                        <div className="w-16 h-16 mb-4 rounded-full bg-white/5 flex items-center justify-center">
                            <span className="text-2xl text-zinc-600">📂</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">No projects available</h3>
                        <p className="text-sm text-zinc-500">
                            There are no projects in this category yet.
                        </p>
                    </div>
                )}
            </div>


        </section>
    );
}
