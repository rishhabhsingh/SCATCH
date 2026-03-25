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

    </footer>
  )
}

export default Footer