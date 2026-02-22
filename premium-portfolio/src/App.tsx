import { Github, Instagram, Mail, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { footerCopy, navLinks } from './data/content';
import { About } from '../../components/About';
import { Contact } from '../../components/Contact';
import { HeroOrb } from '../../components/HeroOrb';
import { SelectedWorks } from '../../components/SelectedWorks';
import { TechStack } from '../../components/TechStack';
import { LikesButton } from './components/interactive/LikesButton';
import { ChatWidget } from './components/chat/ChatWidget';

const navVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } },
};

function App() {
  const handleNavigate = (target: string) => {
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <div className="fixed inset-0 opacity-30 blur-[120px] pointer-events-none" aria-hidden>
        <div className="absolute -top-32 right-0 w-[420px] h-[420px] bg-purple-500/40 rounded-full" />
        <div className="absolute top-40 left-10 w-[220px] h-[220px] bg-blue-500/30 rounded-full" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10">
        <motion.header
          className="sticky top-6 z-20"
          initial="hidden"
          animate="visible"
          variants={navVariants}
        >
          <div className="glass-panel rounded-full border border-white/10 px-6 py-4 flex items-center justify-center gap-6 backdrop-blur-md bg-black/50">
            {navLinks.map((link) => (
              <button
                key={link.target}
                onClick={() => handleNavigate(link.target)}
                className="text-[11px] uppercase tracking-[0.35em] text-white/50 hover:text-white transition"
              >
                {link.label}
              </button>
            ))}
          </div>
        </motion.header>

        <main className="pb-24">
          <HeroOrb />
          <About />
          <TechStack />
          <SelectedWorks />
          <Contact />
        </main>

        <footer className="py-12 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between gap-10">
            <div className="flex flex-col gap-6">
              <LikesButton />
              <div className="flex flex-col gap-2 opacity-60">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] tracking-[0.35em] uppercase text-white/60">{footerCopy.builtLabel}</span>
                  <span className="text-sm text-white font-semibold italic uppercase">{footerCopy.builtValue}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] tracking-[0.35em] uppercase text-white/60">{footerCopy.styledLabel}</span>
                  <span className="text-sm text-white font-semibold italic uppercase">{footerCopy.styledValue}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-6">
              <div className="flex gap-4 text-white/60">
                <motion.a whileHover={{ y: -6 }} href="mailto: foxyf5188@gmail.com@gmail.com" className="hover:text-white">
                  <Mail size={18} />
                </motion.a>
                <motion.a whileHover={{ y: -6 }} href="https://t.me/karltezy" className="hover:text-white">
                  <MessageCircle size={18} />
                </motion.a>
                <motion.a whileHover={{ y: -6 }} href="https://github.com/korosp" className="hover:text-white">
                  <Github size={18} />
                </motion.a>
                <motion.a whileHover={{ y: -6 }} href="https://instagram.com/kkarlzy_" className="hover:text-white">
                  <Instagram size={18} />
                </motion.a>
              </div>
              <p className="text-[11px] tracking-[0.45em] uppercase text-white/40">{footerCopy.copyright}</p>
            </div>
          </div>
        </footer>
      </div>
      <ChatWidget />
    </div>
  );
}

export default App;
