"use client";
import React, { useState, useEffect, useRef } from 'react';
import { HeroOrb } from '../components/HeroOrb';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import {
  Instagram, Github, Mail, ArrowRight, Music, Minus, Heart,
  Globe, Layout, Code2, Cpu, Terminal, Database, Rocket, User, ChevronRight, Send, MapPin,
  MessageCircle, Bot, X
} from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { TechStack } from '../components/TechStack';
import { SelectedWorks } from '../components/SelectedWorks';
import { About } from '../components/About';
import { Contact } from '../components/Contact';
import { Footer } from '../components/Footer';
import { ScrollReveal } from '../components/ScrollReveal';
import Lenis from 'lenis';
import { ProjectDetailModal } from '../components/ProjectDetailModal';
import { projects, Project } from '../components/SelectedWorks';

// --- KONFIGURASI SUPABASE ---
const supabaseUrl = 'https://vqofrgkrtxsdgleccixm.supabase.co';
const supabaseKey = 'sb_publishable_IFLx-qKNGBqjGcgUZkMz_A_1NTOdjhm';
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Home() {
  // simple translations based on device language
  const lang = typeof navigator !== 'undefined' ? navigator.language : 'en';
  // ... (keep language logic) ...
  const t = (k: string) => {
    // ... (keep logic) ...
    const dict: Record<string, { en: string; id: string }> = {
      about_title: { en: 'About Me', id: 'Tentang Saya' },
      about_text: {
        en: 'I have been passionate about technology since childhood, especially programming. I enjoy solving technical problems and building efficient solutions.',
        id: 'saya sejak kecil sangat suka pada teknologi, terutama dalam bidang pemrograman. Saya menikmati tantangan dalam memecahkan masalah teknis dan menciptakan solusi yang efisien'
      },
      selected_works: { en: 'Selected Works', id: 'Selected Works' },
      contact_cta: { en: "LET'S BUILD SOMETHING GREAT TOGETHER.", id: "LET'S BUILD SOMETHING GREAT TOGETHER." },
    };
    const isID = lang.startsWith('id');
    return dict[k] ? (isID ? dict[k].id : dict[k].en) : k;
  };

  const [loading, setLoading] = useState(true);
  const [isBotOpen, setIsBotOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false); // State untuk Chatbot
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // State Chat Logic
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ role: 'bot' | 'user'; content: string }[]>([
    { role: 'bot', content: 'Halo! Ada yang bisa gue bantu soal profil Karl?' }
  ]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showAssistantText, setShowAssistantText] = useState(true);

  // Smooth Scroll (Lenis)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      // direction: 'vertical', // default
      // gestureDirection: 'vertical', // default
      // smooth: true,
      // mouseMultiplier: 1,
      // smoothTouch: false,
      // touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);


  // Hide the assistant text after 10 seconds from page load
  React.useEffect(() => {
    const t = setTimeout(() => setShowAssistantText(false), 10000);
    return () => clearTimeout(t);
  }, []);

  const toggleChat = () => {
    setIsChatOpen(prev => {
      const next = !prev;
      if (next) setUnreadCount(0);
      return next;
    });
  };

  const formRef = useRef<HTMLFormElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);

  // ... (keep useEffect for likes) ...
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const { data, error } = await supabase
          .from('portfolio_stats')
          .select('likes_count')
          .eq('slug', 'home')
          .single();
        if (data) setLikes(data.likes_count);
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };
    fetchLikes();
    const timer = setTimeout(() => setLoading(false), 800);

    const channel = supabase.channel('realtime-likes')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'portfolio_stats' },
        (payload: any) => {
          if (payload.new && payload.new.likes_count !== undefined) {
            setLikes(payload.new.likes_count);
          }
        }
      ).subscribe();

    return () => {
      supabase.removeChannel(channel);
      clearTimeout(timer);
    };
  }, []);


  // ... (keep cursor effect) ...
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches) return; // skip touch
    // ... custom cursor implementation ...
    const cursor = document.getElementById('custom-cursor') as HTMLDivElement | null;
    if (!cursor) return;
    cursor.style.display = 'block';

    let mouseX = 0, mouseY = 0;
    let posX = 0, posY = 0;
    let raf = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onFrame = () => {
      posX += (mouseX - posX) * 0.18;
      posY += (mouseY - posY) * 0.18;
      if (cursor) cursor.style.transform = `translate(${posX - 0}px, ${posY - 0}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(onFrame);
    };

    // ... event listeners ...
    const onOver = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest && target.closest('a,button,input,textarea,select,[data-cursor]')) {
        cursor.classList.add('cursor-hover');
      }
    };

    const onOut = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest && target.closest('a,button,input,textarea,select,[data-cursor]')) {
        cursor.classList.remove('cursor-hover');
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    raf = requestAnimationFrame(onFrame);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(raf);
      if (cursor) cursor.style.display = 'none';
    };
  }, []);

  // ... (keep chat scroll effect) ...
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top - 100, behavior: 'smooth' });
    }
  };

  const handleLike = async () => {
    const newCount = isLiked ? likes - 1 : likes + 1;
    setIsLiked(!isLiked);
    setLikes(newCount);
    await supabase.from('portfolio_stats').update({ likes_count: newCount }).eq('slug', 'home');
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;
    setIsSending(true);
    emailjs.sendForm('service_j0zovtw', 'template_6v64zoc', formRef.current, 's11E8RAehc_lS1rhk')
      .then(() => {
        alert("Pesan Terkirim! ✅");
        formRef.current?.reset();
      })
      .finally(() => setIsSending(false));
  };

  // ... (keep handleChat) ...
  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    const userMessage = { role: 'user' as const, content: userMsg };
    const newMessages = [...chatMessages, userMessage];
    setChatMessages(newMessages);
    setChatInput('');

    try {
      setIsBotTyping(true);
      const apiUrl = (typeof window !== 'undefined' ? window.location.origin : '') + '/api/chat';
      console.log('[client] sending chat to', apiUrl, { model: 'gpt-3.5-turbo', messages: newMessages.length });
      const resp = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.map(m => ({ role: m.role, content: m.content })), model: 'openai/gpt-oss-120b', lang })
      });

      // Read raw response text first (gives better diagnostics for non-JSON errors)
      const rawText = await resp.text();
      let data: any = rawText;
      try { data = JSON.parse(rawText); } catch (e) { /* keep rawText as fallback */ }

      if (!resp.ok) {
        // ... error handling ...
        const detail = (data && (data.error || data.message)) || rawText || JSON.stringify(data);
        const botMessage = { role: 'bot' as const, content: `Gagal menghubungi layanan AI (server error). ${detail ? 'Detail: ' + String(detail) : 'Lihat konsol untuk detail.'}` };
        setChatMessages(prev => [...prev, botMessage]);
        setIsBotTyping(false);
        return;
      }

      const reply = data?.text ?? data?.choices?.[0]?.message?.content ?? (typeof data === 'string' ? data : null) ?? 'Maaf, terjadi kesalahan mendapatkan respons dari AI.';
      const botMessage = { role: 'bot' as const, content: String(reply).trim() };
      setChatMessages(prev => [...prev, botMessage]);
      if (!isChatOpen) setUnreadCount(c => c + 1);
      setIsBotTyping(false);
    } catch (err) {
      console.error('[client] chat fetch failed', err);
      const botMessage = { role: 'bot' as const, content: 'Gagal menghubungi layanan AI (network error).' };
      setChatMessages(prev => [...prev, botMessage]);
      if (!isChatOpen) setUnreadCount(c => c + 1);
      setIsBotTyping(false);
    }
  };


  const containerVars = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
    visible: {
      opacity: 1, y: 0, filter: "blur(0px)",
      transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }
    }
  };

  return (
    <div className="bg-[#050505] min-h-screen text-zinc-400 font-sans selection:bg-white/20 overflow-x-hidden relative">
      {/* Navbar */}
      <Navbar scrollToSection={scrollToSection} />

      {/* Custom Start Screen (Loading) */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#050505] flex items-center justify-center z-[100]"
          >
            <div className="flex flex-col items-center gap-6">
              <span className="text-xs tracking-[1em] text-white uppercase font-black">LOADING</span>
              <div className="w-24 h-[1px] bg-white/10 relative overflow-hidden">
                <motion.div
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-0 w-1/2 h-full bg-white"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="px-4 md:px-12 relative z-10">
        <section id="home" className="h-screen flex flex-col justify-center relative overflow-visible">
          {/* Lanyard - Fullscreen Overlay */}
          {/* Lanyard - Fullscreen Overlay */}
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full">
              <HeroOrb profileImage="/profile.png" />
            </div>
          </div>

          <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 max-w-7xl mx-auto pointer-events-none">

            {/* Left Content: Typography */}
            <motion.div
              variants={containerVars}
              initial="hidden"
              animate="visible"
              className="relative z-20 flex-1 flex flex-col items-center md:items-start text-center md:text-left pt-20 md:pt-0"
            >
              <motion.div variants={itemVars} className="flex items-center gap-2 mb-6 bg-white/5 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-sm pointer-events-auto">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[9px] tracking-[0.2em] uppercase font-bold text-zinc-400">Available for work</span>
              </motion.div>

              <motion.h1 variants={itemVars} className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase mb-6 pointer-events-auto">
                Fullstack <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-white">Developer.</span>
              </motion.h1>

              <motion.p variants={itemVars} className="max-w-lg text-sm text-zinc-400 font-normal leading-relaxed mb-8 pointer-events-auto">
                Crafting robust and scalable digital experiences with clean architecture.
                Focusing on modern web technologies and intuitive design.
              </motion.p>

              <motion.div variants={itemVars} className="flex flex-wrap gap-4 items-center justify-center md:justify-start pointer-events-auto">
                <button onClick={() => scrollToSection('works')} className="group bg-white text-black px-8 py-3.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  Lihat Portfolio
                </button>
                <div className="flex gap-4">
                  <button onClick={() => scrollToSection('contact')} className="group px-8 py-3.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white border border-white/10 hover:bg-white/5 transition-colors backdrop-blur-sm">
                    Hubungi Saya
                  </button>

                  {/* DOWNLOAD CV BUTTON */}
                  <a
                    href="/cv.pdf"
                    download
                    className="group px-8 py-3.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white bg-white/5 border border-white/10 hover:bg-white hover:text-black transition-all backdrop-blur-sm flex items-center gap-2"
                  >
                    Download CV
                  </a>
                </div>
              </motion.div>
            </motion.div>


          </div>
        </section>

        <ScrollReveal>
          <About />
        </ScrollReveal>

        <ScrollReveal>
          <SelectedWorks onProjectClick={(p) => setSelectedProject(p)} />
        </ScrollReveal>

        <ScrollReveal>
          <TechStack />
        </ScrollReveal>

        <ScrollReveal>
          <Contact />
        </ScrollReveal>
      </main>

      {/* Footer */}
      <Footer />

      {/* ... (AI Chatbot Code) ... */}
      {!loading && (
        <div className="fixed bottom-8 right-16 z-[100] md:right-20">
          <AnimatePresence>
            {isChatOpen && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="absolute bottom-16 right-0 w-64 bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              >
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-zinc-900">
                  <div className="flex items-center gap-2">
                    <Bot size={14} className="text-white" />
                    <span className="text-[10px] font-black text-white">Karl Helper</span>
                  </div>
                  <button onClick={() => setIsChatOpen(false)} aria-label="Tutup chat"><X size={14} /></button>
                </div>
                <div className="h-48 overflow-y-auto p-4 space-y-3 flex flex-col">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`text-[8px] p-2 rounded-lg max-w-[90%] font-bold ${msg.role === 'bot' ? 'bg-zinc-800 self-start' : 'bg-white text-black self-end'}`}>
                      {msg.content}
                    </div>
                  ))}
                  {isBotTyping && (
                    <div className="text-[8px] p-2 rounded-lg max-w-[40%] bg-zinc-800 self-start">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse" style={{ animationDelay: '0.15s' }}></span>
                        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></span>
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
                <form onSubmit={handleChat} className="p-2 border-t border-white/5 flex gap-2">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Tanyakan..."
                    className="bg-transparent flex-1 text-[8px] p-2 focus:outline-none font-black"
                  />
                  <button type="submit" className="text-white p-1"><Send size={12} /></button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[#0b0b0b] border border-white/6 rounded-full px-3 py-2 shadow-sm">
              <Bot size={14} className="text-white mr-2" />
              {showAssistantText && (
                <span className="text-[11px] font-bold text-white">Chat dengan Assistant</span>
              )}
            </div>
            <div className="relative">
              <button
                onClick={toggleChat}
                aria-label="Buka chat Karl Helper"
                title="Chat dengan Karl Helper"
                className="bg-zinc-900 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-md border border-white/6 hover:scale-105 active:scale-95 transition-all"
              >
                <Bot size={18} />
              </button>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">{unreadCount}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Project Detail Modal - TOP LEVEL */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
          html { scroll-behavior: smooth; }
          ::-webkit-scrollbar { width: 0px; }
        `}</style>
    </div>
  );
}
