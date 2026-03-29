import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { gsap } from 'gsap'
import { Eye, EyeOff } from 'lucide-react'
import { authService } from '../../services/auth.service'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { setAuth, accessToken } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const formRef = useRef(null)
  const imageRef = useRef(null)

  const from = location.state?.from?.pathname || '/'

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  })

  // Redirect if already logged in
  useEffect(() => {
    if (accessToken) navigate('/', { replace: true })
  }, [accessToken])

  // GSAP entrance
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
      const res = await authService.login(data)
      const { user, accessToken } = res.data.data
      setAuth(user, accessToken)
      toast.success(`Welcome back, ${user.name.split(' ')[0]}`)
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
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
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=1200)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary" />
        <div className="absolute inset-0 bg-primary/40" />

        {/* Logo overlay */}
        <div className="absolute top-8 left-8">
          <Link to="/" className="font-display text-2xl text-text-primary tracking-widest hover:text-gold transition-colors">
            SCATCH
          </Link>
        </div>

        {/* Quote overlay */}
        <div className="absolute bottom-12 left-8 right-8">
          <div className="w-8 h-px bg-gold mb-4" />
          <p className="font-display text-2xl text-text-primary italic leading-relaxed">
            "Crafted for those who carry purpose."
          </p>
        </div>
      </div>

      {/* RIGHT — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div ref={formRef}>

            {/* Mobile logo */}
            <div className="lg:hidden mb-8 ">
              <Link to="/" className="font-display text-2xl text-text-primary tracking-widest">
                SCATCH
              </Link>
            </div>

            {/* Header */}
            <div className="mb-8">
              <p className="section-label mb-2">Welcome Back</p>
              <h1 className="font-display text-4xl text-text-primary">Sign In</h1>
            </div>

            {/* Register link */}
            <p className="font-body text-text-secondary text-sm mb-8">
              Don't have an account?{' '}
              <Link to="/register" className="text-gold hover:text-gold-light transition-colors">
                Create one
              </Link>
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

              <div className="">
                <label className="section-label block mb-2">Email</label>
                <input
                  {...register('email')}
                  type="email"
                  placeholder="your@email.com"
                  className="input-field"
                  autoComplete="email"
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
                    placeholder="••••••••"
                    className="input-field pr-10"
                    autoComplete="current-password"
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

              <div className="flex justify-end">
                <button type="button" className="font-body text-text-secondary text-xs hover:text-gold transition-colors">
                  Forgot password?
                </button>
              </div>

              <div className="">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center flex items-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <span className="animate-pulse">Signing in...</span>
                  ) : 'Sign In'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login