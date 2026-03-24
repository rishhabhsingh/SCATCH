import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ArrowRight, ChevronDown } from 'lucide-react'

const HeroSection = () => {
  const headlineRef = useRef(null)
  const labelRef = useRef(null)
  const subRef = useRef(null)
  const buttonsRef = useRef(null)
  const scrollRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.8 })

    tl.fromTo(overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5, ease: 'power2.out' }
    )
    .fromTo(labelRef.current,
      { opacity: 0, y: 20, letterSpacing: '0.1em' },
      { opacity: 1, y: 0, letterSpacing: '0.3em', duration: 0.8, ease: 'power3.out' },
      '-=0.8'
    )
    .fromTo(headlineRef.current.children,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.15 },
      '-=0.4'
    )
    .fromTo(subRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
      '-=0.4'
    )
    .fromTo(buttonsRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.15 },
      '-=0.3'
    )
    .fromTo(scrollRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      '-=0.2'
    )

    // Scroll indicator bounce loop
    gsap.to(scrollRef.current, {
      y: 8,
      duration: 1.2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
      delay: 2.5,
    })
  }, [])

  return (
    <section className="relative w-full h-screen overflow-hidden">

      {/* VIDEO BACKGROUND */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/hero-video.mp4" type="video/mp4" />
      </video>

      {/* DARK OVERLAY — layered for depth */}
    <div ref={overlayRef} className="absolute inset-0">
        <div className="absolute inset-0 bg-primary opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent" />
    </div>

      {/* CONTENT */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-6 lg:px-12 flex items-center">
        <div className="max-w-2xl">

          {/* Label */}
          <p
            ref={labelRef}
            className="section-label mb-6 opacity-0"
          >
            New Collection 2025
          </p>

          {/* Headline */}
          <h1
            ref={headlineRef}
            className="font-display text-display-xl text-text-primary leading-none mb-6 overflow-hidden pb-4"
          >
            <span className="block opacity-0">Carry Your</span>
            <span className="block text-gold opacity-0">Legacy.</span>
          </h1>

          {/* Subtext */}
          <p
            ref={subRef}
            className="font-body text-text-secondary text-lg leading-relaxed mb-10 max-w-md opacity-0"
          >
            Handcrafted premium leather bags for  <br />  those who move with intention.
            <br />
          </p>

          {/* Buttons */}
          <div ref={buttonsRef} className="flex flex-wrap gap-4">
            <Link to="/shop" className="btn-primary flex items-center gap-2 opacity-0">
              Explore Collection
              <ArrowRight size={16} />
            </Link>
            <Link to="/shop?category=new" className="btn-secondary opacity-0">
              New Arrivals
            </Link>
          </div>
        </div>
      </div>

      {/* SCROLL INDICATOR */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 cursor-pointer"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <p className="text-text-disabled text-xs tracking-[0.3em] uppercase font-body">
          Scroll
        </p>
        <ChevronDown size={16} className="text-gold" />
      </div>

      {/* BOTTOM LEFT — stats */}
      <div className="absolute bottom-8 left-6 lg:left-12 flex gap-8">
        {[
          { number: '500+', label: 'Crafted Pieces' },
          { number: '10K+', label: 'Happy Clients' },
          { number: '5★',   label: 'Rated' },
        ].map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-mono text-gold text-lg font-medium">{stat.number}</p>
            <p className="text-text-disabled text-xs tracking-wider uppercase font-body">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default HeroSection