"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { supabase, type Event, type CommunityAd } from "@/lib/supabase";

export default function HeroSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [yearsOfService, setYearsOfService] = useState<number | null>(null);
  const [communityAds, setCommunityAds] = useState<CommunityAd[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isAdHovered, setIsAdHovered] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  const sectionRef = useRef<HTMLElement>(null);


  useEffect(() => {
    const calculateHeaderHeight = () => {
      const header = document.querySelector("header");
      if (header && sectionRef.current) {
        sectionRef.current.style.paddingTop = `${header.offsetHeight + 60}px`; // Increased offset
      }
    };

    // Recalculate on mount and after a short delay to account for image loading
    setTimeout(calculateHeaderHeight, 100);
    setTimeout(calculateHeaderHeight, 500);
    setTimeout(calculateHeaderHeight, 1000); // Added another delay for robustness

    window.addEventListener("resize", calculateHeaderHeight);

    return () => {
      window.removeEventListener("resize", calculateHeaderHeight);
    };
  }, []);

  useEffect(() => {
    fetchEvents();
    fetchCommunityAds();

    // Calculate years of service on client only to avoid hydration mismatch
    const startDate = new Date(2017, 6, 1); // July 1, 2017
    const today = new Date();
    let years = today.getFullYear() - startDate.getFullYear();
    const isBeforeAnniversary = today.getMonth() < 6 || (today.getMonth() === 6 && today.getDate() < 1);
    if (isBeforeAnniversary) years--;
    setYearsOfService(years);
  }, []);

  const fetchEvents = async () => {
    if (!supabase) {
      console.warn("Supabase not initialized");
      setEvents([]);
      return;
    }
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_upcoming", true) // Only fetch upcoming events
        .order("event_date", { ascending: true })
        .limit(5);

      if (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
      } else {
        setEvents(data || []);
      }
    } catch (error) {
      console.error("Network error fetching events:", error);
      setEvents([]);
    }
  };

  const fetchCommunityAds = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("community_ads")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        setCommunityAds(data);
      }
    } catch (err) {
      console.error("Error fetching community ads:", err);
    }
  };

  // Auto-rotate ads every 10 seconds
  useEffect(() => {
    if (communityAds.length <= 1 || isAdHovered) return;
    
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % communityAds.length);
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [communityAds.length, isAdHovered]);

  const nextAd = () => {
    setCurrentAdIndex((prev) => (prev + 1) % communityAds.length);
  };

  const prevAd = () => {
    setCurrentAdIndex((prev) => (prev - 1 + communityAds.length) % communityAds.length);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = document.querySelector("header")?.offsetHeight || 80;
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  // Events for upcoming section (no duplication for restart animation)
  const upcomingEventsForDisplay = events;

  const handleNotificationMouseEnter = () => {
    setIsPaused(true);
    if (scrollContentRef.current) {
      scrollContentRef.current.style.animationPlayState = "paused";
    }
  };

  const handleNotificationMouseLeave = () => {
    setIsPaused(false);
    if (scrollContentRef.current) {
      scrollContentRef.current.style.animationPlayState = "running";
    }
  };

  return (
    <section id="home" ref={sectionRef} className="pb-16 bg-gray-50">
      <div className="px-4 sm:px-8">
        <div className="grid md:grid-cols-5 lg:grid-cols-4 gap-6 md:gap-6 lg:gap-12">
          {/* Main Hero Card - Takes 3 of 5 columns on tablet, 3 of 4 on desktop */}
          <div className="md:col-span-3 lg:col-span-3">
            <div className="grid gap-6 md:gap-8 lg:gap-12">
              {/* Hero Card - Smaller on mobile/tablet, normal on desktop */}
              {/* Hero Card - Smaller on mobile/tablet, normal on desktop */}
              <div className="hero-card h-[300px] md:h-[350px] lg:h-[500px] relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0">
                  <Image
                    src="/community-service-volunteers.png"
                    alt="Community Service"
                    fill
                    className="object-cover opacity-25"
                  />
                </div>
                <div className="relative z-10 p-2 sm:p-6 md:p-8 lg:p-16 h-full flex flex-col justify-center">
                  <h1 className="font-montserrat font-black text-3xl sm:text-4xl md:text-4xl lg:text-7xl text-white mb-2 sm:mb-4 md:mb-6 leading-tight">
                    Welcome to the
                    <br />
                    <span className="text-emerald-200">Rotary Club of</span>
                    <br />
                    <span className="text-emerald-100">
                      Gudalur Garden City
                    </span>
                  </h1>
                  <p className="text-base sm:text-lg md:text-lg lg:text-2xl text-white/95 mb-4 sm:mb-8 md:mb-10 max-w-3xl font-medium">
                    Uniting leaders, building friendships, and creating lasting
                    change in our community.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Notifications Panel - Takes 2 of 5 columns on tablet (wider) */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="sticky top-24">
              <div className="modern-card overflow-hidden h-[300px] md:h-[350px] lg:h-[500px] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex-shrink-0">
                  <h3 className="font-montserrat font-black text-base sm:text-lg lg:text-xl text-white">
                    Upcoming Events
                  </h3>
                </div>

                {/* Upcoming Events - On mobile: taps work, swipes scroll page */}
                <div
                  ref={scrollContainerRef}
                  className="flex-1 overflow-hidden relative"
                  onMouseEnter={handleNotificationMouseEnter}
                  onMouseLeave={handleNotificationMouseLeave}
                  onTouchStart={(e) => {
                    // Store starting position for swipe detection
                    if (window.innerWidth < 640) {
                      const touch = e.touches[0];
                      const target = e.currentTarget as HTMLElement;
                      target.dataset.touchStartY = touch.clientY.toString();
                      target.dataset.touchStartX = touch.clientX.toString();
                      target.dataset.isSwiping = 'false';
                    }
                  }}
                  onTouchMove={(e) => {
                    // On mobile: if swiping vertically, scroll the page
                    if (window.innerWidth < 640) {
                      const target = e.currentTarget as HTMLElement;
                      const startY = parseFloat(target.dataset.touchStartY || '0');
                      const touch = e.touches[0];
                      const deltaY = Math.abs(startY - touch.clientY);
                      
                      // Only hijack scroll if moving more than 10px (swipe, not tap)
                      if (deltaY > 10) {
                        target.dataset.isSwiping = 'true';
                        e.preventDefault();
                        const scrollDelta = startY - touch.clientY;
                        window.scrollBy(0, scrollDelta);
                        target.dataset.touchStartY = touch.clientY.toString();
                      }
                    }
                  }}
                  onWheel={(e) => {
                    // On desktop: allow wheel scroll within the panel
                    if (isPaused && scrollContainerRef.current && window.innerWidth >= 640) {
                      e.preventDefault();
                      const container = scrollContainerRef.current;
                      container.scrollTop += e.deltaY;
                    }
                  }}
                >
                  <div
                    ref={scrollContentRef}
                    className={isPaused ? "" : "animate-scroll-vertical-restart"}
                    style={{
                      animationDuration: "20s",
                    }}
                  >
                    {upcomingEventsForDisplay.map((event, index) => (
                      <div
                        key={`${event.id}-${index}`}
                        className="border-b-2 border-gray-100 pb-4 sm:pb-6 last:border-b-0 rounded-lg p-2"
                      >
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <span className="inline-block bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-2 sm:px-3 py-1 sm:py-2 rounded-full font-bold flex-shrink-0 mt-1 shadow-lg">
                            NEW
                          </span>
                          <div className="flex-1">
                            <h5 className="font-bold text-gray-900 text-sm mb-2 leading-tight">
                              {event.title}
                            </h5>
                            <p className="text-gray-600 text-xs leading-relaxed line-clamp-2 mb-2 sm:mb-3">
                              {event.description}
                            </p>
                            <div className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit">
                              <span className="mr-1">📅</span>
                              {new Date(event.event_date).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* View All Footer */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 border-t-2 border-gray-200 text-center">
                  <button
                    onClick={() => scrollToSection("events")}
                    className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors duration-300 text-sm sm:text-base"
                  >
                    &lt;&lt; View All Events &gt;&gt;
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Section + Community Ad - Side by Side */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6 md:mt-8 lg:mt-12">
          {/* About Our Club - Left Side (2 cols) */}
          <div className="lg:col-span-2 modern-card p-4 sm:p-6 lg:p-8 h-[300px] md:h-[350px] lg:h-[500px]">
          <h2 className="grand-title font-montserrat font-black text-lg sm:text-2xl lg:text-3xl mb-3 sm:mb-4">
            About Our Club
          </h2>

          <div className="space-y-2 sm:space-y-3 mb-3 lg:mb-4">
            <p className="text-gray-700 leading-relaxed text-xs sm:text-sm lg:text-base font-semibold text-justify sm:text-left">
              Rotary Club of Gudalur Garden City charted on &quot;01-July-2017&quot;
              with the set of service minded people to serve this
              community with the long-lasting change. Our few avenues of
              services are but not limited to, Ending Polio, Promoting
              peace, Fighting disease, Supporting education, Saving
              mothers & children and Protecting the environment. We,
              together build friendship with the common motto as &quot;Service
              Above Self&quot; and connect the dots to make a big impact to the
              needy people.
            </p>
            <p className="text-gray-700 leading-relaxed text-xs sm:text-sm lg:text-base font-semibold text-justify sm:text-left">
              Our club periodically conducts the camp for Blood donation,
              End-Polio, Disease prevention and other service projects in
              this vicinity. Kindly watch out event section for upcoming
              events and utilize the opportunity and support for our
              effort.
            </p>
            <button
              onClick={() => window.open("https://rotary.org", "_blank")}
              className="text-emerald-600 hover:text-emerald-700 font-bold text-xs sm:text-sm transition-colors duration-300"
            >
              Learn More About Rotary →
            </button>
          </div>

          <div className="flex flex-row gap-2 sm:gap-4 justify-center">
            {/* Active Members - Clickable */}
            <div
              onClick={() => scrollToSection("board")}
              className="bg-gradient-to-br from-teal-50 to-teal-100 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl border-2 border-teal-200 text-center cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 flex-1 max-w-[120px] sm:max-w-[140px]"
            >
              <div className="text-lg sm:text-2xl mb-0.5 sm:mb-1">👥</div>
              <h3 className="font-black text-lg sm:text-xl text-teal-600 mb-0">
                25+
              </h3>
              <p className="text-gray-700 font-semibold text-[10px] sm:text-xs">
                Active Members
              </p>
            </div>

            {/* Years of Service - Dynamic */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-2 sm:p-3 lg:p-4 rounded-lg sm:rounded-xl border-2 border-green-200 text-center flex-1 max-w-[120px] sm:max-w-[140px]">
              <div className="text-lg sm:text-2xl mb-0.5 sm:mb-1">⭐</div>
              <h3 className="font-black text-lg sm:text-xl text-green-600 mb-0">
                {yearsOfService !== null ? yearsOfService : '8'}+
              </h3>
              <p className="text-gray-700 font-semibold text-[10px] sm:text-xs">
                Years of Service
              </p>
            </div>
          </div>
          </div>

          {/* Community Ads Carousel - Right Side (1 col) */}
          {communityAds.length > 0 && (
            <div className="lg:col-span-1">
              <div
                className="modern-card overflow-hidden h-[300px] md:h-[350px] lg:h-[500px] flex flex-col relative group"
                onMouseEnter={() => setIsAdHovered(true)}
                onMouseLeave={() => setIsAdHovered(false)}
              >
                {/* Ad Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-3 text-center flex items-center justify-between">
                  <p className="text-white font-bold text-sm flex-1">Community Partner</p>
                  {communityAds.length > 1 && (
                    <span className="text-white/70 text-xs">{currentAdIndex + 1}/{communityAds.length}</span>
                  )}
                </div>
                
                {/* Ad Content with slide animation */}
                <div className="relative flex-1 overflow-hidden">
                  <div 
                    className="flex h-full transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentAdIndex * 100}%)` }}
                  >
                    {communityAds.map((ad, index) => (
                      <div
                        key={ad.id}
                        className={`relative flex-shrink-0 w-full h-full cursor-pointer ${ad.link_url ? "hover:opacity-95" : ""}`}
                        onClick={() => {
                          if (ad.link_url) {
                            window.open(ad.link_url, "_blank", "noopener,noreferrer");
                          }
                        }}
                      >
                        <Image
                          src={ad.image_url}
                          alt={ad.title}
                          fill
                          className="object-cover"
                        />
                        {ad.link_url && (
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end justify-end pb-4 pr-4">
                            <p className="text-white text-sm font-medium flex items-center gap-1 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                              Visit
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Navigation Buttons - Show on Hover */}
                {communityAds.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevAd(); }}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextAd(); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </>
                )}
                
                {/* Ad Title */}
                <div className="p-4 text-center bg-white">
                  <h4 className="font-montserrat font-bold text-gray-900 text-sm sm:text-base">
                    {communityAds[currentAdIndex]?.title}
                  </h4>
                </div>

                {/* Dot Indicators */}
                {communityAds.length > 1 && (
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {communityAds.map((_, index) => (
                      <button
                        key={index}
                        onClick={(e) => { e.stopPropagation(); setCurrentAdIndex(index); }}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentAdIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/70"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
