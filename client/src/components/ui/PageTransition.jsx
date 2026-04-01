import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'

const PageTransition = ({ children }) => {
  const location = useLocation()
  const pageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(pageRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', clearProps: 'all' }
      )
    }, pageRef)
    return () => ctx.revert()
  }, [location.pathname])

  return (
    <div ref={pageRef}>
      {children}
    </div>
  )
}

export default PageTransition