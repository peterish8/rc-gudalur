"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { supabase, type Event } from "@/lib/supabase";

export default function HeroSection() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const notificationScrollRef = useRef<HTMLDivElement>(null);

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
  }, []);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
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

  // Create duplicated events for seamless loop
  const duplicatedEvents = [...events, ...events, ...events];

  const handleNotificationMouseEnter = () => {
    setIsPaused(true);
    if (notificationScrollRef.current) {
      notificationScrollRef.current.style.animationPlayState = "paused";
    }
  };

  const handleNotificationMouseLeave = () => {
    setIsPaused(false);
    if (notificationScrollRef.current) {
      notificationScrollRef.current.style.animationPlayState = "running";
    }
  };

  return (
    <section id="home" ref={sectionRef} className="pb-16 bg-gray-50">
      <div className="px-4 sm:px-8">
        <div className="grid lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Main Hero Card - Takes 3 columns */}
          <div className="lg:col-span-3">
            <div className="grid gap-8 lg:gap-12">
              {/* Hero Card - Enhanced mobile height and padding */}
              <div className="hero-card h-[650px] sm:h-[500px] relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0">
                  <Image
                    src="/community-service-volunteers.png"
                    alt="Community Service"
                    fill
                    className="object-cover opacity-25"
                  />
                </div>
                <div className="relative z-10 p-8 sm:p-8 lg:p-16 h-full flex flex-col justify-center">
                  <h1 className="font-montserrat font-black text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white mb-4 sm:mb-6 leading-tight">
                    Welcome to the
                    <br />
                    <span className="text-emerald-200">Rotary Club of</span>
                    <br />
                    <span className="text-emerald-100">
                      Gudalur Garden City
                    </span>
                  </h1>
                  <p className="text-lg sm:text-xl lg:text-2xl text-white/95 mb-8 sm:mb-10 max-w-3xl font-medium">
                    Uniting leaders, building friendships, and creating lasting
                    change in our community.
                  </p>
                </div>
              </div>

              {/* About Section Card */}
              <div className="modern-card p-6 sm:p-8 lg:p-12">
                <h2 className="grand-title font-montserrat font-black text-3xl sm:text-4xl lg:text-5xl mb-6 sm:mb-8">
                  About Our Club
                </h2>

                {/* Full text at the top */}
                <div className="space-y-4 sm:space-y-6 mb-8 lg:mb-12">
                  <p className="text-gray-700 leading-relaxed text-lg sm:text-xl font-bold">
                    Rotary Club of Gudalur Garden City charted on "01-July-2017"
                    with the set of service minded people to serve this
                    community with the long-lasting change. Our few avenues of
                    services are but not limited to, Ending Polio, Promoting
                    peace, Fighting disease, Supporting education, Saving
                    mothers & children and Protecting the environment. We,
                    together build friendship with the common motto as "Service
                    Above Self" and connect the dots to make a big impact to the
                    needy people.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-lg sm:text-xl font-bold">
                    Our club periodically conducts the camp for Blood donation,
                    End-Polio, Disease prevention and other service projects in
                    this vicinity. Kindly watch out event section for upcoming
                    events and utilize the opportunity and support for our
                    effort.
                  </p>
                  <button
                    onClick={() => window.open("https://rotary.org", "_blank")}
                    className="text-emerald-600 hover:text-emerald-700 font-bold text-base sm:text-lg transition-colors duration-300"
                  >
                    Learn More About Rotary →
                  </button>
                </div>

                {/* Two info boxes at the bottom */}
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center">
                  {/* Active Members - Clickable */}
                  <div
                    onClick={() => scrollToSection("board")}
                    className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 sm:p-8 rounded-2xl border-2 border-teal-200 text-center cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 min-w-[200px]"
                  >
                    <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">👥</div>
                    <h3 className="font-black text-2xl sm:text-3xl text-teal-600 mb-1 sm:mb-2">
                      25+
                    </h3>
                    <p className="text-gray-700 font-semibold text-sm sm:text-base">
                      Active Members
                    </p>
                  </div>

                  {/* Years of Service - Dynamic */}
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 sm:p-8 rounded-2xl border-2 border-green-200 text-center min-w-[200px]">
                    <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">⭐</div>
                    <h3 className="font-black text-2xl sm:text-3xl text-green-600 mb-1 sm:mb-2">
                      {(() => {
                        const startDate = new Date(2017, 6, 1); // July 1, 2017
                        const today = new Date();
                        let years =
                          today.getFullYear() - startDate.getFullYear();
                        const isBeforeAnniversary =
                          today.getMonth() < 6 ||
                          (today.getMonth() === 6 && today.getDate() < 1);
                        if (isBeforeAnniversary) years--;
                        return years;
                      })()}
                      +
                    </h3>
                    <p className="text-gray-700 font-semibold text-sm sm:text-base">
                      Years of Service
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications Panel - Mobile optimized */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="modern-card overflow-hidden h-full">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
                  <h3 className="font-montserrat font-black text-base sm:text-lg lg:text-xl text-white">
                    Upcoming Events
                  </h3>
                </div>

                {/* Auto-scrolling Content - Mobile optimized height */}
                <div
                  ref={scrollContainerRef}
                  className="h-[400px] sm:h-[600px] lg:h-[800px] overflow-y-auto scrollbar-hide cursor-pointer"
                  onMouseEnter={handleNotificationMouseEnter}
                  onMouseLeave={handleNotificationMouseLeave}
                  onWheel={(e) => {
                    if (isPaused && scrollContainerRef.current) {
                      e.preventDefault();
                      scrollContainerRef.current.scrollTop += e.deltaY;
                    }
                  }}
                >
                  <div
                    ref={notificationScrollRef}
                    className={`p-4 sm:p-6 space-y-4 sm:space-y-6 ${
                      isPaused ? "" : "animate-scroll-vertical"
                    }`}
                    style={{
                      animationDuration: "30s",
                    }}
                  >
                    {duplicatedEvents.map((event, index) => (
                      <div
                        key={`${event.id}-${index}`}
                        className="border-b-2 border-gray-100 pb-4 sm:pb-6 last:border-b-0 cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200"
                        onClick={() => scrollToSection("events")}
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
                            <p className="text-emerald-600 text-xs font-bold">
                              {new Date(event.event_date).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </p>
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
      </div>
    </section>
  );
}
