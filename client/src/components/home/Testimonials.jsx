import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Mumbai',
    rating: 5,
    text: 'I\'ve owned my SCATCH Milano Tote for two years now and it still looks brand new. The leather has actually gotten better with age. Worth every rupee.',
    product: 'The Milano Tote',
    avatar: 'PS',
  },
  {
    id: 2,
    name: 'Arjun Mehta',
    location: 'Delhi',
    rating: 5,
    text: 'Gifted the Executive Briefcase to my father and he refuses to use anything else. The quality is immediately apparent the moment you hold it.',
    product: 'The Executive Briefcase',
    avatar: 'AM',
  },
  {
    id: 3,
    name: 'Sneha Reddy',
    location: 'Bangalore',
    rating: 5,
    text: 'Finally a brand that understands luxury doesn\'t mean uncomfortable or impractical. The crossbody fits everything and looks stunning.',
    product: 'The Siena Crossbody',
    avatar: 'SR',
  },
  {
    id: 4,
    name: 'Rahul Nair',
    location: 'Chennai',
    rating: 5,
    text: 'The stitching, the hardware, the smell of the leather — everything about SCATCH screams quality. Best purchase I\'ve made this year.',
    product: 'The Alpine Backpack',
    avatar: 'RN',
  },
]

const Testimonials = () => {
  const [active, setActive] = useState(0)
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(headingRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%' }
      }
    )
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  const goTo = (index) => {
    gsap.to(cardRef.current, {
      opacity: 0, x: -20, duration: 0.2,
      onComplete: () => {
        setActive(index)
        gsap.fromTo(cardRef.current,
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out' }
        )
      }
    })
  }

  const prev = () => goTo(active === 0 ? testimonials.length - 1 : active - 1)
  const next = () => goTo(active === testimonials.length - 1 ? 0 : active + 1)

  const t = testimonials[active]

  return (
    <section ref={sectionRef} className="bg-surface py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div ref={headingRef} className="text-center mb-20 opacity-0">
          <p className="section-label mb-3">Reviews</p>
          <h2 className="font-display text-display-m text-text-primary">
            What Our Customers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* LEFT — Large quote */}
          <div ref={cardRef}>
            <Quote size={48} className="text-gold mb-8 opacity-40" />

            <p className="font-display text-2xl lg:text-3xl text-text-primary leading-relaxed mb-8 italic">
              "{t.text}"
            </p>

            {/* Stars */}
            <div className="flex gap-1 mb-6">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={16} className="text-gold fill-gold" />
              ))}
            </div>

            {/* Author */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gold text-primary rounded-full flex items-center justify-center font-body font-medium text-sm">
                {t.avatar}
              </div>
              <div>
                <p className="font-body text-text-primary font-medium">{t.name}</p>
                <p className="font-body text-text-secondary text-sm">{t.location} · {t.product}</p>
              </div>
            </div>
          </div>

          {/* RIGHT — All testimonial thumbnails */}
          <div className="space-y-px">
            {testimonials.map((item, i) => (
              <button
                key={item.id}
                onClick={() => goTo(i)}
                className={`w-full text-left p-6 transition-all duration-300 border-l-2
                  ${active === i
                    ? 'bg-primary border-gold'
                    : 'bg-primary/50 border-transparent hover:border-surface-border hover:bg-primary'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-body text-xs font-medium flex-shrink-0
                    ${active === i ? 'bg-gold text-primary' : 'bg-surface text-text-secondary'}`}>
                    {item.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-body text-sm font-medium truncate ${active === i ? 'text-gold' : 'text-text-secondary'}`}>
                      {item.name}
                    </p>
                    <p className="font-body text-text-disabled text-xs truncate">{item.product}</p>
                  </div>
                  <div className="flex gap-0.5 flex-shrink-0">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={10} className="text-gold fill-gold" />
                    ))}
                  </div>
                </div>
              </button>
            ))}

            {/* Navigation */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={prev}
                className="w-10 h-10 border border-surface-border flex items-center justify-center
                           text-text-secondary hover:text-gold hover:border-gold transition-colors duration-200"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 border border-surface-border flex items-center justify-center
                           text-text-secondary hover:text-gold hover:border-gold transition-colors duration-200"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials