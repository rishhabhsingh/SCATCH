import { useRef, useEffect, useState } from 'react'
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
    images: [
      'https://i.pinimg.com/1200x/b0/e1/9f/b0e19f721cbe70a1b8fc299fc93cb937.jpg',
      'https://i.pinimg.com/1200x/38/f4/d4/38f4d4dedc1c39957e58bb1d49aab5dc.jpg',
      'https://i.pinimg.com/1200x/d6/96/5a/d6965ae2ba9b94c96cb39f5d694676bb.jpg',
    ],
    count: '24 Styles',
  },
  {
    id: 2,
    name: 'Crossbody',
    tag: 'Hands-Free Luxury',
    description: 'Move freely. Look flawless. Compact designs that carry everything you need.',
    path: '/shop?category=crossbody',
    images: [
      'https://res.cloudinary.com/dqygddc7b/image/upload/v1775044400/crossbody_cahwoz.jpg',
      'https://i.pinimg.com/1200x/9b/49/2d/9b492df0777e8d647e5ea90f7701a48a.jpg',
      'https://i.pinimg.com/736x/4e/22/33/4e22335fce92ff998cf887464c624453.jpg',
    ],
    count: '18 Styles',
  },
  {
    id: 3,
    name: 'Backpacks',
    tag: 'Elevated Utility',
    description: 'Crafted for movement. Premium leather backpacks that balance function with refined design.',
    path: '/shop?category=backpack',
    images: [
      'https://i.pinimg.com/736x/29/f7/df/29f7dff9f91171886e75c67d83f78f26.jpg',
      'https://res.cloudinary.com/dqygddc7b/image/upload/v1775044459/backpacks_hjfy6d.jpg',
      'https://i.pinimg.com/1200x/e8/b5/af/e8b5afc59bcbbcb7f400af6828ee3cdc.jpg',
    ],
    count: '15 Styles',
  },
  {
    id: 4,
    name: 'Duffle Bags',
    tag: 'Travel in Distinction',
    description: 'Designed for journeys that matter. Spacious, refined, and crafted to endure.',
    path: '/shop?category=duffle',
    images: [
      'https://i.pinimg.com/736x/03/83/38/038338be77357c05d5991bb6a2260254.jpg',
      'https://res.cloudinary.com/dqygddc7b/image/upload/v1775044493/duffle_ctoe7b.jpg',
      'https://i.pinimg.com/736x/f3/0b/d1/f30bd127d7b262682b945a61d7068b46.jpg',
    ],
    count: '10 Styles',
  },
  {
    id: 5,
    name: 'Briefcases',
    tag: 'Power in Form',
    description: 'Where precision meets presence. Structured leather briefcases for the modern professional.',
    path: '/shop?category=briefcase',
    images: [
      'https://i.pinimg.com/1200x/47/a3/72/47a372295aa19240c5f57f8fe98e0fb0.jpg',
      'https://res.cloudinary.com/dqygddc7b/image/upload/v1775044521/briefcase_lcvwrr.jpg',
      'https://i.pinimg.com/1200x/8c/58/44/8c5844402f09ef034ea9dba5bd3addb2.jpg',
    ],
    count: '8 Styles',
  },
  {
    id: 6,
    name: 'Wallets',
    tag: 'Everyday Essentials',
    description: 'Slim, refined, and crafted to last. Luxury that fits in your pocket.',
    path: '/shop?category=wallet',
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
      'https://res.cloudinary.com/dqygddc7b/image/upload/v1775044545/wallets_l4fsfb.jpg',
      'https://i.pinimg.com/1200x/d1/ca/34/d1ca345765322e7e4814af59e6b70c68.jpg',
    ],
    count: '12 Styles',
  },
]

