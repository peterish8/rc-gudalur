"use client"

import type React from "react"
import { useState } from "react"
import { supabase, type ContactSubmission } from "@/lib/supabase"

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactSubmission>({
    name: "",
    email: "",
    phone: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")

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
    <section id="contact" className="py-20 bg-gray-50">
      <div className="px-8">
        <div className="text-center mb-16">
          <h2 className="grand-title font-montserrat font-black text-6xl mb-6">Get In Touch</h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-xl font-medium">
            Ready to make a difference? Join us or learn more about our initiatives
          </p>
        </div>

        <div className="grid lg:grid-cols-1 gap-16 max-w-7xl mx-auto justify-items-center">
          {/* Contact Information */}
          <div className="flex flex-wrap gap-6">
            <div className="modern-card p-10">
              <h3 className="font-montserrat font-bold text-3xl text-gray-900 mb-8">Connect With Us</h3>

              <div className="flex items-center space-x-6">
                <a
                  href="https://www.facebook.com/rotarygudalur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-6 p-6 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-colors duration-300 group"
                >
                  <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.243-1.333 1.501-1.333h2.499v-5h-4c-4.072 0-5 2.417-5 5.333v2.667z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Facebook</h4>
                    <p className="text-gray-600">@rotarygudalur</p>
                  </div>
                </a>

                <a
                  href="https://www.youtube.com/@rotarygudalur"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-6 p-6 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors duration-300 group"
                >
                  <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">YouTube</h4>
                    <p className="text-gray-600">@rotarygudalur</p>
                  </div>
                </a>

                <a
                  href="https://www.instagram.com/rotary_club_gdr_garden_city?utm_source=qr&igsh=MWpidHd3bXBmMWJkNQ=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-6 p-6 bg-pink-50 rounded-2xl hover:bg-pink-100 transition-colors duration-300 group"
                >
                  <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg">Instagram</h4>
                    <p className="text-gray-600">@rotarygudalur</p>
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
