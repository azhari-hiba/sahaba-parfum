import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  const { scrollYProgress } = useScroll();
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const scrollReveal = {
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] }
  };

  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
      
      <section className="relative h-screen flex items-center justify-center px-4 overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 -left-20 w-80 h-80 bg-[#D4AF37]/10 blur-[120px] rounded-full"
        />
        
        <motion.div style={{ y: y1, opacity }} className="relative z-20 text-center">
          <motion.h1 
            initial={{ letterSpacing: "1em", opacity: 0 }}
            animate={{ letterSpacing: "-0.05em", opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="text-[38vw] md:text-[18vw] leading-none font-black bg-gradient-to-b from-[#D4AF37] via-[#F9E27E] to-[#B8860B] bg-clip-text text-transparent drop-shadow-[0_20px_50px_rgba(212,175,55,0.3)]"
          >
            306
          </motion.h1>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-3 mt-4"
          >
            <div className="h-[1px] w-12 bg-[#D4AF37]/50"></div>
            <p className="text-[#D4AF37] text-[10px] md:text-sm uppercase tracking-[0.8em] font-light">
              Sahaba Parfum
            </p>
            <div className="h-[1px] w-12 bg-[#D4AF37]/50"></div>
          </motion.div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[1px] h-12 bg-gradient-to-b from-[#D4AF37] to-transparent"
        />
      </section>

      <div className="bg-[#D4AF37] py-4 overflow-hidden rotate-[-1deg] scale-105 z-30 relative shadow-[0_0_30px_rgba(212,175,55,0.3)]">
        <div className="flex whitespace-nowrap animate-marquee">
          {[1,2,3,4,5,6].map((i) => (
            <span key={i} className="text-black text-[11px] font-black uppercase tracking-widest mx-8 flex items-center gap-4">
               من الألم إلى الأمل <span className="text-white">✦</span> 306 SAHABA PARFUM <span className="text-white">✦</span> LUXURY RESILIENCE 
            </span>
          ))}
        </div>
      </div>

      <section className="py-32 px-4 relative" dir="rtl">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            {...scrollReveal}
            className="group bg-gradient-to-br from-zinc-900/80 to-black border border-white/10 p-8 md:p-20 rounded-[3rem] backdrop-blur-xl relative overflow-hidden shadow-2xl"
          >
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#D4AF37]/5 blur-[80px] rounded-full group-hover:bg-[#D4AF37]/10 transition-colors duration-700"></div>

            <div className="relative z-10">
              <motion.span 
                whileInView={{ width: "60px" }}
                initial={{ width: 0 }}
                className="block h-1 bg-[#D4AF37] mb-8"
              />
              
              <h2 className="text-5xl md:text-8xl font-black mb-12 leading-[1.1] tracking-tight">
                عندما يصبح الالم <br />
                <span className="italic text-[#D4AF37]">عطراً يفوح</span>
              </h2>
              
              <div className="space-y-10 text-gray-200 text-xl md:text-3xl leading-relaxed font-extralight">
                <p className="hover:text-white transition-colors duration-500">
                  قبل أربع سنوات، كان "سحابة بارفان" مجرد حلم.. لكن القدر اختار لي طريقاً مغايراً. في الغرفة <span className="text-[#D4AF37] font-black underline underline-offset-8">306</span>، شاهدت أغلى ما أملك يصارع من أجل الحياة.
                </p>
                
                <div className="bg-white/5 p-8 rounded-2xl border-r-4 border-[#D4AF37] my-12">
                  <p className="text-white italic font-light leading-snug">
                    "مرّت والدتي ثم والدي من نفس الغرفة.. نفس الجدران، ونفس الرقم 306. كان الرقم يطاردني كذكرى مؤلمة، حتى قررت أن أروضه."
                  </p>
                </div>

                <p className="text-gray-400 text-lg md:text-xl leading-loose">
                  قررت أن أمزج "سحابة" (اسمي ونَسبي) مع "306" (تحدّيَّ الأكبر). حولت الألم إلى أمل، والخوف إلى فخامة. كل نفحة من عطورنا هي تحية للصمود، وتذكير بأن أجمل السحب هي التي تأتي بعد العاصفة.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <motion.div {...scrollReveal} className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-black uppercase leading-none">
              Resilience <br /><span className="text-[#D4AF37]">by Sahaba</span>
            </h2>
            <p className="text-gray-500 text-lg md:text-xl font-light">
              La chambre 306 n'est plus un souvenir sombre. Elle est devenue notre signature. Une preuve que l'élégance suprême naît de la force de l'âme.
            </p>
            <div className="flex gap-4 pt-4">
               <div className="w-2 h-2 rounded-full bg-[#D4AF37]"></div>
               <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
               <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
            </div>
          </motion.div>

          <motion.div 
            style={{ y: y2 }}
            className="relative rounded-[2rem] overflow-hidden border border-white/10 group shadow-2xl"
          >
            <div className="absolute inset-0 bg-[#D4AF37]/10 group-hover:opacity-0 transition-opacity duration-700 z-10"></div>
            <img 
              src="logo.jpeg" 
              className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2s]"
              alt="Sahaba 306"
            />
          </motion.div>
        </div>
      </section>

      <section className="py-40 px-6 text-center relative">
        <motion.div {...scrollReveal} className="relative z-10">
          <h3 className="text-[20vw] md:text-[12vw] font-black opacity-[0.03] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
            SAHABA
          </h3>
          <div className="space-y-12">
            <div className="space-y-4">
               <p className="text-[#D4AF37] font-black uppercase tracking-[0.6em] text-[10px]">L'Héritage</p>
               <p className="max-w-2xl mx-auto text-2xl md:text-4xl font-extralight text-white leading-relaxed">
                "Porter <span className="font-bold text-[#D4AF37]">306</span>، c’est porter une victoire."
               </p>
            </div>

            <div className="pt-10">
              <Link 
                to="/" 
                className="group relative inline-flex items-center justify-center px-16 py-6 overflow-hidden border border-[#D4AF37]/50 rounded-full transition-all duration-500 hover:border-[#D4AF37]"
              >
                <div className="absolute inset-0 bg-[#D4AF37] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500"></div>
                <span className="relative z-10 text-[#D4AF37] group-hover:text-black font-black uppercase text-xs tracking-[0.3em]">
                  Découvrir la Collection
                </span>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 25s linear infinite;
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #050505; }
        ::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 10px; }
        
        @media (max-width: 768px) {
          .leading-[1.1] { line-height: 1.3 !important; }
        }
      `}</style>
    </div>
  );
};

export default AboutUs;