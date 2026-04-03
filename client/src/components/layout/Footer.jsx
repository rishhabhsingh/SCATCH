import { Link } from 'react-router-dom'
import { Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react'

const footerLinks = {
  Shop: [
    { label: 'New Arrivals', path: '/shop?category=new' },
    { label: 'Tote Bags', path: '/shop?category=tote' },
    { label: 'Crossbody', path: '/shop?category=crossbody' },
    { label: 'Backpacks', path: '/shop?category=backpack' },
    { label: 'Wallets', path: '/shop?category=wallet' },
  ],
  Company: [
    { label: 'About Us', path: '/about' },
    { label: 'Our Craft', path: '/about#craft' },
    { label: 'Careers', path: '/careers' },
    { label: 'Press', path: '/press' },
  ],
  Support: [
    { label: 'Track Order', path: '/dashboard/orders' },
    { label: 'Returns & Exchanges', path: '/returns' },
    { label: 'Shipping Info', path: '/shipping' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Contact Us', path: '/contact' },
  ],
}

const socials = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Youtube, href: '#', label: 'YouTube' },
]

const contactInfo = [
  { icon: Mail, text: 'support@scatch.in' },
  { icon: Phone, text: '+91 98765 43210' },
  { icon: MapPin, text: 'Mumbai, Maharashtra' },
]

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-surface-border">

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="font-display text-3xl text-text-primary tracking-widest hover:text-gold transition-colors duration-300"
            >
              SCATCH
            </Link>

            <p className="font-body text-text-secondary text-sm leading-relaxed mt-4 mb-8 max-w-xs">
              Handcrafted premium leather bags for those who move with intention.
              Built to last. Designed to define.
            </p>

            {/* Contact info */}
            <div className="space-y-3 mb-8">
              {contactInfo.map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.text} className="flex items-center gap-3">
                    <Icon size={14} className="text-gold flex-shrink-0" />
                    <span className="font-body text-text-secondary text-sm">
                      {item.text}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Socials */}
            <div className="flex gap-3">
              {socials.map((item) => {
                const Icon = item.icon
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-label={item.label}
                    className="w-9 h-9 border border-surface-border flex items-center justify-center text-text-secondary hover:text-gold hover:border-gold transition-all duration-200"
                  >
                    <Icon size={15} />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Links columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="section-label mb-6">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="font-body text-text-secondary text-sm hover:text-gold transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </div>

{/* Tech Stack */}
<div className="border-t border-surface-border py-6 px-6 lg:px-12">
  <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
    <p className="font-body text-text-disabled text-xs">
      Built with{' '}
      {['React', 'Node.js', 'MongoDB', 'Redis', 'GROQ AI', 'Tailwind CSS'].map((tech, i, arr) => (
        <span key={tech}>
          <span className="text-gold">{tech}</span>
          {i < arr.length - 1 ? ' · ' : ''}
        </span>
      ))}
    </p>

    <a
      href="https://github.com/rishhabhsingh/scatch"
      target="_blank"
      rel="noreferrer"
      className="font-body text-text-disabled text-xs hover:text-gold transition-colors"
    >
      Designed & built by Rishabh Singh →
    </a>
  </div>
</div>

      {/* Bottom bar */}
      <div className="border-t border-surface-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-6 flex flex-col lg:flex-row items-center justify-between gap-4">
          <p className="font-body text-text-disabled text-xs">
            © 2025 SCATCH. All rights reserved. Handcrafted with care in India.
          </p>

          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a
                key={item}
                href="#"
                className="font-body text-text-disabled text-xs hover:text-gold transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
  <a
    href="https://github.com/yourusername/scatch"
    target="_blank"
    rel="noreferrer"
    className="font-body text-text-disabled text-xs hover:text-gold transition-colors flex items-center gap-1.5"
  >
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
    </svg>
    View Source
  </a>
</div>      
    </footer>
  )
}

export default Footer