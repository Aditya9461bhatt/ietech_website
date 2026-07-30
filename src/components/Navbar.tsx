import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Phone, MessageCircle, ChevronDown, BookOpen, Target, History, Users, Utensils, Factory, GraduationCap, ArrowRight, Menu, X } from 'lucide-react';
import Logo from './Logo';
import { useContact } from '../context/ContactContext';
import { site } from '../lib/content';

// Icons stay in code (matched by position); all text comes from content/site.json.
const ABOUT_ICONS = [BookOpen, Target, History, Users];
const SERVICES_ICONS = [Utensils, Factory, GraduationCap];
const DEFAULT_ICON = BookOpen;

const ABOUT_ITEMS = site.navbar.aboutItems.map((item, i) => {
  const Icon = ABOUT_ICONS[i] ?? DEFAULT_ICON;
  return { ...item, icon: <Icon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" /> };
});

const SERVICES_ITEMS = site.navbar.servicesItems.map((item, i) => {
  const Icon = SERVICES_ICONS[i] ?? DEFAULT_ICON;
  return { ...item, icon: <Icon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" /> };
});

const contacts = site.contacts;

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  
  const contactDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { openContact } = useContact();

  useEffect(() => {
    if (!activeMenu) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActiveMenu(null); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [activeMenu]);

  useEffect(() => {
    if (!mobileMenuOpen) setExpandedMobileMenu(null);
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contactDropdownRef.current && !contactDropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4 md:px-12 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-md border-b border-black/10 dark:border-white/10 shadow-lg transition-colors duration-300"
    >
      <motion.a
        href="/"
        onClick={(e) => { e.preventDefault(); navigate('/'); }}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        className="shrink-0 flex items-center cursor-pointer"
      >
        <Logo className="h-8 w-auto" />
      </motion.a>

      {/* Mobile Menu Toggle (Right side) */}
      <div className="flex md:hidden items-center gap-4">
        <button 
          type="button"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          className="text-neutral-900 dark:text-white hover:text-[#3F618C] transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
        </button>
      </div>

      {/* Main Navigation */}
      <div 
        className="hidden md:flex items-center gap-8 relative"
        onMouseLeave={() => setActiveMenu(null)}
      >
        
        {/* ABOUT DROPDOWN */}
        <div 
          className="relative group h-full"
          onMouseEnter={() => setActiveMenu('about')}
        >
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={activeMenu === 'about'}
            onClick={() => setActiveMenu(activeMenu === 'about' ? null : 'about')}
            className={`inline-flex items-center gap-1 text-[11px] xl:text-xs font-bold tracking-[0.15em] transition-colors duration-200 ${activeMenu === 'about' ? 'text-neutral-900 dark:text-white' : 'text-neutral-600 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}>
            ABOUT
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeMenu === 'about' ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {activeMenu === 'about' && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-[700px] max-w-[calc(100vw-2rem)] bg-neutral-50 dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-sm shadow-2xl flex"
              >
                <div className="absolute -top-6 left-0 right-0 h-6" aria-hidden="true" />
                {/* Left Side: Links */}
                <div className="w-1/2 p-6 flex flex-col gap-2 bg-white dark:bg-[#0a0a0a]">
                  {ABOUT_ITEMS.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      className="flex items-start gap-4 p-3 rounded-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors group/item"
                      onClick={() => setActiveMenu(null)}
                    >
                      <div className="mt-1 bg-black/5 dark:bg-white/5 p-2 rounded-sm group-hover/item:bg-black/10 dark:group-hover/item:bg-white/10 transition-colors">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1 group-hover/item:text-[#3F618C] transition-colors">{item.title}</h4>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-snug">{item.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                {/* Right Side: Promoted Case Study */}
                <div className="w-1/2 bg-neutral-50 dark:bg-[#111111] p-6 border-l border-black/5 dark:border-white/5 flex flex-col">
                   <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3F618C] mb-3">{site.navbar.aboutPromo.kicker}</p>
                   <Link to={site.navbar.aboutPromo.href} onClick={() => setActiveMenu(null)} className="rounded-sm border border-black/10 dark:border-white/10 overflow-hidden relative group block">
                     <div className="aspect-[4/3] relative">
                       <img src="/manufacturing-erp-demo.png" alt={site.navbar.aboutPromo.title} className="w-full h-full object-cover brightness-[0.6] group-hover:scale-105 group-hover:brightness-[0.45] transition-all duration-700" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                       <div className="absolute inset-0 flex flex-col justify-end p-5">
                         <h3 className="text-[15px] font-bold text-white leading-snug mb-1">{site.navbar.aboutPromo.title}</h3>
                         <p className="text-xs text-neutral-300 leading-relaxed">{site.navbar.aboutPromo.description}</p>
                       </div>
                     </div>
                   </Link>
                   <div className="mt-3 flex items-center gap-2">
                     <Link to={site.navbar.aboutPromo.href} onClick={() => setActiveMenu(null)} className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                       {site.navbar.aboutPromo.linkText} <ArrowRight className="w-3.5 h-3.5" />
                     </Link>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SERVICES DROPDOWN */}
        <div 
          className="relative group h-full"
          onMouseEnter={() => setActiveMenu('services')}
        >
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={activeMenu === 'services'}
            onClick={() => setActiveMenu(activeMenu === 'services' ? null : 'services')}
            className={`inline-flex items-center gap-1 text-[11px] xl:text-xs font-bold tracking-[0.15em] transition-colors duration-200 ${activeMenu === 'services' ? 'text-neutral-900 dark:text-white' : 'text-neutral-600 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white'}`}>
            SERVICES
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeMenu === 'services' ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {activeMenu === 'services' && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-6 w-[700px] max-w-[calc(100vw-2rem)] bg-neutral-50 dark:bg-[#111111] border border-black/10 dark:border-white/10 rounded-sm shadow-2xl flex"
              >
                <div className="absolute -top-6 left-0 right-0 h-6" aria-hidden="true" />
                {/* Left Side: Links */}
                <div className="w-1/2 p-6 flex flex-col gap-2 bg-white dark:bg-[#0a0a0a]">
                  {SERVICES_ITEMS.map((item) => (
                    <Link
                      key={item.title}
                      to={item.href}
                      className="flex items-start gap-4 p-3 rounded-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors group/item"
                      onClick={() => setActiveMenu(null)}
                    >
                      <div className="mt-1 bg-black/5 dark:bg-white/5 p-2 rounded-sm group-hover/item:bg-black/10 dark:group-hover/item:bg-white/10 transition-colors">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-1 group-hover/item:text-[#3F618C] transition-colors">{item.title}</h4>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-snug">{item.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                {/* Right Side: Promoted Blog Post */}
                <div className="w-1/2 bg-neutral-50 dark:bg-[#111111] p-6 border-l border-black/5 dark:border-white/5 flex flex-col">
                   <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#3F618C] mb-3">{site.navbar.servicesPromo.kicker}</p>
                   <Link to={site.navbar.servicesPromo.href} onClick={() => setActiveMenu(null)} className="rounded-sm border border-black/10 dark:border-white/10 overflow-hidden relative group block">
                     <div className="aspect-[4/3] relative">
                       <img src="/industry-cad-demo.jpg" alt={site.navbar.servicesPromo.title} className="w-full h-full object-cover brightness-[0.6] group-hover:scale-105 group-hover:brightness-[0.45] transition-all duration-700" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                       <div className="absolute inset-0 flex flex-col justify-end p-5">
                         <h3 className="text-[15px] font-bold text-white leading-snug mb-1">{site.navbar.servicesPromo.title}</h3>
                         <p className="text-xs text-neutral-300 leading-relaxed">{site.navbar.servicesPromo.description}</p>
                       </div>
                     </div>
                   </Link>
                   <div className="mt-3 flex items-center gap-2">
                     <Link to={site.navbar.servicesPromo.href} onClick={() => setActiveMenu(null)} className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors">
                       {site.navbar.servicesPromo.linkText} <ArrowRight className="w-3.5 h-3.5" />
                     </Link>
                   </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link
          to="/projects"
          className="inline-flex items-center text-[11px] xl:text-xs font-bold tracking-[0.15em] transition-colors duration-200 text-neutral-600 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          onMouseEnter={() => setActiveMenu(null)}
        >
          CASE STUDIES
        </Link>
        
        <Link
          to="/blogs"
          className="inline-flex items-center text-[11px] xl:text-xs font-bold tracking-[0.15em] transition-colors duration-200 text-neutral-600 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
          onMouseEnter={() => setActiveMenu(null)}
        >
          BLOGS
        </Link>

      </div>

      <div className="hidden md:flex items-center gap-3">
        {/* Contact Dropdown */}
        <div className="relative" ref={contactDropdownRef}>
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            type="button"
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold tracking-[0.1em] text-white bg-black dark:text-black dark:bg-white  uppercase rounded-none transition-all duration-300 hover:bg-neutral-800 dark:hover:bg-neutral-200"
          >
            CONTACT US
            <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </motion.button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 top-full mt-3 w-72 border border-black/10 dark:border-white/10 bg-white dark:bg-black shadow-2xl overflow-hidden rounded-none"
              >
                <div className="px-4 pt-4 pb-2 border-b border-black/10 dark:border-white/10">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-500">
                    Reach out directly
                  </p>
                </div>

                {contacts.map((contact, idx) => (
                  <div key={contact.name}>
                    {idx > 0 && <div className="mx-4 h-px bg-black/5 dark:bg-white/5" />}
                    <div className="px-4 py-4 hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <p className="text-xs font-bold text-neutral-900 dark:text-white mb-3">
                        {contact.name} <span className="text-neutral-600 dark:text-neutral-500 font-medium">· {contact.role}</span>
                      </p>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between group">
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(contact.email);
                              const el = document.getElementById(`copy-text-${contact.email}`);
                              if (el) {
                                el.innerText = "Copied to clipboard!";
                                setTimeout(() => { el.innerText = contact.email; }, 2000);
                              }
                            }}
                            className="inline-flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                          >
                            <Mail className="h-4 w-4 text-[#4A72A4]" />
                            <span id={`copy-text-${contact.email}`}>{contact.email}</span>
                          </button>
                          <a
                            href={`https://mail.google.com/mail/?view=cm&fs=1&to=${contact.email}&su=Inquiry%20from%20IETech%20Website`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wide bg-black text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200  px-2.5 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                            onClick={() => setDropdownOpen(false)}
                            title="Open in Gmail"
                          >
                            <svg className="h-3 w-3" viewBox="0 0 24 24" aria-hidden>
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            GMAIL
                          </a>
                        </div>
                        <a
                          href={`tel:${contact.phone}`}
                          className="inline-flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Phone className="h-4 w-4 text-[#4A72A4]" />
                          {contact.phoneDisplay}
                        </a>
                        <a
                          href={`https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(`Hi ${contact.name}, I'm interested in i.e tech's services.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <MessageCircle className="h-4 w-4 text-[#25D366]" />
                          Message on WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Menu Overlay - Accordion Style */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white dark:bg-[#0a0a0a] border-b border-black/10 dark:border-white/10 shadow-2xl flex flex-col px-6 py-8 md:hidden max-h-[calc(100vh-4rem)] overflow-y-auto min-h-[calc(100vh-4rem)]"
          >
            <div className="flex flex-col gap-8">
              
              {/* ABOUT Accordion */}
              <div className="flex flex-col">
                <button 
                  className="flex items-center justify-between text-2xl font-medium text-neutral-900 dark:text-white hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors text-left"
                  onClick={() => setExpandedMobileMenu(expandedMobileMenu === 'about' ? null : 'about')}
                >
                  About
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expandedMobileMenu === 'about' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {expandedMobileMenu === 'about' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden flex flex-col gap-4 mt-4 pl-4 border-l border-black/10 dark:border-white/10"
                    >
                      {ABOUT_ITEMS.map((item) => (
                        <Link
                          key={item.title}
                          to={item.href}
                          className="text-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* SERVICES Accordion */}
              <div className="flex flex-col">
                <button 
                  className="flex items-center justify-between text-2xl font-medium text-neutral-900 dark:text-white hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors text-left"
                  onClick={() => setExpandedMobileMenu(expandedMobileMenu === 'services' ? null : 'services')}
                >
                  Services
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${expandedMobileMenu === 'services' ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {expandedMobileMenu === 'services' && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden flex flex-col gap-4 mt-4 pl-4 border-l border-black/10 dark:border-white/10"
                    >
                      {SERVICES_ITEMS.map((item) => (
                        <Link
                          key={item.title}
                          to={item.href}
                          className="text-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.title}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Direct Links */}
              <Link
                to="/projects"
                className="text-2xl font-medium text-neutral-900 dark:text-white hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Case Studies
              </Link>
              
              <Link
                to="/blogs"
                className="text-2xl font-medium text-neutral-900 dark:text-white hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Blog
              </Link>

              <button 
                className="text-2xl font-medium text-neutral-900 dark:text-white hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors text-left" 
                onClick={() => {
                  setMobileMenuOpen(false);
                  openContact();
                }}
              >
                Contact Us
              </button>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
