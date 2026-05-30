'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../app/supabaseClient';

interface HeroSectionProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function HeroSection({ isOpen, setIsOpen }: HeroSectionProps) {
  const [showDetailsPage, setShowDetailsPage] = useState(false);
  const [showRSVPModal, setShowRSVPModal] = useState(false);
  
  // بيانات الفورم للحضور
  const [formData, setFormData] = useState({ name: '', phone: '', guests: '1', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // حساب الوقت المتبقي للعد التنازلي لـ 5 يوليو 2026
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('July 5, 2026 18:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 💡 الربط الحقيقي بجدول rsvps الفردي المحمي بالقواعد
      const { error } = await supabase
        .from('rsvps') 
        .insert([
          { 
            name: formData.name, 
            phone: formData.phone, 
            guests: parseInt(formData.guests), // تحويل عدد الضيوف لرقم ليقبله الجدول
            message: formData.message 
          }
        ]);

      if (error) throw error; // لو في مشكلة يروح للـ catch فوراً

      // إذا تم الحفظ بنجاح، يظهر رسالة النجاح ويفرغ الفورم
      setSubmitSuccess(true);
      
      setTimeout(() => {
        setShowRSVPModal(false);
        setSubmitSuccess(false);
        setFormData({ name: '', phone: '', guests: '1', message: '' });
      }, 2000);

    } catch (error) {
      console.error('Error saving to database:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    /* الحاوية الأساسية الثابتة للموقع */
    <div className="w-full h-screen max-h-screen overflow-hidden flex flex-col items-center justify-center select-none relative">
      <AnimatePresence mode="wait">
        
        {/* ─── المشهد الأول: الظرف المغلق ─── */}
        {!isOpen ? (
          <motion.div
            key="closed-view"
            className="w-full h-full flex flex-col items-center justify-center px-4"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 1.4 } }} 
            exit={{ y: -80, opacity: 0, transition: { duration: 1.4, ease: "easeInOut" } }} 
          >
            <div className="text-center mb-6">
              <span className="font-serif text-xs md:text-sm text-[#FDFBF7] tracking-[0.4em] block font-light italic opacity-90 mb-2">
                You're got mail from
              </span>
              <h2 className="font-['Great_Vibes',_cursive] text-5xl md:text-6xl text-[#FDFBF7] font-normal tracking-wide capitalize">
                Mohamed & Shrouk
              </h2>
            </div>

            <motion.div
              className="w-full max-w-sm md:max-w-md px-4 cursor-pointer drop-shadow-[0_25px_45px_rgba(0,0,0,0.15)]"
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.02 }}
            >
              <img src="/envelope-front.png" alt="Wedding Envelope" className="w-full h-auto object-contain rounded-xl" />
            </motion.div>

            <div className="text-center mt-10">
              <span className="font-serif text-xs text-[#FDFBF7] tracking-[0.3em] block font-light italic border-b border-[#FDFBF7]/20 pb-2 px-6">
                Tap envelope to open
              </span>
            </div>
          </motion.div>
        ) : !showDetailsPage ? (
          
         
          <motion.div
            key="open-storyboard"
            className="w-full max-w-4xl h-full relative px-2 md:px-4 flex flex-col justify-between pt-4 pb-12 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ y: -100, opacity: 0, transition: { duration: 0.8 } }}
          >
            
            {/* حاوية الصور الفخمة */}
            <div className="relative w-full flex-shrink-0 min-h-[540px] md:min-h-[620px]">
              
              {/* 1. الظرف المفتوح الكبير - 💡 تم تكبير حجمه هنا ليعطي فخامة للمشهد */}
              <motion.div 
                initial={{ x: -50, y: 20, opacity: 0, rotate: 0 }}
                animate={{ x: 0, y: 0, opacity: 1, rotate: -6 }}
                transition={{ delay: 0.1, duration: 1.1, ease: "easeOut" }}
                className="absolute top-0 left-1 w-[74%] md:w-[66%] z-10 drop-shadow-[0_15px_30px_rgba(0,0,0,0.2)]" // تكبير العرض إلى w-[74%]
              >
                <img src="/envelope-open.png" alt="Envelope Opened" className="w-full h-auto object-contain" />
              </motion.div>

              {/* 2. كارت التفاصيل الطويل المقوس - 💡 تم إرجاعه لجهة اليمين (مكانه الأصلي المتوازن) */}
              <motion.div 
                initial={{ x: 50, y: 30, opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 1.1, ease: "easeOut" }}
                className="absolute top-6 right-[-8px] md:right-[-12px] w-[58%] md:w-[52%] z-20 drop-shadow-[0_20px_40px_rgba(0,0,0,0.25)]" // إرجاعه لليمين right-[-8px]
              >
                <img src="/details-card.png" alt="Wedding Details Card" className="w-full h-auto object-contain" />
              </motion.div>

              {/* 3. الوردة الكبيرة الفخمة جداً - مستقرة في مكانها على طرف وزاوية الظرف المفتوح الأيسر */}
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 1.0, type: "spring", stiffness: 45 }}
                className="absolute top-[260px] md:top-[300px] left-0 md:left-8 z-40 flex flex-col items-center justify-center cursor-pointer"
                onClick={() => setShowDetailsPage(true)}
              >
                <motion.div
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="w-64 h-64 md:w-80 md:h-80 drop-shadow-2xl"
                >
                  <img src="/details-rose.png" alt="Burgundy Rose" className="w-full h-full object-contain" />
                </motion.div>
                <span className="font-serif text-[10px] md:text-[11px] text-[#FDFBF7] tracking-[0.2em] uppercase font-light italic mt-[-24px] md:mt-[-28px] opacity-90 z-50 relative bg-black/20 backdrop-blur-xs px-2 py-0.5 rounded-sm">
                  Tap for Details
                </span>
              </motion.div>

              {/* 4. صورتهم الفخمة المنزلة لأسفل (البجعة) */}
              <motion.div 
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.9, ease: "easeOut" }}
                className="absolute top-[280px] md:top-[320px] right-[-4px] md:right-4 z-30 w-[44%] md:w-[38%]"
              >
                <img src="/couple-photo.jpg" alt="Couple" className="w-full h-auto object-contain grayscale-10 rounded-xs shadow-md" />
              </motion.div>
            </div>

            {/* العداد التنازلي وزر الحضور المنسق بمسافة فخمة ممتازة */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="w-full flex flex-col items-center justify-center text-center z-40 mt-36 md:mt-48 pb-6 flex-shrink-0"
            >
              <h3 className="font-['Great_Vibes',_cursive] text-2xl md:text-3xl text-[#FDFBF7] mb-4 tracking-wide opacity-95">
                Counting Down to the Big Day
              </h3>

              {/* العداد التنازلي الرقمي */}
              <div className="flex items-center justify-center gap-4 md:gap-8 text-[#FDFBF7] mb-8">
                <div className="flex flex-col items-center">
                  <span className="font-serif font-light text-3xl md:text-5xl tracking-wide">{String(timeLeft.days).padStart(2, '0')}</span>
                  <span className="font-serif text-[8px] md:text-[10px] tracking-[0.2em] uppercase opacity-75 mt-1 italic">Days</span>
                </div>
                <span className="font-serif text-lg md:text-2xl font-light opacity-30 mb-4">:</span>
                <div className="flex flex-col items-center">
                  <span className="font-serif font-light text-3xl md:text-5xl tracking-wide">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="font-serif text-[8px] md:text-[10px] tracking-[0.2em] uppercase opacity-75 mt-1 italic">Hours</span>
                </div>
                <span className="font-serif text-lg md:text-2xl font-light opacity-30 mb-4">:</span>
                <div className="flex flex-col items-center">
                  <span className="font-serif font-light text-3xl md:text-5xl tracking-wide">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="font-serif text-[8px] md:text-[10px] tracking-[0.2em] uppercase opacity-75 mt-1 italic">Minutes</span>
                </div>
                <span className="font-serif text-lg md:text-2xl font-light opacity-30 mb-4">:</span>
                <div className="flex flex-col items-center">
                  <span className="font-serif font-light text-3xl md:text-5xl tracking-wide text-[#E2C799]">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="font-serif text-[8px] md:text-[10px] tracking-[0.2em] uppercase opacity-75 mt-1 italic text-[#E2C799]">Seconds</span>
                </div>
              </div>

              {/* زر تأكيد الحضور الفخم */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowRSVPModal(true)}
                className="font-serif text-xs md:text-sm tracking-[0.25em] uppercase text-[#FDFBF7] border border-[#E2C799]/40 bg-[#E2C799]/10 hover:bg-[#E2C799]/20 backdrop-blur-sm px-8 py-3 rounded-full transition-all duration-300 shadow-md cursor-pointer mb-4"
              >
                Confirm Your Attendance
              </motion.button>
            </motion.div>

          </motion.div>
        ) : (
          
          
          <motion.div
            key="details-page"
            className="fixed inset-0 w-full h-screen flex flex-col justify-between items-center z-50 overflow-hidden"
            initial={{ y: "100vh" }} 
            animate={{ y: 0 }}
            exit={{ y: "100vh" }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
          >
            <div className="absolute inset-0 w-full h-full z-0">
              <img 
                src="/details-page-bg.png" 
                alt="Wedding Details" 
                className="w-full h-full object-cover"
              />
            </div>

            <button 
              onClick={() => setShowDetailsPage(false)}
              className="absolute top-6 left-6 text-xs font-serif tracking-widest text-[#5C0618]/70 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full uppercase z-50 shadow-sm transition-all hover:scale-105"
            >
              ← Back
            </button>

            <div className="flex-1 w-full" />

            <div className="w-full max-w-sm px-6 mb-30 flex flex-col items-center text-center z-10 relative">
              <a 
                href="http://maps.google.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-white font-serif text-xs tracking-[0.35em] uppercase font-light pb-0.5 border-b border-white/40 transition-all hover:text-white/80 hover:scale-105 duration-300 block"
              >
                📍 Location
              </a>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── نافذة الـ RSVP المودال ─── */}
      <AnimatePresence>
        {showRSVPModal && (
          <motion.div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="w-full max-w-md bg-[#FDFBF7] border border-[#0D2B1D]/20 rounded-2xl p-6 md:p-8 relative shadow-2xl text-[#0D2B1D]"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
            >
              <button 
                onClick={() => setShowRSVPModal(false)}
                className="absolute top-4 right-4 font-serif text-lg text-[#0D2B1D]/60 hover:text-[#0D2B1D] transition-opacity cursor-pointer"
              >
                ✕
              </button>

              <h3 className="font-['Great_Vibes',_cursive] text-4xl text-center text-[#153B2A] mb-1">
                R.S.V.P
              </h3>
              <p className="font-serif text-[10px] tracking-[0.25em] uppercase text-center text-[#153B2A]/70 mb-6">
                Confirm Your Attendance
              </p>

              {submitSuccess ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 font-serif text-sm tracking-wide text-[#153B2A] font-medium"
                >
                  ✨ Thank you! Your response has been saved.
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 font-serif text-xs text-left">
                  <div>
                    <label className="block tracking-widest uppercase text-[#153B2A]/80 mb-1.5">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-[#0D2B1D]/5 border border-[#0D2B1D]/20 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#153B2A] text-[#0D2B1D] transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="block tracking-widest uppercase text-[#153B2A]/80 mb-1.5">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-[#0D2B1D]/5 border border-[#0D2B1D]/20 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#153B2A] text-[#0D2B1D] transition-colors"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block tracking-widest uppercase text-[#153B2A]/80 mb-1.5">Number of Guests</label>
                    <div className="relative">
                      <select 
                        value={formData.guests}
                        onChange={(e) => setFormData({...formData, guests: e.target.value})}
                        className="w-full bg-[#0D2B1D]/5 border border-[#0D2B1D]/20 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#153B2A] text-[#0D2B1D] transition-colors cursor-pointer appearance-none"
                      >
                        <option value="1">1 Person</option>
                        <option value="2">2 Persons</option>
                        <option value="3">3 Persons</option>
                        <option value="4">4 Persons</option>
                        <option value="5">5 Persons</option>
                        <option value="6">6 Persons</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#0D2B1D]/60">
                        ▼
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block tracking-widest uppercase text-[#153B2A]/80 mb-1.5">A Message for the Couple</label>
                    <textarea 
                      rows={2}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-[#0D2B1D]/5 border border-[#0D2B1D]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[#153B2A] text-[#0D2B1D] transition-colors resize-none"
                      placeholder="Write your wishes here..."
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-2 bg-[#153B2A] text-[#FDFBF7] font-semibold tracking-widest uppercase py-3 rounded-lg shadow-md transition-all hover:bg-[#0D2B1D] active:scale-[0.98] disabled:opacity-50 cursor-pointer text-center"
                  >
                    {isSubmitting ? 'Sending...' : 'Confirm Attendance'}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
