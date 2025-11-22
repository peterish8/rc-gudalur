import Image from "next/image"

export default function RotaryStrip() {
  return (
    <section className="py-8 bg-gradient-to-r from-blue-100 via-green-50 to-yellow-50">
      <div className="px-4 sm:px-8">
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <Image
              src="/rotary-strip-banner.png"
              alt="Rotary Club District 3000 and Dream Initiative Banner"
              width={800}
              height={120}
              className="w-full h-auto object-contain rounded-2xl shadow-lg"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
