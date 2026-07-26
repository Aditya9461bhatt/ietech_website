import { motion } from 'framer-motion';
import { ArrowRight, ArrowDown, CheckCircle2, Loader2, CheckCircle, Users, Bed, ClipboardList, DollarSign, Package, UtensilsCrossed } from 'lucide-react';
import { useGoogleInquiry } from '../hooks/useGoogleInquiry';
import { site } from '../lib/content';
import Navbar from './Navbar';
import Footer from './Footer';
import RestaurantPOS from './animations/RestaurantPOS';
import TableBoard from './animations/TableBoard';
import HotelRoomBoard from './animations/HotelRoomBoard';
import ScaledPreview from './ScaledPreview';

const content = site.useCases.restaurant;

const moduleIcons = [
  <UtensilsCrossed className="w-5 h-5" />,
  <Bed className="w-5 h-5" />,
  <Users className="w-5 h-5" />,
  <ClipboardList className="w-5 h-5" />,
  <DollarSign className="w-5 h-5" />,
  <Package className="w-5 h-5" />,
];

export default function UseCaseRestaurant({ onContactOpen }: { onContactOpen: () => void }) {
  const {
    isLoading: isGoogleLoading,
    error: googleError,
    submitted,
    submit: handleGoogleSignIn,
  } = useGoogleInquiry();
  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen text-neutral-900 dark:text-white font-sans antialiased transition-colors duration-300 relative">
      <div className="relative z-10">
        <Navbar />

        {/* ─── 1. HERO ─── */}
        <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden pt-32 md:pt-40 pb-12 transition-colors duration-300">
          <div className="container relative z-10 mx-auto px-4 text-center flex-1 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span className="text-[10px] md:text-xs font-semibold text-neutral-600 dark:text-neutral-500 uppercase tracking-[0.2em]">
                {content.hero.kicker}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-6xl lg:text-[4rem] font-medium tracking-tight text-neutral-900 dark:text-white/95 max-w-4xl mx-auto leading-[1.1] text-balance transition-colors"
            >
              {content.hero.headline}
              <span className="block mt-2 font-semibold bg-gradient-to-br from-[#E67E22] to-[#D35400] bg-clip-text text-transparent">
                {content.hero.headlineAccent}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 text-base md:text-lg lg:text-xl text-neutral-600 dark:text-neutral-500 max-w-2xl mx-auto leading-relaxed transition-colors text-balance"
            >
              {content.hero.subheadline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-12 md:mt-16 flex flex-col items-center justify-center"
            >
              {!submitted ? (
                <div className="flex flex-col items-center gap-2 relative">
                  <div className="flex items-center gap-4">
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=ceojayraj@ietech.ai&su=${content.hero.demoMailSubject}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-none bg-black text-white dark:bg-white dark:text-black px-7 py-3.5  font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 dark:hover:bg-neutral-200 hover:shadow-[0_14px_36px_rgba(250,250,250,0.2)]"
                    >
                      <span className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
                      <span className="relative uppercase text-xs font-bold tracking-[0.1em]">{content.hero.demoCta}</span>
                    </a>
                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={isGoogleLoading}
                      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-none bg-black text-white dark:bg-white dark:text-black px-7 py-3.5  font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 dark:hover:bg-neutral-200 hover:shadow-[0_14px_36px_rgba(250,250,250,0.2)] disabled:pointer-events-none disabled:opacity-60"
                    >
                      <span className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
                      {isGoogleLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="relative uppercase text-xs font-bold tracking-[0.1em]">Connecting…</span>
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden>
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                          </svg>
                          <span className="relative uppercase text-xs font-bold tracking-[0.1em]">Connect with Google</span>
                        </>
                      )}
                    </button>
                  </div>
                  {googleError && (
                    <p className="text-xs text-red-400 mt-1">{googleError}</p>
                  )}
                  <p className="text-xs text-neutral-600 dark:text-neutral-500 mt-3 font-medium">
                    {content.hero.googleNote}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div
                    className="inline-flex items-center justify-center gap-3 rounded-none border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-6 py-3 text-sm font-semibold text-neutral-900 dark:text-neutral-200 backdrop-blur-sm transition-all cursor-default"
                  >
                    <CheckCircle className="h-4 w-4 text-neutral-900 dark:text-white" />
                    {content.hero.successMessage}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>

        {/* ─── 2. WHAT WE DO + IMAGES ─── */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
            <div className="flex items-center justify-center gap-4">
              <div className="h-[1px] w-12 md:w-20 bg-neutral-800" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-[#E67E22]">
                {content.whatWeDo.kicker}
              </span>
              <div className="h-[1px] w-12 md:w-20 bg-neutral-800" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="order-2 lg:order-1 flex flex-col justify-center max-w-[500px] mx-auto lg:mx-0"
            >
              <h2 className="text-4xl lg:text-[44px] font-bold leading-[1.15] mb-6 text-neutral-900 dark:text-[#f5f5f5] tracking-tight text-balance">
                {content.whatWeDo.heading}
              </h2>
              <p className="text-[17px] lg:text-[19px] text-neutral-600 dark:text-[#a1a1aa] mb-8 leading-relaxed text-balance">
                {content.whatWeDo.paragraph}
              </p>
              <ul className="flex flex-col gap-4">
                {content.whatWeDo.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-neutral-600 dark:text-neutral-400">
                    <CheckCircle2 className="w-5 h-5 text-neutral-900 dark:text-white shrink-0 mt-0.5" />
                    <span className="text-sm md:text-base">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <div className="order-1 lg:order-2 w-full flex justify-center lg:justify-end relative h-[300px] sm:h-[400px] lg:h-[480px]">
              <div className="relative w-full max-w-[640px] h-full flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, x: -30, y: -20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute left-0 top-[5%] w-[60%] md:w-[55%] h-[60%] overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 z-10"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10" />
                  <img src="/hotel-resort.png" alt="Hotel Resort" className="w-full h-full object-cover brightness-90" />
                  <div className="absolute bottom-4 left-4 z-20">
                    <p className="text-white font-medium text-xs sm:text-sm tracking-wide drop-shadow-lg whitespace-nowrap">{content.whatWeDo.imageCaptions[0]}</p>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 30, y: 20 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  viewport={{ once: false, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                  className="absolute right-0 bottom-[5%] w-[60%] md:w-[55%] h-[60%] overflow-hidden shadow-2xl border border-black/10 dark:border-white/10 z-20"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent z-10" />
                  <img src="/restaurant-erp-demo.jpg" alt="Restaurant Management" className="w-full h-full object-cover brightness-90" />
                  <div className="absolute bottom-4 left-4 z-20">
                    <p className="text-white font-medium text-xs sm:text-sm tracking-wide drop-shadow-lg whitespace-nowrap">{content.whatWeDo.imageCaptions[1]}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 3. POS BILLING ─── */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20">
            <div className="flex items-center justify-center gap-4">
              <div className="h-[1px] w-12 md:w-20 bg-neutral-800" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-[#E67E22]">
                {content.demosKicker}
              </span>
              <div className="h-[1px] w-12 md:w-20 bg-neutral-800" />
            </div>
          </div>

          {/* Constant Top */}
          <div className="mb-12 max-w-3xl">
            <h2 className="text-[18px] md:text-[20px] font-semibold text-neutral-900 dark:text-[#f5f5f5] tracking-wide mb-3">
              {content.demoSections[0].heading}
            </h2>
            <p className="text-[15px] text-neutral-600 dark:text-[#a1a1aa] leading-relaxed mb-4">
              {content.demoSections[0].paragraph}
            </p>
            <div className="flex items-center gap-2 text-neutral-600 dark:text-[#a1a1aa]">
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              <span className="text-[13px] font-medium">{content.demoHint}</span>
            </div>
          </div>

          {/* Alternating Bottom (Screen Left, Features Right) */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="w-full lg:w-[850px] shrink-0"
            >
              <ScaledPreview width={900} height={600}>
                <RestaurantPOS />
              </ScaledPreview>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex-1 w-full flex flex-col gap-6"
            >
              {content.demoSections[0].features.map((f, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-white shrink-0" />
                  <span className="text-[16px] text-neutral-900 dark:text-neutral-200">{f}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── 4. BEFORE vs. AFTER ─── */}
        <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-[44px] font-bold leading-[1.15] text-neutral-900 dark:text-[#f5f5f5] tracking-tight mb-4">
              {content.beforeAfter.heading}
            </h2>
            <p className="text-[17px] text-neutral-600 dark:text-[#a1a1aa]">{content.beforeAfter.subheading}</p>
          </motion.div>

          <div className="flex flex-col gap-px">
            {content.beforeAfter.rows.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-px"
              >
                <div className="bg-black/5 dark:bg-white/[0.02] p-6 flex items-start gap-4">
                  <span className="text-red-500/60 text-lg mt-0.5">✕</span>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">{row.before}</p>
                </div>
                <div className="bg-black/10 dark:bg-white/[0.04] p-6 flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-green-500/70 shrink-0 mt-0.5" />
                  <p className="text-neutral-900 dark:text-neutral-200 text-sm leading-relaxed">{row.after}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── 5. TABLE MANAGEMENT ─── */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          {/* Constant Top */}
          <div className="mb-12 max-w-3xl">
            <h2 className="text-[18px] md:text-[20px] font-semibold text-neutral-900 dark:text-[#f5f5f5] tracking-wide mb-3">
              {content.demoSections[1].heading}
            </h2>
            <p className="text-[15px] text-neutral-600 dark:text-[#a1a1aa] leading-relaxed mb-4">
              {content.demoSections[1].paragraph}
            </p>
            <div className="flex items-center gap-2 text-neutral-600 dark:text-[#a1a1aa]">
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              <span className="text-[13px] font-medium">{content.demoHint}</span>
            </div>
          </div>

          {/* Bottom (Screen Left, Features Right) */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="w-full lg:w-[850px] shrink-0"
            >
              <ScaledPreview width={900} height={500}>
                <TableBoard />
              </ScaledPreview>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex-1 w-full flex flex-col gap-6"
            >
              {content.demoSections[1].features.map((f, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-white shrink-0" />
                  <span className="text-[16px] text-neutral-900 dark:text-neutral-200">{f}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── 6. HOTEL ROOM BOARD ─── */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          {/* Constant Top */}
          <div className="mb-12 max-w-3xl">
            <h2 className="text-[18px] md:text-[20px] font-semibold text-neutral-900 dark:text-[#f5f5f5] tracking-wide mb-3">
              {content.demoSections[2].heading}
            </h2>
            <p className="text-[15px] text-neutral-600 dark:text-[#a1a1aa] leading-relaxed mb-4">
              {content.demoSections[2].paragraph}
            </p>
            <div className="flex items-center gap-2 text-neutral-600 dark:text-[#a1a1aa]">
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              <span className="text-[13px] font-medium">{content.demoHint}</span>
            </div>
          </div>

          {/* Alternating Bottom (Screen Left, Features Right) */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="w-full lg:w-[850px] shrink-0"
            >
              <ScaledPreview width={900} height={500}>
                <HotelRoomBoard />
              </ScaledPreview>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex-1 w-full flex flex-col gap-6"
            >
              {content.demoSections[2].features.map((f, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-neutral-900 dark:bg-white shrink-0" />
                  <span className="text-[16px] text-neutral-900 dark:text-neutral-200">{f}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── 7. SIX INTEGRATED MODULES ─── */}
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-16 md:mb-20"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-[1px] w-12 md:w-20 bg-neutral-800" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.25em] text-[#E67E22]">
                {content.modules.kicker}
              </span>
              <div className="h-[1px] w-12 md:w-20 bg-neutral-800" />
            </div>
            <h2 className="text-4xl lg:text-[44px] font-bold leading-[1.15] text-neutral-900 dark:text-[#f5f5f5] tracking-tight mb-4">
              {content.modules.heading}
            </h2>
            <p className="text-[17px] text-neutral-600 dark:text-[#a1a1aa] max-w-2xl mx-auto">
              {content.modules.subheading}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-black/5 dark:bg-white/5">
            {content.modules.cards.map((mod, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="bg-white dark:bg-[#111111] p-8 hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-10 h-10 border border-black/10 dark:border-white/10 flex items-center justify-center text-neutral-600 dark:text-neutral-500 mb-6">
                  {moduleIcons[i]}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">{mod.title}</h3>
                <ul className="flex flex-col gap-2">
                  {mod.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-neutral-600 dark:text-neutral-500 text-sm">
                      <span className="text-neutral-900 dark:text-white mt-1.5 shrink-0">·</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>



        {/* ─── 9. BOTTOM CTA ─── */}
        <section className="py-32 relative overflow-hidden flex justify-center items-center">
          <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-5xl font-medium tracking-tight text-neutral-900 dark:text-white/95 mb-6"
            >
              {content.closing.heading}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-lg md:text-xl text-neutral-600 dark:text-neutral-500 mb-12"
            >
              {content.closing.subheading}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=ceojayraj@ietech.ai&su=${content.closing.ctaMailSubject}`}
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-none bg-black text-white dark:bg-white dark:text-black px-8 py-4  font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 dark:hover:bg-neutral-200 hover:shadow-[0_14px_36px_rgba(250,250,250,0.2)]"
              >
                <span className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-black/10 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />
                <span className="relative uppercase text-xs font-bold tracking-[0.1em]">{content.closing.ctaLabel}</span>
                <ArrowRight className="w-4 h-4 relative group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>
        </section>

        <Footer onContactOpen={onContactOpen} />
      </div>
    </div>
  );
}
