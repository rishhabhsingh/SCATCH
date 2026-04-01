import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

const GoogleSuccess = () => {
  const [searchParams] = useSearchParams()
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    const userStr = searchParams.get('user')

    if (token && userStr) {
      const user = JSON.parse(decodeURIComponent(userStr))
      setAuth(user, token)
      navigate(user.role === 'admin' ? '/admin' : '/', { replace: true })
    } else {
      navigate('/login?error=google_failed', { replace: true })
    }
  }, [])

  return (
    <div className="bg-primary min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-body text-text-secondary text-sm">Signing you in...</p>
      </div>
    </div>
  )
}

export default GoogleSuccess