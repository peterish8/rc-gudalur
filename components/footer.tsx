import Image from "next/image"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#064e3b] to-[#065f46] text-white py-8 sm:py-12 lg:py-16">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="w-20 h-20 relative"> {/* Increased size slightly for better visibility */}
              <Image src="/rotary-international-wheel.png" alt="Rotary Logo" fill className="object-contain" />
            </div>
            <div>
              <h3 className="font-montserrat font-bold text-xl">Rotary Club of Gudalur Garden City</h3>
              <p className="text-white/80 font-semibold">Service Above Self</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-white/80 font-semibold">Club ID: 88574 | RI District: 3000</p>
            <p className="text-white/80 font-semibold mt-1">Chartered: 2020</p>
          </div>

          <div className="text-center md:text-right">
            <p className="text-white/80 font-semibold">© 2024 Rotary Club of Gudalur Garden City</p>
            <p className="text-white/80 font-semibold mt-1">All rights reserved</p>
          </div>
        </div>

        <div className="border-t border-white/20 mt-6 sm:mt-8 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 sm:gap-0 text-center sm:text-left">
          <p className="text-white/60 font-semibold">Site made by PTC</p>
          <p className="text-white/60 font-semibold">
            Part of Rotary International - Creating positive change in communities worldwide
          </p>
        </div>
      </div>
    </footer>
  )
}
