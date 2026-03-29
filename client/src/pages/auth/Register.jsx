import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { gsap } from 'gsap'
import { Eye, EyeOff } from 'lucide-react'
import { authService } from '../../services/auth.service'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

const Register = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setAuth, accessToken } = useAuthStore()
  const navigate = useNavigate()
  const formRef = useRef(null)
  const imageRef = useRef(null)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    if (accessToken) navigate('/', { replace: true })
  }, [accessToken])

  useEffect(() => {
  gsap.fromTo(imageRef.current,
    { opacity: 0, x: -40 },
    { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
  )
  gsap.fromTo(formRef.current,
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 }
  )
}, [])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
      })
      const { user, accessToken } = res.data.data
      setAuth(user, accessToken)
      toast.success(`Welcome to SCATCH, ${user.name.split(' ')[0]}!`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-primary flex">

      {/* LEFT — Image */}
      <div ref={imageRef} className="hidden lg:block w-1/2 relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary" />
        <div className="absolute inset-0 bg-primary/40" />

        <div className="absolute top-8 left-8">
          <Link to="/" className="font-display text-2xl text-text-primary tracking-widest hover:text-gold transition-colors">
            SCATCH
          </Link>
        </div>

        <div className="absolute bottom-12 left-8 right-8">
          <div className="w-8 h-px bg-gold mb-4" />
          <p className="font-display text-2xl text-text-primary italic leading-relaxed">
            "Every great journey begins with the right bag."
          </p>
        </div>
      </div>

      {/* RIGHT — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div ref={formRef}>

            <div className="lg:hidden mb-8">
              <Link to="/" className="font-display text-2xl text-text-primary tracking-widest">
                SCATCH
              </Link>
            </div>

            <div className="mb-8">
              <p className="section-label mb-2">Join SCATCH</p>
              <h1 className="font-display text-4xl text-text-primary">Create Account</h1>
            </div>

            <p className="font-body text-text-secondary text-sm mb-8 opacity-0">
              Already have an account?{' '}
              <Link to="/login" className="text-gold hover:text-gold-light transition-colors">
                Sign in
              </Link>
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              <div className="">
                <label className="section-label block mb-2">Full Name</label>
                <input
                  {...register('name')}
                  type="text"
                  placeholder="Your full name"
                  className="input-field"
                />
                {errors.name && (
                  <p className="font-body text-status-error text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="">
                <label className="section-label block mb-2">Email</label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="your@email.com"
                  className="input-field"
                />
                {errors.email && (
                  <p className="font-body text-status-error text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="">
                <label className="section-label block mb-2">Password</label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 6 characters"
                    className="input-field pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-disabled hover:text-gold transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="font-body text-status-error text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="">
                <label className="section-label block mb-2">Confirm Password</label>
                <input
                  {...register('confirmPassword')}
                  type="password"
                  placeholder="Repeat password"
                  className="input-field"
                />
                {errors.confirmPassword && (
                  <p className="font-body text-status-error text-xs mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center flex items-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <span className="animate-pulse">Creating account...</span>
                  ) : 'Create Account'}
                </button>
              </div>

              <p className="font-body text-text-disabled text-xs text-center">
                By creating an account you agree to our{' '}
                <a href="#" className="text-gold hover:underline">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-gold hover:underline">Privacy Policy</a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register