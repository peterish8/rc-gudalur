"use client";

import { useEffect, useState } from "react";

interface Kural {
  number: number;
  line1: string;
  line2: string;
  translation: string;
  chapter: string;
}

// 10 hardcoded fallback kurals (famous ones)
const FALLBACK_KURALS: Kural[] = [
  {
    number: 1,
    line1: "அகர முதல எழுத்தெல்லாம் ஆதி",
    line2: "பகவன் முதற்றே உலகு",
    translation: "As all letters have 'A' as their origin, so does the world have the eternal God as its origin.",
    chapter: "The Praise of God"
  },
  {
    number: 50,
    line1: "இன்சொலால் ஈரம் அளைஇப் படிறிலவாம்",
    line2: "செம்பொருள் கண்டார்வாய்ச் சொல்",
    translation: "The words of the wise are gentle, moist with kindness, and free from deceit.",
    chapter: "Sweet Speech"
  },
  {
    number: 101,
    line1: "பிறனில் விழையாமை என்பான் சிறந்த",
    line2: "நன்மையின் நன்மையா தொன்று",
    translation: "Not to covet another's wife is a virtue that excels all other virtues.",
    chapter: "Not Coveting Another's Wife"
  },
  {
    number: 391,
    line1: "கற்க கசடறக் கற்பவை கற்றபின்",
    line2: "நிற்க அதற்குத் தக",
    translation: "Learn thoroughly what should be learnt, and let your conduct be worthy of your learning.",
    chapter: "Learning"
  },
  {
    number: 396,
    line1: "தொட்டனைத் தூறும் மணற்கேணி மாந்தர்க்குக்",
    line2: "கற்றனைத் தூறும் அறிவு",
    translation: "Just as water springs forth higher when you dig deeper in sand, so does knowledge increase with learning.",
    chapter: "Learning"
  },
  {
    number: 611,
    line1: "ஆள்வினையும் ஆன்ற அறிவும் என இரண்டின்",
    line2: "நீள்வினையால் நீளும் குடி",
    translation: "A family will flourish that possesses both industry and knowledge.",
    chapter: "Effort"
  },
  {
    number: 662,
    line1: "வினைக்கண் வினைகெடல் ஓம்பல் வினைக்குறை",
    line2: "தீர்ந்தாரின் தீர்ந்தன்று உலகு",
    translation: "Beware of failure in the midst of action; the world abandons those who abandon their work.",
    chapter: "Energy in Action"
  },
  {
    number: 755,
    line1: "படைகுடி கூழ்அமைச்சு நட்பரண் ஆறும்",
    line2: "உடையான் அரசருள் ஏறு",
    translation: "He is the lion among kings who possesses the six essentials: army, subjects, wealth, ministers, allies, and forts.",
    chapter: "The Essentials of a State"
  },
  {
    number: 983,
    line1: "இன்மையின் இன்னாதது யாதெனின் இன்மையின்",
    line2: "இன்மையே இன்னா தது",
    translation: "What is more painful than poverty? Nothing is more painful than poverty itself.",
    chapter: "Poverty"
  },
  {
    number: 1330,
    line1: "ஊடுதல் காமத்திற்கு இன்பம் அதற்கின்பம்",
    line2: "கூடி முயங்கப் பெறின்",
    translation: "Feigned anger is the delight of love; and the making-up thereafter is its supreme joy.",
    chapter: "The Pleasures of Temporary Variance"
  }
];

// Get the kural number for today (1-1330 based on day of year)
function getDailyKuralNumber(): number {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  // Cycle through 1330 kurals
  return (dayOfYear % 1330) + 1;
}

// Get fallback kural based on day of year
function getFallbackKural(): Kural {
  const now = new Date();
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return FALLBACK_KURALS[dayOfYear % FALLBACK_KURALS.length];
}

export default function ThirukuralSection() {
  const [kural, setKural] = useState<Kural | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchKural = async () => {
      const kuralNumber = getDailyKuralNumber();
      
      try {
        // Try the Vercel API first
        const response = await fetch(
          `https://api-thirukkural.vercel.app/api?num=${kuralNumber}`,
          { next: { revalidate: 86400 } } // Cache for 24 hours
        );
        
        if (response.ok) {
          const data = await response.json();
          setKural({
            number: data.number || kuralNumber,
            line1: data.line1 || data.kural?.line1 || "",
            line2: data.line2 || data.kural?.line2 || "",
            translation: data.eng || data.translation?.en || data.english || "",
            chapter: data.section?.eng || data.chapter || ""
          });
        } else {
          throw new Error("API failed");
        }
      } catch (error) {
        console.log("Using fallback kural:", error);
        setKural(getFallbackKural());
      } finally {
        setLoading(false);
      }
    };

    fetchKural();
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

              {/* English Translation */}
              <div className="text-center">
                <p className="text-gray-700 text-lg sm:text-xl lg:text-2xl leading-relaxed italic max-w-3xl mx-auto">
                  "{kural.translation}"
                </p>
              </div>

              {/* Chapter */}
              {kural.chapter && (
                <div className="text-center mt-6">
                  <span className="inline-block bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold">
                    {kural.chapter}
                  </span>
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
