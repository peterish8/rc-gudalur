"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { supabase, type ContactSubmission } from "@/lib/supabase"

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
]

// Get the kural number for today (1-1330 based on day of year)
function getDailyKuralNumber(): number {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 0)
  const diff = now.getTime() - startOfYear.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  const dayOfYear = Math.floor(diff / oneDay)
  return (dayOfYear % 1330) + 1
}

// Get fallback kural based on day of year
function getFallbackKural(): Kural {
  const now = new Date()
  const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
  return FALLBACK_KURALS[dayOfYear % FALLBACK_KURALS.length]
}

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactSubmission>({
    name: "",
    email: "",
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
        // Use the tamil-kural-api which has a built-in daily kural endpoint
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
      const { error } = await supabase.from("contact_form_submissions").insert([formData])

      if (error) {
        throw error
      }

      setSubmitStatus("success")
      setFormData({ name: "", email: "", phone: "", message: "" })
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
    <section id="contact" className="py-16 sm:py-20 bg-gray-50">
      <div className="px-4 sm:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="grand-title font-montserrat font-black text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6">Get In Touch</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg sm:text-xl font-medium">
            Ready to make a difference? Join us or learn more about our initiatives
          </p>
        </div>

        {/* 50/50 Grid Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
          
          {/* Left Side - Thirukural */}
          <div className="flex flex-col">
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-3xl p-6 sm:p-8 lg:p-10 border-2 border-amber-200 shadow-xl h-full flex flex-col justify-center">
              {/* Header */}
              <div className="text-center mb-6">
                <h3 className="font-montserrat font-black text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-orange-600 to-red-600 mb-2">
                  திருக்குறள்
                </h3>
                <p className="text-amber-700 font-semibold text-sm sm:text-base">
                  Wisdom of the Day
                </p>
              </div>

              {kuralLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-amber-200 rounded w-3/4 mx-auto"></div>
                  <div className="h-6 bg-amber-200 rounded w-2/3 mx-auto"></div>
                </div>
              ) : kural && (
                <>
                  {/* Kural Number Badge */}
                  <div className="text-center mb-4">
                    <span className="inline-block bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-lg">
                      குறள் #{kural.number}
                    </span>
                  </div>

                  {/* Tamil Verses */}
                  <div className="text-center mb-6">
                    <p className="text-xl sm:text-2xl font-bold text-gray-800 leading-relaxed mb-1">
                      {kural.line1}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800 leading-relaxed">
                      {kural.line2}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center justify-center gap-3 my-4">
                    <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-transparent to-amber-400"></div>
                    <span className="text-amber-500 text-xl">✦</span>
                    <div className="h-px flex-1 max-w-[60px] bg-gradient-to-l from-transparent to-amber-400"></div>
                  </div>

                  {/* English Translation */}
                  <div className="text-center mb-4">
                    <p className="text-gray-700 text-base sm:text-lg leading-relaxed italic">
                      "{kural.translation}"
                    </p>
                  </div>

                  {/* Chapter */}
                  {kural.chapter && (
                    <div className="text-center">
                      <span className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                        {kural.chapter}
                      </span>
                    </div>
                  )}
                </>
              )}

              {/* Footer note */}
              <p className="text-center text-amber-600/70 text-xs mt-6 font-medium">
                A new kural every day • By Thiruvalluvar
              </p>
            </div>
          </div>

          {/* Right Side - Connect With Us */}
          <div className="flex flex-col">
            <div className="modern-card p-6 sm:p-8 lg:p-10 h-full flex flex-col justify-center">
              <h3 className="font-montserrat font-bold text-2xl sm:text-3xl text-gray-900 mb-6 sm:mb-8">Connect With Us</h3>

              <div className="flex flex-col gap-4">
                <a
                  href="https://www.facebook.com/rotarygudalur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 sm:space-x-6 p-4 sm:p-6 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors duration-300 group"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.243-1.333 1.501-1.333h2.499v-5h-4c-4.072 0-5 2.417-5 5.333v2.667z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base sm:text-lg">Facebook</h4>
                    <p className="text-gray-600 text-sm sm:text-base">@rotarygudalur</p>
                  </div>
                </a>

                <a
                  href="https://www.youtube.com/@rotarygudalur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 sm:space-x-6 p-4 sm:p-6 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors duration-300 group"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base sm:text-lg">YouTube</h4>
                    <p className="text-gray-600 text-sm sm:text-base">@rotarygudalur</p>
                  </div>
                </a>

                <a
                  href="https://www.instagram.com/rotary_club_gdr_garden_city?utm_source=qr&igsh=MWpidHd3bXBmMWJkNQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-4 sm:space-x-6 p-4 sm:p-6 bg-pink-50 rounded-2xl hover:bg-pink-100 transition-colors duration-300 group"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-base sm:text-lg">Instagram</h4>
                    <p className="text-gray-600 text-sm sm:text-base">@rotarygudalur</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
