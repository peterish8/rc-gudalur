"use client";

import { useEffect, useState } from "react";
import kuralData from "../thirukuraljson.json";

// Define the structure from the JSON file
interface KuralJSON {
  Number: number;
  Line1: string;
  Line2: string;
  mv: string;
  Translation: string;
  // Other fields exist in JSON but not used for display
}

// Internal display interface
interface Kural {
  number: number;
  line1: string;
  line2: string;
  tamilMeaning: string;
}

// Extract the kural array from the JSON wrapper and filter 1-1080 only
const KURALS_1_TO_1080: KuralJSON[] = (kuralData.kural as KuralJSON[]).filter(
  (k) => k.Number >= 1 && k.Number <= 1080
);

// Get the kural number for today (starts with Kural 1 on Jan 1, 2026)
function getDailyKuralNumber(): number {
  const now = new Date();
  const startDate = new Date(2026, 0, 1); // Jan 1, 2026
  const diff = now.getTime() - startDate.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const daysSinceStart = Math.floor(diff / oneDay);
  // Cycle through 1080 kurals (Jan 1, 2026 = Kural 1)
  return (daysSinceStart % 1080) + 1;
}

// Get kural from local JSON by number
function getKuralByNumber(num: number): Kural | null {
  const found = KURALS_1_TO_1080.find((k) => k.Number === num);
  if (!found) return null;
  return {
    number: found.Number,
    line1: found.Line1,
    line2: found.Line2,
    tamilMeaning: found.mv,
  };
}

export default function ThirukuralSection() {
  const [kural, setKural] = useState<Kural | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const kuralNumber = getDailyKuralNumber();
    const dailyKural = getKuralByNumber(kuralNumber);
    setKural(dailyKural);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="px-4 sm:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse bg-white/80 rounded-3xl p-8 sm:p-12 shadow-xl">
              <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-8"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!kural) return null;

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 overflow-hidden">
      <div className="px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="font-montserrat font-black text-3xl sm:text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-red-600 mb-3">
              திருக்குறள்
            </h2>
            <p className="text-amber-700 font-semibold text-lg sm:text-xl">
              Wisdom of the Day
            </p>
          </div>

          {/* Main Card */}
          <div 
            className={`relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-amber-200 overflow-hidden transition-all duration-500 ${isHovered ? 'shadow-amber-300/50 scale-[1.01]' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-amber-300/30 to-transparent rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-orange-300/30 to-transparent rounded-full translate-x-20 translate-y-20"></div>
            
            {/* Kural Number Badge */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                குறள் #{kural.number}
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10 p-6 sm:p-10 lg:p-14">
              {/* Tamil Verses */}
              <div className="text-center mb-8">
                <div className="inline-block">
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 leading-relaxed mb-2 font-tamil">
                    {kural.line1}
                  </p>
                  <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 leading-relaxed font-tamil">
                    {kural.line2}
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center gap-4 my-6 sm:my-8">
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-amber-400"></div>
                <span className="text-amber-500 text-2xl">✦</span>
                <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-amber-400"></div>
              </div>

              {/* Tamil Meaning */}
              {kural.tamilMeaning && (
                <div className="text-center mb-6">
                  <p className="text-gray-800 text-lg sm:text-xl leading-relaxed font-medium">
                    {kural.tamilMeaning}
                  </p>
                </div>
              )}


            </div>

            {/* Bottom accent */}
            <div className="h-2 bg-gradient-to-r from-amber-400 via-orange-500 to-red-500"></div>
          </div>

          {/* Footer note */}
          <p className="text-center text-amber-700/70 text-sm mt-6 font-medium">
            A new kural appears every day • Composed by Thiruvalluvar
          </p>
        </div>
      </div>
    </section>
  );
}
