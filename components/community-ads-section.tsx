"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { supabase, type CommunityAd } from "@/lib/supabase"

export default function CommunityAdsSection() {
  const [ad, setAd] = useState<CommunityAd | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchActiveAd()
  }, [])

  const fetchActiveAd = async () => {
    if (!supabase) {
      console.warn("Supabase not initialized")
      setAd(null)
      setIsLoading(false)
      return
    }
    try {
      console.log("Fetching active community ad...")
      const { data, error } = await supabase
        .from("community_ads")
        .select("*")
        .eq("is_active", true)
        .limit(1)

      console.log("Community ads response:", { data, error })

      if (error) {
        console.error("Error fetching community ad:", error)
        setAd(null)
      } else if (data && data.length > 0) {
        console.log("Active ad found:", data[0])
        setAd(data[0])
      } else {
        console.log("No active ads found")
        setAd(null)
      }
    } catch (err) {
      console.error("Unexpected error fetching ad:", err)
      setAd(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdClick = () => {
    if (ad?.link_url) {
      window.open(ad.link_url, "_blank", "noopener,noreferrer")
    }
  }

  // Don't render if no active ad
  if (!isLoading && !ad) {
    return null
  }

  return (
    <section className="py-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h3 className="font-montserrat font-bold text-2xl sm:text-3xl text-gray-900">
            Community Partner
          </h3>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Supporting local businesses and services
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12 space-x-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500/50 animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/50 animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-3 h-3 rounded-full bg-emerald-500/50 animate-bounce"></div>
          </div>
        ) : ad && (
          <div className="flex justify-center">
            <div
              className={`max-w-md w-full modern-card overflow-hidden group transition-all duration-300 ${
                ad.link_url ? "cursor-pointer hover:shadow-2xl hover:scale-[1.02]" : ""
              }`}
              onClick={handleAdClick}
            >
              <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden bg-gray-100">
                <Image
                  src={ad.image_url}
                  alt={ad.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {ad.link_url && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <p className="text-white text-sm font-medium">Click to visit</p>
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-5 text-center">
                <h4 className="font-montserrat font-bold text-lg sm:text-xl text-gray-900">
                  {ad.title}
                </h4>
                <p className="text-emerald-600 text-sm font-medium mt-1">
                  Featured Partner
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

