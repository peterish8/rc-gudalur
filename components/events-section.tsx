"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { supabase, type Event } from "@/lib/supabase"

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  
  const openGalleryInMainSection = () => {
    if (selectedEvent) {
       // Dispatch custom event for Gallery Section to pick up
       window.dispatchEvent(new CustomEvent("open-gallery-event", { detail: selectedEvent.id }));
    }
  }
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollPosRef = useRef(0) // Ref for sub-pixel precision
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)
  const hasMovedRef = useRef(false)
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetchEvents()
    // CSS resize listener removed as speed is now calculated in loop
  }, [])

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
        .eq("is_upcoming", false) // Only fetch completed events
        .order("event_date", { ascending: true });

      if (error) {
        console.error("Error fetching events:", error);
        setEvents([]);
        setSelectedEvent(null);
      } else {
        setEvents(data || []);
        if (data && data.length > 0) {
          setSelectedEvent(data[0]);
        } else {
          setSelectedEvent(null);
        }
      }
    } catch (error) {
      console.error("Network error fetching events:", error);
      setEvents([]);
      setSelectedEvent(null);
    }
  };

  // Events to display (Triplicated for seamless loop)
  const displayEvents = [...events, ...events, ...events];

  // Auto-Scroll Loop (Replaces CSS Animation)
  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer || isPaused || isDragging || events.length === 0) return

    // Sync ref with current DOM state before starting
    scrollPosRef.current = scrollContainer.scrollLeft

    let animationId: number
    const animate = () => {
      // Logic for seamless loop: When we scroll past the first set (1/3 of total width), reset to 0
      if (scrollPosRef.current >= scrollContainer.scrollWidth / 3) {
        scrollPosRef.current = 0
        scrollContainer.scrollLeft = 0
      } else {
        // Match scroll speed with Gallery
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
  }, [isPaused, isDragging, events])

  // Interaction handlers
  const handleMouseEnter = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    setIsPaused(true)
  }

  const handleMouseLeave = () => {
    if (!isDragging) {
      resumeTimeoutRef.current = setTimeout(() => setIsPaused(false), 300)
    }
  }

  const handleInteractionStart = (clientX: number) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    hasMovedRef.current = false
    startXRef.current = clientX
    scrollLeftRef.current = scrollRef.current.scrollLeft
  }

  const handleInteractionMove = (clientX: number) => {
    if (!isDragging || !scrollRef.current) return
    const x = clientX
    const walk = (startXRef.current - x) * 1.5
    if (Math.abs(walk) > 5) hasMovedRef.current = true
    scrollRef.current.scrollLeft = scrollLeftRef.current + walk
    scrollPosRef.current = scrollRef.current.scrollLeft
  }

  const handleInteractionEnd = () => {
    setIsDragging(false)
    resumeTimeoutRef.current = setTimeout(() => setIsPaused(false), 1500)
  }

  const handleEventClick = (event: Event) => {
    if (!hasMovedRef.current) {
      setSelectedEvent(event)
    }
  }

  // Get all gallery images for the selected event
  const galleryImages = selectedEvent?.extra_images || []

  return (
    <section id="events" className="pt-10 pb-20 bg-white">
      <div className="px-4 sm:px-8">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="grand-title font-montserrat font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6">Event Details</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg lg:text-xl font-medium px-4">
            Join us in our community service initiatives and fellowship activities
          </p>
        </div>
      </div>

       {/* All Events Scrolling Section - NOW AT TOP */}
       <div className="mb-16 w-full">
          <div className="container mx-auto px-4 text-center mb-8">
            <h3 className="font-montserrat font-bold text-3xl text-gray-900">All Events</h3>
          </div>
          <div className="scroll-fade-container overflow-hidden py-4">
            <div
              ref={scrollRef}
              className={`flex gap-6 overflow-x-auto pb-4 scrollbar-hide ${isPaused ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""}`}
              style={{ width: "100%" }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseDown={(e) => handleInteractionStart(e.clientX)}
              onMouseMove={(e) => handleInteractionMove(e.clientX)}
              onMouseUp={handleInteractionEnd}
              onTouchStart={(e) => { handleMouseEnter(); handleInteractionStart(e.touches[0].clientX); }}
              onTouchMove={(e) => handleInteractionMove(e.touches[0].clientX)}
              onTouchEnd={() => { handleInteractionEnd(); handleMouseLeave(); }}
            >
              {displayEvents.map((event, index) => (
                <div
                  key={`${event.id}-${index}`}
                  className={`flex-shrink-0 w-64 h-72 sm:w-72 sm:h-76 md:w-80 md:h-80 modern-card overflow-hidden cursor-pointer group transition-all duration-300 ${
                    selectedEvent?.id === event.id ? "ring-4 ring-emerald-500 shadow-2xl" : ""
                  }`}
                  onClick={() => handleEventClick(event)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={event.image_url || (event.extra_images && event.extra_images.length > 0 ? event.extra_images[0] : "/placeholder.svg?height=224&width=336&query=community event")}
                      alt={event.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <p className="text-white text-sm font-semibold">Click to view details</p>
                    </div>
                    {selectedEvent?.id === event.id && (
                      <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        SELECTED
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="inline-block bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-bold mb-3">
                      {new Date(event.event_date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <h4 className="font-montserrat font-bold text-lg text-gray-900 mb-2">{event.title}</h4>
                    <p className="text-gray-600 line-clamp-3 mb-3 text-sm">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>

      <div className="px-4 sm:px-8">
        {/* Featured Event Display Area - NOW AT BOTTOM */}
        {selectedEvent && (
          <div className="modern-card overflow-hidden max-w-none">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative h-96 lg:h-auto">
                <Image
                  src={selectedEvent.image_url || (selectedEvent.extra_images && selectedEvent.extra_images.length > 0 ? selectedEvent.extra_images[0] : "/placeholder.svg?height=400&width=600&query=community event")}
                  alt={selectedEvent.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="inline-block bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-bold mb-6 w-fit">
                  Featured Event
                </div>
                <h3 className="font-montserrat font-black text-3xl lg:text-4xl text-gray-900 mb-4">
                  {selectedEvent.title}
                </h3>
                <p className="text-emerald-600 font-bold text-lg mb-6">
                  {new Date(selectedEvent.event_date).toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-gray-700 leading-relaxed text-lg mb-8">{selectedEvent.description}</p>
                
                {/* See More Button - Opens Gallery */}
                {galleryImages.length > 0 && (
                  <button
                    onClick={openGalleryInMainSection}
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-bold transition-colors duration-300 w-fit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    See More Photos ({galleryImages.length})
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Gallery Popup Modal */}
      {/* Gallery Popup Removed - Uses Main Gallery Section Now */}
    </section>
  )
}
