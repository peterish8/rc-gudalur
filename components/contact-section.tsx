"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface Kural {
  number: number
  line1: string
  line2: string
  translation: string
  chapter: string
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
  },
  {
    number: 208,
    line1: "தீயவை செய்தார் கெடுதல் நிழல்தன்னை",
    line2: "வீயாது அடிஉறைந் தற்று",
    translation: "Destruction will dwell at the heels of those who commit evil even as their shadow that leaves them not.",
    chapter: "Fear of Doing Evil"
  }
]

// Get fallback kural based on day of year
function getFallbackKural(): Kural {
  const now = new Date()
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  return FALLBACK_KURALS[dayOfYear % FALLBACK_KURALS.length]
}

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  
  // Thirukural state
  const [kural, setKural] = useState<Kural | null>(null)
  const [kuralLoading, setKuralLoading] = useState(true)

  useEffect(() => {
    const fetchKural = async () => {
      try {
        const response = await fetch(
          `https://tamil-kural-api.vercel.app/api/daily`
        )
        
        if (response.ok) {
          const data = await response.json()
          setKural({
            number: data.number || 1,
            line1: data.kural?.[0] || "",
            line2: data.kural?.[1] || "",
            translation: data.meaning?.en || "",
            chapter: data.chapter || ""
          })
        } else {
          throw new Error("API failed")
        }
      } catch (error) {
        console.log("Using fallback kural:", error)
        setKural(getFallbackKural())
      } finally {
        setKuralLoading(false)
      }
    }

    fetchKural()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const { error } = await supabase.from("contact_submissions").insert([{
        name: formData.name,
        phone: formData.phone,
        message: formData.message,
      }])

      if (error) {
        throw error
      }

      setSubmitStatus("success")
      setFormData({ name: "", phone: "", message: "" })
    } catch (error) {
      console.error("Error submitting form:", error)
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <section id="contact" className="py-10 sm:py-12 bg-gray-50">
      <div className="px-4 sm:px-8 lg:px-10">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="grand-title font-montserrat font-black text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3">Get In Touch</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base font-medium">
            Ready to make a difference? Join us or learn more about our initiatives
          </p>
        </div>

        {/* Main 50/50 Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 mb-8">
          
          {/* Left Side - Thirukural */}
          <div className="flex flex-col">
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-xl p-4 sm:p-6 lg:p-8 border border-amber-200 shadow-md h-full flex flex-col justify-center">
              {/* Header */}
              <div className="text-center mb-4">
                <h3 className="font-montserrat font-black text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-red-600 mb-1">
                  திருக்குறள்
                </h3>
                <p className="text-amber-700 font-semibold text-xs sm:text-sm">
                  Wisdom of the Day
                </p>
              </div>

              {kuralLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-amber-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-8 bg-amber-200 rounded w-2/3 mx-auto"></div>
                </div>
              ) : kural && (
                <>
                  {/* Kural Number Badge */}
                  <div className="text-center mb-3">
                    <span className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full font-bold text-xs shadow-sm">
                      குறள் #{kural.number}
                    </span>
                  </div>

                  {/* Tamil Verses */}
                  <div className="text-center mb-4">
                    <p className="text-lg sm:text-xl font-bold text-gray-800 leading-relaxed mb-0.5">
                      {kural.line1}
                    </p>
                    <p className="text-lg sm:text-xl font-bold text-gray-800 leading-relaxed">
                      {kural.line2}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center justify-center gap-2 my-3">
                    <div className="h-px flex-1 max-w-[40px] bg-gradient-to-r from-transparent to-amber-400"></div>
                    <span className="text-amber-500 text-base">✦</span>
                    <div className="h-px flex-1 max-w-[40px] bg-gradient-to-l from-transparent to-amber-400"></div>
                  </div>

                  {/* English Translation */}
                  <div className="text-center mb-3">
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed italic">
                      "{kural.translation}"
                    </p>
                  </div>

                  {/* Chapter */}
                  {kural.chapter && (
                    <div className="text-center">
                      <span className="inline-block bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                        {kural.chapter}
                      </span>
                    </div>
                  )}
                </>
              )}

              {/* Footer note */}
              <p className="text-center text-amber-600/70 text-xs mt-4 font-medium">
                A new kural every day
              </p>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="flex flex-col">
            <div className="modern-card p-4 sm:p-6 lg:p-8 h-full flex flex-col justify-center">
              <h3 className="font-montserrat font-bold text-xl sm:text-2xl text-gray-900 mb-1">Contact Us</h3>
              <p className="text-gray-600 text-xs sm:text-sm mb-4">
                Have questions? Fill out the form below.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all duration-300 text-gray-900 text-sm"
                  />
                </div>

                {/* Phone Field */}
                <div>
                  <label htmlFor="phone" className="block text-xs font-semibold text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="Enter your phone number"
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all duration-300 text-gray-900 text-sm"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={2}
                    placeholder="Tell us how we can help..."
                    className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200 transition-all duration-300 text-gray-900 text-sm resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-300 text-sm shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>

                {/* Status Messages */}
                {submitStatus === "success" && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg text-center text-xs font-semibold">
                    ✓ Thank you! We'll contact you soon.
                  </div>
                )}
                {submitStatus === "error" && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-center text-xs font-semibold">
                    ✗ Something went wrong. Please try again.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>

        {/* Bottom - Social Links */}
        <div className="flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-12">
          <a
            href="https://www.facebook.com/rotarygudalur"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-4 p-4 sm:p-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.243-1.333 1.501-1.333h2.499v-5h-4c-4.072 0-5 2.417-5 5.333v2.667z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-base sm:text-lg">Facebook</h4>
              <p className="text-gray-500 text-sm">@rotarygudalur</p>
            </div>
          </a>

          <a
            href="https://www.youtube.com/@rotarygudalur"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-4 p-4 sm:p-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-base sm:text-lg">YouTube</h4>
              <p className="text-gray-500 text-sm">@rotarygudalur</p>
            </div>
          </a>

          <a
            href="https://www.instagram.com/rotary_club_gdr_garden_city?utm_source=qr&igsh=MWpidHd3bXBmMWJkNQ=="
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-4 p-4 sm:p-5 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group border border-gray-100"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-base sm:text-lg">Instagram</h4>
              <p className="text-gray-500 text-sm">@rotarygudalur</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}