// Slideshow card component
const CategoryCard = ({ cat, index, cardsRef }) => {
  const [currentImage, setCurrentImage] = useState(0)
  const imageRefs = useRef([])
  const intervalRef = useRef(null)

  useEffect(() => {
    // Preload all images
    cat.images.forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [cat.images])

  const handleMouseEnter = () => {
    let i = currentImage
    intervalRef.current = setInterval(() => {
      const next = (i + 1) % cat.images.length

      // Fade out current
      gsap.to(imageRefs.current[i], {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
      })

      // Fade in next
      gsap.fromTo(imageRefs.current[next],
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.inOut' }
      )

      i = next
      setCurrentImage(next)
    }, 1200) // cycles every 1.2s while hovering
  }

  const handleMouseLeave = () => {
    // Stop cycling
    clearInterval(intervalRef.current)

    // Smoothly return to first image
    cat.images.forEach((_, idx) => {
      gsap.to(imageRefs.current[idx], {
        opacity: idx === 0 ? 1 : 0,
        duration: 0.8,
        ease: 'power2.inOut',
      })
    })
    setCurrentImage(0)
  }

  return (
    <Link
      to={cat.path}
      ref={el => cardsRef.current[index] = el}
      className="relative group overflow-hidden bg-primary opacity-0 block"
      style={{ height: index < 3 ? '560px' : '420px' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* All images stacked */}
      {cat.images.map((src, i) => (
        <div
          key={i}
          ref={el => imageRefs.current[i] = el}
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
          style={{
            backgroundImage: `url(${src})`,
            opacity: i === 0 ? 1 : 0,
            zIndex: i === currentImage ? 2 : 1,
          }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent z-10" />
      <div className="absolute inset-0 bg-gold opacity-0 group-hover:opacity-10 transition-opacity duration-500 z-10" />

      {/* Progress dots — only visible on hover */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {cat.images.map((_, i) => (
          <div
            key={i}
            className={`h-0.5 transition-all duration-500 ${
              i === currentImage ? 'w-6 bg-gold' : 'w-2 bg-white/30'
            }`}
          />
        ))}
      </div>

      {/* Top tag */}
      <div className="absolute top-6 left-6 z-20">
        <span className="section-label bg-primary/70 backdrop-blur-sm px-3 py-1.5 border border-surface-border">
          {cat.tag}
        </span>
      </div>

      {/* Count badge */}
      <div className="absolute top-6 right-6 z-20">
        <span className="font-mono text-xs text-text-secondary bg-primary/70 backdrop-blur-sm px-3 py-1.5 border border-surface-border">
          {cat.count}
        </span>
      </div>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
        <div className="w-8 h-px bg-gold mb-4 transition-all duration-500 group-hover:w-16" />
        <h3 className="font-display text-3xl text-text-primary mb-2 group-hover:text-gold transition-colors duration-300">
          {cat.name}
        </h3>
        <p className="font-body text-text-secondary text-sm leading-relaxed mb-6 max-w-xs opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          {cat.description}
        </p>
        <div className="flex items-center gap-2 text-gold font-body text-xs tracking-widest uppercase translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <span>Explore</span>
          <span className="transition-transform duration-300 group-hover:translate-x-2">→</span>
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute bottom-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
        <div className="absolute bottom-0 right-0 w-px h-8 bg-gold" />
        <div className="absolute bottom-0 right-0 w-8 h-px bg-gold" />
      </div>

      <div className="absolute bottom-8 right-8 font-mono text-xs text-text-disabled opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
        0{index + 1}
      </div>
    </Link>
  )
}
const FeaturedCategories = () => {
  const sectionRef = useRef(null)
  const headingRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    gsap.fromTo(headingRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%' }
      }
    )

    cardsRef.current.forEach((card, i) => {
      if (!card) return
      gsap.fromTo(card,
        { opacity: 0, y: 80, scale: 0.96 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 1.2, ease: 'power3.out',
          delay: i * 0.1,
          scrollTrigger: { trigger: card, start: 'top 90%' }
        }
      )
    })

    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  return (
    <section ref={sectionRef} className="bg-primary py-32 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div ref={headingRef} className="flex items-end justify-between mb-16 opacity-0">
          <div>
            <p className="section-label mb-3">Explore</p>
            <h2 className="font-display text-display-m text-text-primary">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden lg:flex items-center gap-2 text-text-secondary hover:text-gold font-body text-sm tracking-widest uppercase transition-colors duration-300 border-b border-transparent hover:border-gold pb-1"
          >
            View All <span className="text-gold">→</span>
          </Link>
        </div>

        {/* Row 1 — 3 tall cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-surface-border mb-px">
          {categories.slice(0, 3).map((cat, i) => (
            <CategoryCard key={cat.id} cat={cat} index={i} cardsRef={cardsRef} />
          ))}
        </div>

        {/* Row 2 — 3 shorter cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-surface-border">
          {categories.slice(3, 6).map((cat, i) => (
            <CategoryCard key={cat.id} cat={cat} index={i + 3} cardsRef={cardsRef} />
          ))}
        </div>

        {/* Mobile View All */}
        <div className="lg:hidden text-center mt-8">
          <Link to="/shop" className="btn-secondary">View All Categories</Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCategories
