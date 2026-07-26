import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { getBlogs, site } from '../lib/content';

export default function BlogSection() {
  const posts = getBlogs();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <section id="blogs" className="py-24 relative overflow-hidden bg-black text-white">
      {/* Background styling */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(74,114,164,0.05),transparent_50%)]" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left Column - Header */}
          <div className="lg:w-1/3 flex flex-col justify-between">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-5xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1]">
                {site.blogsPage.heading.split('\n').map((line, i) => (
                  <span key={i}>{i > 0 && <br />}{line}</span>
                ))}
              </h2>
              <p className="text-neutral-400 text-sm md:text-base leading-relaxed max-w-sm mb-12">
                {site.blogsPage.blurb}
              </p>
              
              {pathname !== '/blogs' && (
                <div className="relative inline-block group cursor-pointer">
                  <div className="absolute -inset-4 bg-gradient-to-r from-[#3F618C]/20 to-[#3F618C]/0 rounded-full blur-xl group-hover:from-[#3F618C]/40 transition-all duration-500" />
                  <button
                    onClick={() => navigate('/blogs')}
                    className="relative text-sm font-bold tracking-widest uppercase flex items-center gap-2"
                  >
                    View All Blogs
                  </button>
                </div>
              )}
            </motion.div>
          </div>

          {/* Right Column - Blog List */}
          <div className="lg:w-2/3 flex flex-col gap-4">
            {posts.length === 0 ? (
              <div className="text-center py-20 border border-white/10 bg-black/50 rounded-sm">
                <h3 className="text-xl text-white font-bold mb-2">{site.blogsPage.emptyHeading}</h3>
                <p className="text-neutral-500 text-sm">{site.blogsPage.emptyMessage}</p>
              </div>
            ) : (
              posts.map((post, index) => (
                <motion.a
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  onClick={(e) => { e.preventDefault(); navigate(`/blog/${post.slug}`); }}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group flex items-start justify-between p-6 md:p-8 rounded-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3 text-[10px] md:text-xs font-bold uppercase tracking-widest mb-3">
                      <span className="text-[#3F618C]">{post.category || 'Tech'}</span>
                      <span className="w-1 h-1 rounded-full bg-neutral-600" />
                      <span className="text-neutral-500">{post.date}</span>
                    </div>
                    <h3 className="text-lg md:text-2xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors duration-300 max-w-xl">
                      {post.title}
                    </h3>
                  </div>
                  <div className="shrink-0 ml-4 mt-2">
                    <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-neutral-500 group-hover:text-[#3F618C] transition-colors duration-300" />
                  </div>
                </motion.a>
              ))
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
