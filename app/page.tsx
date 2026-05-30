'use client';

import React, { useState } from 'react';
import HeroSection from '../components/HeroSection';
import AudioPlayer from '../components/AudioPlayer';

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <main 
      className="min-h-screen w-full relative flex flex-col items-center justify-center px-4 overflow-y-auto bg-cover bg-center bg-no-repeat transition-all duration-1000"
      style={{ backgroundImage: "url('/background.jpg')" }} // الباك جراوند الأصلية بدون أي فلاتر فوقها
    >
      {/* 🚫 تم حذف طبقة الـ Overlay من هنا تماماً لتعود ألوان صورتك الطبيعية بنقاء 100% */}

      {/* مشغل الموسيقى يعمل في الخلفية بشكل مخفي */}
      <div className="hidden">
        <AudioPlayer audioUrl="/music.mp3" triggerPlay={isOpen} />
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-12">
        <HeroSection isOpen={isOpen} setIsOpen={setIsOpen} />

        {isOpen && (
          <div className="w-full space-y-12 mt-6 animate-fade-in text-center">
            
            
          </div>
        )}
      </div>
    </main>
  );
}