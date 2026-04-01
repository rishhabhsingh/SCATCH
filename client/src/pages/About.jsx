import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const values = [
  {
    number: '01',
    title: 'Full-Grain Leather Only',
    desc: 'We use only the top layer of the hide — the strongest, most beautiful part. No bonded leather. No shortcuts.',
  },
  {
    number: '02',
    title: 'Hand-Stitched Edges',
    desc: 'Every seam is stitched by hand using waxed thread. It takes longer. It lasts forever.',
  },
  {
    number: '03',
    title: 'Gold Hardware Standard',
    desc: 'All metal fittings are solid brass with gold plating. They age with the bag — not against it.',
  },
  {
    number: '04',
    title: 'No Fast Fashion',
    desc: 'We release two collections a year. Each piece is made to order. Quality over quantity, always.',
  },
]

const About = () => {
  const heroRef = useRef(null)
  const valuesRef = useRef([])

  useEffect(() => {
    gsap.fromTo(heroRef.current.children,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', delay: 0.3 }
    )

    valuesRef.current.forEach((el, i) => {
      if (!el) return
      gsap.fromTo(el,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
          delay: i * 0.1,
        }
      )
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <div className="bg-primary min-h-screen pt-20">

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ height: '70vh', marginTop: '80px' }}>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://res.cloudinary.com/dqygddc7b/image/upload/v1775044620/brandstory_rvnmm6.jpg)` }}
        />
        <div className="absolute inset-0 bg-primary/70" />
        <div className="relative z-10 h-full flex items-center">
          <div ref={heroRef} className="max-w-7xl mx-auto px-6 lg:px-12 w-full">
            <p className="section-label mb-4 opacity-0">Our Story</p>
            <h1 className="font-display text-display-xl text-text-primary mb-6 opacity-0 max-w-2xl leading-none">
              Built on Craft.<br />
              <span className="text-gold">Driven by Purpose.</span>
            </h1>
            <p className="font-body text-text-secondary text-lg max-w-xl leading-relaxed opacity-0">
              SCATCH was born from a simple frustration — premium leather goods shouldn't require a luxury tax.
              We set out to make genuinely handcrafted bags accessible to those who value quality over labels.
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-label mb-4">The Beginning</p>
            <h2 className="font-display text-display-m text-text-primary mb-6">
              Why We Started
            </h2>
            <p className="font-body text-text-secondary leading-relaxed mb-6">
              In 2019, our founder walked into a leather workshop in Dharavi — one of the world's largest leather-working communities — and saw craftsmen producing bags of extraordinary quality that were being sold under foreign brand names at 10x the price.
            </p>
            <p className="font-body text-text-secondary leading-relaxed mb-6">
              SCATCH was created to change that. To put the craftsman at the center of the story. To sell premium leather goods at honest prices, with full transparency about how and where they're made.
            </p>
            <p className="font-body text-text-secondary leading-relaxed">
              Today we work with 12 artisan families across Mumbai and Chennai, producing every bag by hand, one at a time.
            </p>
          </div>
          <div className="relative overflow-hidden" style={{ height: '500px' }}>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(https://res.cloudinary.com/dqygddc7b/image/upload/v1775044620/brandstory_rvnmm6.jpg)` }}
            />
            <div className="absolute top-4 left-4 w-12 h-12">
              <div className="absolute top-0 left-0 w-full h-px bg-gold" />
              <div className="absolute top-0 left-0 w-px h-full bg-gold" />
            </div>
            <div className="absolute bottom-4 right-4 w-12 h-12">
              <div className="absolute bottom-0 right-0 w-full h-px bg-gold" />
              <div className="absolute bottom-0 right-0 w-px h-full bg-gold" />
            </div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="bg-surface border-t border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
          <div className="text-center mb-16">
            <p className="section-label mb-3">Our Standards</p>
            <h2 className="font-display text-display-m text-text-primary">
              The SCATCH Commitment
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-surface-border">
            {values.map((v, i) => (
              <div
                key={v.number}
                ref={el => valuesRef.current[i] = el}
                className="bg-surface p-10 opacity-0 group hover:bg-primary transition-colors duration-300"
              >
                <p className="font-mono text-gold text-sm mb-4">{v.number}</p>
                <h3 className="font-body text-text-primary font-medium text-lg mb-3 group-hover:text-gold transition-colors">
                  {v.title}
                </h3>
                <p className="font-body text-text-secondary text-sm leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-surface-border border border-surface-border">
          {[
            { number: '2019', label: 'Founded' },
            { number: '12', label: 'Artisan Families' },
            { number: '10K+', label: 'Happy Customers' },
            { number: '4.9★', label: 'Average Rating' },
          ].map(stat => (
            <div key={stat.label} className="bg-primary py-12 text-center">
              <p className="font-mono text-gold text-3xl font-medium mb-2">{stat.number}</p>
              <p className="section-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="border-t border-surface-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-24 text-center">
          <h2 className="font-display text-display-m text-text-primary mb-4">
            Ready to carry SCATCH?
          </h2>
          <p className="font-body text-text-secondary mb-8 max-w-md mx-auto">
            Browse our full collection of handcrafted leather bags.
          </p>
          <Link to="/shop" className="btn-primary">
            Shop the Collection
          </Link>
        </div>
      </div>
    </div>
  )
}

export default About