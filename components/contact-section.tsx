"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import kuralData from "../thirukuraljson.json"

// Define the structure from the JSON file
interface KuralJSON {
  Number: number
  Line1: string
  Line2: string
  mv: string
}

// Internal display interface
interface Kural {
  number: number
  line1: string
  line2: string
  tamilMeaning: string
}

// Extract the kural array from the JSON wrapper and filter 1-1080 only
const KURALS_1_TO_1080: KuralJSON[] = (kuralData.kural as KuralJSON[]).filter(
  (k) => k.Number >= 1 && k.Number <= 1080
)

// Get the kural number for today (starts with Kural 1 on Jan 1, 2026)
function getDailyKuralNumber(): number {
  const now = new Date()
  const startDate = new Date(2026, 0, 1) // Jan 1, 2026
  const diff = now.getTime() - startDate.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  const daysSinceStart = Math.floor(diff / oneDay)
  // Cycle through 1080 kurals (Jan 1, 2026 = Kural 1)
  return (daysSinceStart % 1080) + 1
}

// Get kural from local JSON by number
function getKuralByNumber(num: number): Kural | null {
  const found = KURALS_1_TO_1080.find((k) => k.Number === num)
  if (!found) return null
  return {
    number: found.Number,
    line1: found.Line1,
    line2: found.Line2,
    tamilMeaning: found.mv,
  }
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
    const kuralNumber = getDailyKuralNumber()
    const dailyKural = getKuralByNumber(kuralNumber)
    setKural(dailyKural)
    setKuralLoading(false)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      if (!supabase) {
        throw new Error("Supabase client is not initialized due to missing environment variables.")
      }

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

        {/* Main Layout - Reordered on mobile: Form → Socials → Thirukural */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-4 lg:gap-6 mb-8">
          
          {/* Thirukural - Shows last on mobile (order-3), left on desktop */}
          <div className="flex flex-col order-3 lg:order-none">
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

                  {/* Tamil Meaning */}
                  {kural.tamilMeaning && (
                    <div className="text-center mb-3">
                      <p className="text-gray-800 text-xs sm:text-sm leading-relaxed font-medium">
                        {kural.tamilMeaning}
                      </p>
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

          {/* Contact Form - Shows first on mobile (order-1), right on desktop */}
          <div className="flex flex-col order-1 lg:order-none">
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

        {/* Social Links - Shows second on mobile (order-2) */}
        <div className="order-2 lg:order-none mb-4 lg:mb-0">
          {/* Mobile: Icons only in a single container with one @handle */}
          <div className="sm:hidden">
            <div className="flex items-center justify-center gap-4 p-4 bg-white rounded-2xl shadow-lg border border-gray-100">
              <a
                href="https://www.facebook.com/rotarygudalur"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.243-1.333 1.501-1.333h2.499v-5h-4c-4.072 0-5 2.417-5 5.333v2.667z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@rotarygudalur"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/rotary_club_gdr_garden_city?utm_source=qr&igsh=MWpidHd3bXBmMWJkNQ=="
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300"
              >
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
            <p className="text-center text-gray-500 text-sm font-medium mt-2">@rotarygudalur</p>
          </div>

          {/* Desktop/Tablet: Full social links with names */}
          <div className="hidden sm:flex flex-wrap justify-center gap-6 sm:gap-8 lg:gap-12">
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
      </div>
    </section>
  )
}
