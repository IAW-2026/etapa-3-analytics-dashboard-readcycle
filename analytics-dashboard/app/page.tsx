"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] items-center justify-center px-6 text-center select-none overflow-hidden">
      <div className="flex flex-col items-center max-w-4xl max-h-full py-4">
        {/* Central Logo without text */}
        <div className="relative w-32 h-32 md:w-36 md:h-36 mb-6 transition-transform duration-500 hover:scale-105">
          <Image
            src="/LogoSinTexto.png"
            alt="ReadCycle Icon"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Hero Title - Generic Analytics */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-brand-forest leading-[1.15] md:leading-[1.1] max-w-3xl">
          Visualizá tus métricas y<br />
          optimizá tu rendimiento <span className="text-brand-clay block sm:inline-block">sin esfuerzo</span>
        </h1>

        {/* Description Subtitle - Generic Analytics */}
        <p className="mt-6 text-sm sm:text-base md:text-lg text-brand-forest/80 max-w-2xl leading-relaxed">
          La plataforma de analíticas y business intelligence de <strong className="font-semibold text-brand-forest">ReadCycle</strong> que te permite monitorear métricas clave, analizar el rendimiento general y tomar decisiones informadas en tiempo real.
        </p>

        {/* Call to Action Button */}
        <div className="mt-8">
          <Link 
            href="/dashboard" 
            id="btn-enter-hub" 
            className="inline-flex items-center justify-center bg-brand-forest hover:bg-brand-sage text-brand-beige rounded-full font-semibold text-sm sm:text-base h-12 px-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            Acceder al Panel de Control
          </Link>
        </div>
      </div>
    </div>
  );
}
