import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          light: '#8A9A86',
          DEFAULT: '#556B2F', // درجة الأخضر الزيتوني الفخمة للظرف والنصوص
          dark: '#3B4B20',
        },
        burgundy: {
          DEFAULT: '#5C0618', // البرغندي الملكي للأسماء العريضة
        },
        luxury: {
          cream: '#FDFBF7', // خلفية الأوف وايت الفاخرة المريحة للعين
        }
      },
      fontFamily: {
        cinematic: ['Playfair Display', 'serif'],
        elegant: ['Cinzel', 'serif'],
        arabic: ['Amiri', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;