"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { supabase, type Event } from "@/lib/supabase"

export default function EventsSection() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
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

  // Create duplicated events for seamless loop
  const duplicatedEvents = [...events, ...events, ...events]

  const handleEventClick = (event: Event) => {
    if (!isDragging) {
      setSelectedEvent(event)
    }
  }

  const handleInteractionStart = (clientX: number) => {
    setIsPaused(true)
    setIsDragging(true)
    if (scrollRef.current) {
      // Pause animation using animationPlayState
      scrollRef.current.style.animationPlayState = "paused"
      startXRef.current = clientX - scrollRef.current.offsetLeft
      scrollLeftRef.current = scrollRef.current.scrollLeft
    }
  }

  const handleInteractionMove = (clientX: number) => {
    if (!isDragging || !scrollRef.current) return
    const x = clientX - scrollRef.current.offsetLeft
    const walk = (x - startXRef.current) * 2
    scrollRef.current.scrollLeft = scrollLeftRef.current - walk
  }

  const handleInteractionEnd = () => {
    setIsDragging(false)
  }

  const handleMouseEnter = () => {
    if (!isDragging) {
      setIsPaused(true)
      if (scrollRef.current) {
        // Pause animation at current position
        scrollRef.current.style.animationPlayState = "paused"
      }
    }
  }

  const handleMouseLeave = () => {
    if (!isDragging) {
      setIsPaused(false)
      if (scrollRef.current) {
        // Resume animation from current position
        scrollRef.current.style.animationPlayState = "running"
      }
    }
  }

  return (
    <section id="events" className="pt-10 pb-20 bg-white">
      <div className="px-4 sm:px-8">
        <div className="text-center mb-16">
          <h2 className="grand-title font-montserrat font-black text-6xl mb-6">Our Events</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-xl font-medium">
            Join us in our community service initiatives and fellowship activities
          </p>
        </div>

        {/* Featured Event Display Area - Expanded Width */}
        {selectedEvent && (
          <div className="modern-card overflow-hidden mb-16 max-w-none">
            <div className="grid lg:grid-cols-2 gap-0">
              <div className="relative h-96 lg:h-auto">
                <Image
                  src={selectedEvent.image_url || "/placeholder.svg?height=400&width=600&query=community event"}
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
              </div>
            </div>
          </div>
        )}

        {/* Scrolling Events Section with Fade Effects */}
        <div>
          <h3 className="font-montserrat font-bold text-3xl text-gray-900 text-center mb-8">All Events</h3>
          <div className="scroll-fade-container bg-white overflow-hidden py-4">
            <div
              ref={scrollRef}
              className={`flex gap-6 animate-scroll-right ${isPaused ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""}`}
              style={{
                animationDuration: "40s",
                width: "fit-content",
                animationPlayState: isPaused ? "paused" : "running",
                animationIterationCount: "infinite",
              }}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onMouseDown={(e) => handleInteractionStart(e.pageX)}
              onMouseMove={(e) => handleInteractionMove(e.pageX)}
              onMouseUp={handleInteractionEnd}
              onTouchStart={(e) => {
                e.preventDefault()
                handleInteractionStart(e.touches[0].clientX)
              }}
              onTouchMove={(e) => {
                e.preventDefault()
                handleInteractionMove(e.touches[0].clientX)
              }}
              onTouchEnd={(e) => {
                e.preventDefault()
                handleInteractionEnd()
              }}
              onWheel={(e) => {
                if (isPaused && scrollRef.current) {
                  scrollRef.current.scrollLeft += e.deltaY
                }
              }}
            >
              {duplicatedEvents.map((event, index) => (
                <div
                  key={`${event.id}-${index}`}
                  className={`flex-shrink-0 w-80 h-80 modern-card overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-2xl ${
                    selectedEvent?.id === event.id ? "ring-4 ring-emerald-500 shadow-2xl" : ""
                  }`}
                  onClick={() => handleEventClick(event)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={event.image_url || "/placeholder.svg?height=224&width=336&query=community event"}
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
      </div>
    </section>
  )
}
