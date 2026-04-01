import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'

const NotFound = () => {
  const ref = useRef(null)

  useEffect(() => {
    gsap.fromTo(ref.current.children,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' }
    )
  }, [])

  return (
    <div className="bg-primary min-h-screen flex items-center justify-center px-6">
      <div ref={ref} className="text-center max-w-md">
        <p className="font-mono text-gold text-8xl font-medium mb-4 opacity-0">404</p>
        <div className="w-16 h-px bg-gold mx-auto mb-8 opacity-0" />
        <h1 className="font-display text-4xl text-text-primary mb-4 opacity-0">
          Page Not Found
        </h1>
        <p className="font-body text-text-secondary mb-10 leading-relaxed opacity-0">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>
        <div className="flex gap-4 justify-center opacity-0">
          <Link to="/" className="btn-primary">Go Home</Link>
          <Link to="/shop" className="btn-secondary">Browse Shop</Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound