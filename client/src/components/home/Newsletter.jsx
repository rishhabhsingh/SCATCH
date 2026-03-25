import { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import toast from 'react-hot-toast'

gsap.registerPlugin(ScrollTrigger)

const Newsletter = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const sectionRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    gsap.fromTo(contentRef.current.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: contentRef.current, start: 'top 85%' }
      }
    )
    return () => ScrollTrigger.getAll().forEach(t => t.kill())
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    setTimeout(() => {
      toast.success('Welcome to SCATCH. You\'re on the list.')
      setEmail('')
      setLoading(false)
    }, 1000)
  }

  return (
    <section ref={sectionRef} className="bg-primary py-32 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto text-center">
        <div ref={contentRef}>

          <p className="section-label mb-4 opacity-0">Stay Connected</p>

          <h2 className="font-display text-display-m text-text-primary mb-4 opacity-0">
            Join the Inner Circle
          </h2>

          <p className="font-body text-text-secondary mb-12 leading-relaxed opacity-0">
            Be the first to know about new collections, exclusive offers,
            and stories from our craftsmen. No spam — only what matters.
          </p>

          <form onSubmit={handleSubmit} className="flex gap-px opacity-0">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Your email address"
              className="input-field flex-1"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary whitespace-nowrap disabled:opacity-70"
            >
              {loading ? 'Joining...' : 'Join Now'}
            </button>
          </form>

          <p className="font-body text-text-disabled text-xs mt-4 opacity-0">
            By subscribing you agree to our Privacy Policy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Newsletter