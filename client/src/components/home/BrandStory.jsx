import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Link } from 'react-router-dom'

gsap.registerPlugin(ScrollTrigger)

const stats = [
  { number: '2019', label: 'Est.' },
  { number: '500+', label: 'Products' },
  { number: '10K+', label: 'Customers' },
  { number: '4.9★', label: 'Rating' },
]

const BrandStory = () => {
  const sectionRef = useRef(null)
  const imageRef = useRef(null)
  const contentRef = useRef(null)
  const statsRef = useRef([])
  const lineRef = useRef(null)

  useEffect(() => {
    // Image parallax
    gsap.to(imageRef.current, {
      yPercent: -15,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
    })

    // Content fade in
    gsap.fromTo(contentRef.current.children,
      { opacity: 0, x: 40 },
      {
        opacity: 1, x: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: contentRef.current,
          start: 'top 80%',
        }
      }
    )

    // Stats counter animation
    statsRef.current.forEach((stat, i) => {
      gsap.fromTo(stat,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.6,
          delay: i * 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: stat,
            start: 'top 90%',
          }
        }
      )
    })

    // Gold line grows
    gsap.fromTo(lineRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.2,
        ease: 'power3.out',
        transformOrigin: 'left center',
        scrollTrigger: {
          trigger: lineRef.current,
          start: 'top 85%',
        }
      }
    )

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <section ref={sectionRef} className="bg-primary py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* LEFT — Image */}
          <div className="relative overflow-hidden" style={{ height: '600px' }}>
            <div
              ref={imageRef}
              className="absolute inset-0 bg-cover bg-center scale-110"
              style={{
                backgroundImage: `url(public/categories/brandstory.jpg)`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary/30" />

            {/* Floating badge */}
            <div className="absolute bottom-8 left-8 bg-primary/90 backdrop-blur-sm border border-surface-border p-6">
              <p className="font-mono text-gold text-3xl font-medium">6+</p>
              <p className="font-body text-text-secondary text-xs tracking-widest uppercase mt-1">
                Years of Craft
              </p>
            </div>

            {/* Corner gold accents */}
            <div className="absolute top-6 left-6 w-12 h-12">
              <div className="absolute top-0 left-0 w-full h-px bg-gold" />
              <div className="absolute top-0 left-0 w-px h-full bg-gold" />
            </div>
            <div className="absolute bottom-6 right-6 w-12 h-12">
              <div className="absolute bottom-0 right-0 w-full h-px bg-gold" />
              <div className="absolute bottom-0 right-0 w-px h-full bg-gold" />
            </div>
          </div>

          {/* RIGHT — Content */}
          <div ref={contentRef}>
            <p className="section-label mb-4 opacity-0">Our Craft</p>

            <div ref={lineRef} className="w-16 h-px bg-gold mb-8 opacity-0" />

            <h2 className="font-display text-display-m text-text-primary leading-tight mb-6 opacity-0">
              Made to Last
              <span className="block text-gold">a Lifetime.</span>
            </h2>

            <p className="font-body text-text-secondary leading-relaxed mb-6 opacity-0">
              Every SCATCH bag begins as a single piece of full-grain leather,
              hand-selected for texture, durability, and character. Our artisans
              spend hours shaping, stitching, and finishing each piece — not because
              it's required, but because anything less isn't SCATCH.
            </p>

            <p className="font-body text-text-secondary leading-relaxed mb-10 opacity-0">
              We don't follow trends. We build pieces that outlast them. When you
              carry SCATCH, you carry something made with intention — built to age
              beautifully and tell your story.
            </p>

            <Link to="/about" className="btn-secondary inline-flex items-center gap-2 opacity-0">
              Our Story
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-surface-border mt-24">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              ref={el => statsRef.current[i] = el}
              className="bg-primary py-10 px-8 text-center opacity-0 group hover:bg-surface transition-colors duration-300"
            >
              <p className="font-mono text-gold text-3xl font-medium mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </p>
              <p className="section-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BrandStory