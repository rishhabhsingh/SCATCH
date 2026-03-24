import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const categories = [
  {
    id: 1,
    name: 'Tote Bags',
    tag: 'The Daily Essential',
    description: 'From boardroom to brunch. Structured, spacious, and effortlessly refined.',
    path: '/shop?category=tote',
    image: 'public/categories/tote.jpeg',
    count: '24 Styles',
    position: 'center 30%',
  },
  {
    id: 2,
    name: 'Crossbody',
    tag: 'Hands-Free Luxury',
    description: 'Move freely. Look flawless. Compact designs that carry everything you need.',
    path: '/shop?category=crossbody',
    image: 'public/categories/crossbody.jpeg',
    count: '18 Styles',
    position: 'center 40%',
  },
  {
    id: 3,
    name: 'Backpacks',
    tag: 'Elevated Utility',
    description: 'Crafted for movement. Premium leather backpacks that balance function with refined design.',
    path: '/shop?category=backpack',
    image: 'public/categories/backpacks.jpeg',
    count: '12 Styles',
    position: 'center 50%',
  },
  {
    id: 4,
    name: 'Duffle Bags',
    tag: 'Travel in Distinction',
    description: 'Designed for journeys that matter. Spacious, refined, and crafted to endure.',
    path: '/shop?category=duffle',
    image: 'public/categories/duffle.jpeg',
    count: '12 Styles',
    position: 'center 50%',
  },
  {
    id: 5,
    name: 'Briefcases',
    tag: 'Power in Form',
    description: 'Where precision meets presence. Structured leather briefcases for the modern professional.',
    path: '/shop?category=briefcase',
    image: 'public/categories/briefcase.jpeg',
    count: '12 Styles',
    position: 'center 50%'
    },
  {
    id: 6,
    name: 'Wallets',
    tag: 'Everyday Essentials',
    description: 'Slim, refined, and crafted to last. Luxury that fits in your pocket.',
    path: '/shop?category=wallets',
    image: 'public/categories/wallets.jpeg',
    count: '12 Styles',
    position: 'center 50%'
},  
]

const FeaturedCategories = () => {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    // Heading animation
    gsap.fromTo(headingRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 85%',
        }
      }
    )

    // Cards stagger animation
    cardsRef.current.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 80, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 1.2, ease: 'power3.out',
          delay: i * 0.15,
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
          }
        }
      )
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <section ref={sectionRef} className="bg-primary py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Section Header */}
        <div ref={headingRef} className="flex items-end justify-between mb-16 opacity-0">
          <div>
            <p className="section-label mb-3">Explore</p>
            <h2 className="font-display text-display-m text-text-primary">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden lg:flex items-center gap-2 text-text-secondary hover:text-gold
                       font-body text-sm tracking-widest uppercase transition-colors duration-300
                       border-b border-transparent hover:border-gold pb-1"
          >
            View All
            <span className="text-gold">→</span>
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-surface-border">
          {categories.map((cat, i) => (
            <Link
              key={cat.id}
              to={cat.path}
              ref={el => cardsRef.current[i] = el}
              className="relative group overflow-hidden bg-primary opacity-0"
              style={{ height: '580px' }}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{
                  backgroundImage: `url(${cat.image})`,
                  backgroundPosition: cat.position,
                }}
              />

              {/* Base overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />

              {/* Hover overlay — gold tint */}
              <div className="absolute inset-0 bg-gold opacity-0 group-hover:opacity-10 transition-opacity duration-500" />

              {/* Top tag */}
              <div className="absolute top-6 left-6">
                <span className="section-label bg-primary/60 backdrop-blur-sm px-3 py-1.5 border border-surface-border">
                  {cat.tag}
                </span>
              </div>

              {/* Count badge */}
              <div className="absolute top-6 right-6">
                <span className="font-mono text-xs text-text-secondary bg-primary/60 backdrop-blur-sm px-3 py-1.5 border border-surface-border">
                  {cat.count}
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                {/* Gold line — grows on hover */}
                <div className="w-8 h-px bg-gold mb-4 transition-all duration-500 group-hover:w-16" />

                <h3 className="font-display text-3xl text-text-primary mb-2 group-hover:text-gold transition-colors duration-300">
                  {cat.name}
                </h3>

                <p className="font-body text-text-secondary text-sm leading-relaxed mb-6 max-w-xs
                              opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0
                              transition-all duration-500">
                  {cat.description}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 text-gold font-body text-xs tracking-widest uppercase
                                translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                  <span>Explore</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
                </div>
              </div>

              {/* Corner accent */}
              <div className="absolute bottom-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-0 right-0 w-px h-8 bg-gold" />
                <div className="absolute bottom-0 right-0 w-8 h-px bg-gold" />
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All */}
        <div className="lg:hidden text-center mt-8">
          <Link to="/shop" className="btn-secondary">
            View All Categories
          </Link>
        </div>

      </div>
    </section>
  )
}

export default FeaturedCategories