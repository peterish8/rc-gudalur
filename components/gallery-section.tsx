"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { supabase, type Event } from "@/lib/supabase"

export default function GallerySection() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [topRowPaused, setTopRowPaused] = useState(false)
  const [topRowDragging, setTopRowDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const topRowRef = useRef<HTMLDivElement>(null)
  const topStartXRef = useRef(0)
  const topScrollLeftRef = useRef(0)
  const topHasMovedRef = useRef(false)
  const resumeTimeoutRef = useRef<NodeJS.Timeout>()
  const scrollPosRef = useRef(0)

  const [isFocusMode, setIsFocusMode] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  useEffect(() => {
    const handleOpenGallery = (e: any) => {
      const eventId = e.detail;
      const eventToOpen = events.find(ev => ev.id === eventId);
      
      if (eventToOpen) {
        // Pause auto-scroll to prevent fighting
        if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
        setTopRowPaused(true);

        // Step 1: Smooth Scroll to Gallery Section
        const gallerySection = document.getElementById("gallery");
        if (gallerySection) {
            gallerySection.scrollIntoView({ behavior: "smooth", block: "start" });
        }

        // Step 2: After section scroll finishes, Smooth Scroll the Card to Center
        setTimeout(() => {
             // Smart Scroll: Always scroll Forward (Right to Left)
             // Find whether Set 0 is behind us or ahead.
             // If Set 0 is behind, target Set 1.
             let targetSuffix = 0;
             const cardSet0 = document.getElementById(`gallery-card-${eventId}-0`);
             const scrollContainer = topRowRef.current;
             
             if (cardSet0 && scrollContainer) {
                 // Check if card is to the left of current view
                 // We add a small buffer (e.g. 10px) to handle exact edges
                 if (cardSet0.offsetLeft < scrollContainer.scrollLeft) {
                     targetSuffix = 1;
                 }
             }

             const card = document.getElementById(`gallery-card-${eventId}-${targetSuffix}`);
             if (card) {
                 card.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
             }
        }, 1200); // Wait 1.2s for section scroll

        // Step 3: After card centers, Open Lightbox
        setTimeout(() => {
            openLightbox(eventToOpen);
            // Resume Auto Scroll after user views (or after lightbox opens)
            // But user is in lightbox... checking lightbox close?
            // Actually, we can resume "background" scrolling or keep it paused?
            // Better to resume after a delay so background is alive if they close light box immediately
            // But if lightbox is open, scroll doesn't matter much (covered).
            
            // Let's resume after a safe delay
            resumeTimeoutRef.current = setTimeout(() => {
                setTopRowPaused(false);
            }, 3000); 
        }, 2200); // Wait another 1s
      }
    };

    window.addEventListener("open-gallery-event", handleOpenGallery);
    return () => window.removeEventListener("open-gallery-event", handleOpenGallery);
  }, [events]);

  const fetchEvents = async () => {
    if (!supabase) {
      console.warn("Supabase not initialized")
      setEvents([])
      return
    }
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_upcoming", false) // Only completed events
        .order("event_date", { ascending: false })

      if (error) {
        console.error("Error fetching gallery events:", error)
        setEvents([])
      } else {
        if (data && data.length > 0) {
            // Duplicate for infinite scroll (Triplicate)
            setEvents([...data, ...data, ...data])
            // Kickstart scroll
            requestAnimationFrame(() => setTopRowPaused(false))
        } else {
            setEvents([])
        }
      }
    } catch (err) {
      console.error("Unexpected error fetching events:", err)
      setEvents([])
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-Scroll Loop
  useEffect(() => {
    const scrollContainer = topRowRef.current
    if (!scrollContainer || topRowPaused || topRowDragging) return

    // Sync ref with current DOM state before starting
    scrollPosRef.current = scrollContainer.scrollLeft

    let animationId: number
    const animate = () => {
      // Logic for seamless loop: When we scroll past the first set (1/3 of total width), reset to 0
      // We assume triplicated events
      // Use Ref for sub-pixel precision accumulation
      if (scrollPosRef.current >= scrollContainer.scrollWidth / 3) {
        scrollPosRef.current = 0
        scrollContainer.scrollLeft = 0
      } else {
        // Slower speed on mobile (0.4) vs Desktop (0.8)
        const isMobile = window.innerWidth < 640;
        const speed = isMobile ? 0.4 : 0.8;
        
        scrollPosRef.current += speed
        scrollContainer.scrollLeft = scrollPosRef.current
      }
      animationId = requestAnimationFrame(animate)
    }
    animationId = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationId)
  }, [topRowPaused, topRowDragging, events])

  // Row Handlers
  const handleTopRowMouseEnter = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    if (!topRowDragging) {
      setTopRowPaused(true)
    }
  }

  const handleTopRowMouseLeave = () => {
    if (!topRowDragging) {
      resumeTimeoutRef.current = setTimeout(() => {
        setTopRowPaused(false)
      }, 2000)
    }
  }

  const handleTopRowDragStart = (clientX: number) => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    setTopRowPaused(true)
    setTopRowDragging(true)
    topHasMovedRef.current = false
    topStartXRef.current = clientX
    if (topRowRef.current) {
        topScrollLeftRef.current = topRowRef.current.scrollLeft
    }
  }

  const handleTopRowDragMove = (clientX: number) => {
    if (!topRowDragging || !topRowRef.current) return
    const deltaX = Math.abs(clientX - topStartXRef.current)
    if (deltaX > 5) {
      topHasMovedRef.current = true
      const walk = (clientX - topStartXRef.current) * 2
      topRowRef.current.scrollLeft = topScrollLeftRef.current - walk
    }
  }

  const handleTopRowDragEnd = () => {
    setTopRowDragging(false)
    // Sync float ref with actual scroll position after drag
    if (topRowRef.current) {
        scrollPosRef.current = topRowRef.current.scrollLeft;
    }
    resumeTimeoutRef.current = setTimeout(() => {
        setTopRowPaused(false)
    }, 2000)
  }

  // Lightbox functions
  const openLightbox = (event: Event) => {
    setSelectedEvent(event)
    setCurrentImageIndex(0) // Start from first image
    setIsFocusMode(false)
  }

  const closeLightbox = () => {
    setSelectedEvent(null)
    setIsFocusMode(false)
  }

  const nextImage = () => {
    if (selectedEvent) {
      setIsFocusMode(false)
      const totalImages = (selectedEvent.extra_images?.length || 0) + (selectedEvent.image_url ? 1 : 0)
      setCurrentImageIndex((prev) => (prev < totalImages - 1 ? prev + 1 : 0))
    }
  }

  const prevImage = () => {
    if (selectedEvent) {
      setIsFocusMode(false)
      const totalImages = (selectedEvent.extra_images?.length || 0) + (selectedEvent.image_url ? 1 : 0)
      setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : totalImages - 1))
    }
  }

  // Helper to get all images for event
  const getEventImages = (event: Event | null) => {
    if (!event) return ["/placeholder.svg?height=600&width=800&query=event"];
    const images = [];
    if (event.image_url) images.push(event.image_url);
    if (event.extra_images) images.push(...event.extra_images);
    return images.length > 0 ? images : ["/placeholder.svg?height=600&width=800&query=event"];
  }

  return (
    <section id="gallery" className="py-20 bg-gray-50 border-t border-gray-200">
      <div className="w-full">
        <div className="container mx-auto px-4 text-center mb-16">
          <h2 className="grand-title font-montserrat font-black text-4xl sm:text-5xl lg:text-7xl mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Gallery
            </span>
          </h2>
          <p className="text-gray-600 text-lg sm:text-xl font-medium max-w-3xl mx-auto">
            Capturing moments of service, fellowship, and community impact.
          </p>
        </div>

        {/* Loading / Empty State / Content Logic */}
        {isLoading ? (
            <div className="flex justify-center items-center py-20 space-x-2">
                <div className="w-4 h-4 rounded-full bg-emerald-500/50 animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-4 h-4 rounded-full bg-emerald-500/50 animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-4 h-4 rounded-full bg-emerald-500/50 animate-bounce"></div>
            </div>
        ) : events.length === 0 ? (
           <div className="text-center py-20">
             <div className="text-6xl mb-4">📸</div>
             <p className="text-gray-500 text-xl font-medium">No gallery images found yet.</p>
             <p className="text-gray-400">Check back soon for updates!</p>
           </div>
        ) : (
          <div className="scroll-fade-container overflow-hidden py-4">
            <div
              ref={topRowRef}
              className={`flex gap-6 overflow-x-auto pb-8 scrollbar-hide ${topRowDragging ? "cursor-grabbing" : "cursor-grab"}`}
              style={{
                width: "100%",
              }}
              onMouseEnter={handleTopRowMouseEnter}
              onMouseLeave={handleTopRowMouseLeave}
              onMouseDown={(e) => handleTopRowDragStart(e.pageX)}
              onMouseMove={(e) => handleTopRowDragMove(e.pageX)}
              onMouseUp={handleTopRowDragEnd}
              onTouchStart={(e) => {
                handleTopRowDragStart(e.touches[0].clientX)
              }}
              onTouchMove={(e) => {
                if (topHasMovedRef.current) {
                  e.preventDefault()
                }
                handleTopRowDragMove(e.touches[0].clientX)
              }}
              onTouchEnd={() => {
                handleTopRowDragEnd()
              }}
            >
              {/* Duplicate events 3 times for seamless looping */}
              {[...events, ...events, ...events].map((event, index) => {
                const thumbnail = event.image_url || 
                                (event.extra_images && event.extra_images.length > 0 ? event.extra_images[0] : 
                                "/placeholder.svg?height=224&width=320&query=event");
                
                const photoCount = (event.image_url ? 1 : 0) + (event.extra_images?.length || 0);

                // Assign IDs to all sets with suffix for smart targeting
                // Set 0: -0, Set 1: -1, Set 2: -2
                const setIndex = Math.floor(index / events.length);
                const cardId = `gallery-card-${event.id}-${setIndex}`;

                return (
                  <div
                    key={`gallery-event-${event.id}-${index}`}
                    id={cardId}
                    className="flex-shrink-0 w-64 sm:w-72 md:w-80 modern-card overflow-hidden cursor-pointer group hover:shadow-2xl transition-shadow duration-300"
                    onClick={() => {
                      if (!topHasMovedRef.current) {
                        openLightbox(event)
                      }
                    }}
                  >
                     <div className="relative h-56 overflow-hidden">
                      <Image
                        src={thumbnail}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      
                      <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {photoCount}
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <p className="text-white text-sm font-semibold">Click to view album</p>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-gray-700 font-semibold line-clamp-2 text-sm">{event.title}</p>
                      <p className="text-emerald-600 text-xs font-bold mt-1">
                        {new Date(event.event_date).toLocaleDateString("en-IN", { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

       {/* Lightbox Modal (Coverflow Style) */}
        {selectedEvent && (
          <div
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col items-center justify-center overflow-hidden"
            onClick={closeLightbox}
          >
            {/* Close Button - Hides in Focus Mode */}
            <button
              onClick={closeLightbox}
              className={`absolute top-4 right-4 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-300 ${
                isFocusMode ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation Buttons - Click to exit focus & nav */}
            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className={`absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-300 ${
                isFocusMode ? "opacity-0 hover:opacity-100" : "opacity-100"
              }`}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className={`absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-300 ${
                isFocusMode ? "opacity-0 hover:opacity-100" : "opacity-100"
              }`}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* 3D Carousel Container */}
            <div 
              className="relative w-full h-[70vh] flex items-center justify-center perspective-1000"
              onClick={(e) => e.stopPropagation()} 
            >
              {getEventImages(selectedEvent).map((img, idx) => {
                const total = getEventImages(selectedEvent).length;
                
                // Calculate modular difference for infinite visual loop
                let diff = (idx - currentImageIndex + total) % total;
                // Normalize diff to be shortest distance (e.g., -1 instead of N-1)
                if (diff > total / 2) diff -= total;
                if (diff < -total / 2) diff += total;

                const isCenter = diff === 0;
                
                // Determine position classes
                let transformClass = "scale-50 opacity-0 z-0 translate-x-0 rotate-y-0 pointer-events-none hidden"; // Default hidden
                let style: React.CSSProperties = {};

                if (isCenter) {
                    transformClass = "scale-100 opacity-100 z-30 translate-x-0 rotate-y-0 cursor-zoom-in";
                    if (isFocusMode) {
                        transformClass += " scale-110 cursor-zoom-out"; // Larger in focus mode
                    }
                } else if (diff === -1) {
                    transformClass = "scale-75 opacity-60 z-20 -translate-x-[60%] rotate-y-12 cursor-pointer hover:opacity-80";
                } else if (diff === 1) {
                    transformClass = "scale-75 opacity-60 z-20 translate-x-[60%] -rotate-y-12 cursor-pointer hover:opacity-80";
                } else if (diff === -2) {
                    // Make Far Left invisible (Gone)
                    transformClass = "scale-50 opacity-0 z-10 -translate-x-[110%] rotate-y-24 pointer-events-none";
                } else if (diff === 2) {
                    // Make Far Right invisible (Incoming)
                    transformClass = "scale-50 opacity-0 z-10 translate-x-[110%] -rotate-y-24 pointer-events-none";
                }

                if (isFocusMode && !isCenter) {
                    transformClass = "scale-50 opacity-0 z-0 translate-x-0 rotate-y-0 pointer-events-none"; // Ghost mode hide
                }

                return (
                  <div
                    key={idx}
                    className={`absolute transition-all duration-500 ease-out origin-center ${transformClass}`}
                    onClick={() => {
                        if (isCenter) {
                            setIsFocusMode(!isFocusMode);
                        } else {
                            setCurrentImageIndex(idx);
                        }
                    }}
                    style={{
                        width: '800px',
                        maxWidth: '90vw',
                        height: '600px',
                        maxHeight: '70vh',
                        ...style
                    }}
                  >
                    <Image
                      src={img}
                      alt={`${selectedEvent ? selectedEvent.title : 'Event'} - Image ${idx + 1}`}
                      fill
                      className="object-contain rounded-xl shadow-2xl bg-black/20"
                    />
                  </div>
                );
              })}
            </div>

            {/* Info & Thumbnails - Hides in Focus Mode */}
            <div className={`absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center transition-all duration-500 ${isFocusMode ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"}`} onClick={(e) => e.stopPropagation()}>
                <div className="text-center mb-4">
                  <h3 className="text-white text-xl font-bold drop-shadow-md">{selectedEvent.title}</h3>
                  <p className="text-gray-300 text-sm">{currentImageIndex + 1} / {getEventImages(selectedEvent).length}</p>
                </div>

                <div className="flex gap-2 overflow-x-auto max-w-[90vw] p-2 scrollbar-hide">
                  {getEventImages(selectedEvent).map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                        idx === currentImageIndex ? "border-emerald-500 scale-110 ring-2 ring-emerald-500/50" : "border-transparent opacity-50 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`Thumb ${idx + 1}`}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
            </div>
          </div>
        )}
    </section>
  )
}
