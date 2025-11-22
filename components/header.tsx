"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerHeight = document.querySelector("header")?.offsetHeight || 80
      const elementPosition = element.offsetTop - headerHeight
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-emerald-700 shadow-lg">
      <div className="px-4 sm:px-8 py-2"> {/* Further adjusted padding to shrink header */}
        <div className="flex items-center justify-between">
          {/* Left Logo */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 relative bg-white rounded-full p-2 border-2 border-white/50 flex-shrink-0 overflow-hidden"> {/* Increased fixed size, removed flex-grow */}
            <Image src="/rotary-international-wheel.png" alt="Rotary Logo" fill className="object-cover rounded-full" style={{mixBlendMode: 'multiply'}} />
          </div>
          {/* Club Info */}
          <div className="text-center">
            <h1 className="font-montserrat font-extrabold text-5xl text-white mb-2">Rotary Club of Gudalur Garden City</h1> {/* Increased font size, added bottom margin */}
            <p className="text-xl text-white/90 font-semibold">Club ID: 88574 | RI District: 3000</p> {/* Increased font size */}
          </div>
          {/* Right Logo */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 relative bg-white/20 rounded-full p-1.5 border-2 border-white/50 flex-shrink-0"> {/* Increased fixed size, removed flex-grow */}
            <Image src="/Logo2.png" alt="RI District 3000 Logo" fill className="object-cover rounded-full" />
          </div>
        </div>
      </div>
      {/* Navigation Bar */}
      <nav className="bg-white border-t-2 border-b-2 border-black">
        <div className="px-4 sm:px-8 py-2 flex flex-wrap justify-center gap-x-4 sm:gap-x-6">
          {[
            { name: "Home", id: "home" },
            { name: "Board", id: "board" },
            { name: "Events", id: "events" },
            { name: "Gallery", id: "gallery" },
            { name: "Contact", id: "contact" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-gray-800 font-bold text-base hover:text-emerald-600 transition-colors duration-300 py-1"
            >
              {item.name}
            </button>
          ))}
        </div>
      </nav>
    </header>
  )
}
