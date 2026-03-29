import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Lock, Save } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import api from '../../services/axios'
import toast from 'react-hot-toast'

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

const Profile = () => {
  const { user, setAuth, accessToken } = useAuthStore()
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  })

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
  })

  const onProfileSubmit = async (data) => {
    setSavingProfile(true)
    try {
      const res = await api.put('/auth/profile', data)
      setAuth(res.data.data.user, accessToken)
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile')
    } finally {
      setSavingProfile(false)
    }
  }

  const onPasswordSubmit = async (data) => {
    setSavingPassword(true)
    try {
      await api.put('/auth/password', data)
      toast.success('Password updated successfully')
      passwordForm.reset()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password')
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="space-y-8">

      {/* Profile Info */}
      <div className="bg-surface border border-surface-border p-8">
        <div className="flex items-center gap-3 mb-8">
          <User size={18} className="text-gold" />
          <h2 className="font-body text-text-primary font-medium text-sm tracking-widest uppercase">
            Personal Information
          </h2>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-surface-border">
          <div className="w-16 h-16 bg-gold text-primary rounded-full flex items-center justify-center font-body font-medium text-2xl">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-body text-text-primary font-medium">{user?.name}</p>
            <p className="font-body text-text-secondary text-sm">{user?.email}</p>
            <span className="font-mono text-xs text-gold">
              Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-5">
          <div>
            <label className="section-label block mb-2">Full Name</label>
            <input
              {...profileForm.register('name')}
              className="input-field"
              placeholder="Your full name"
            />
            {profileForm.formState.errors.name && (
              <p className="text-status-error text-xs mt-1 font-body">
                {profileForm.formState.errors.name.message}
              </p>
            )}
          </div>
          <div>
            <label className="section-label block mb-2">Email Address</label>
            <input
              {...profileForm.register('email')}
              className="input-field"
              placeholder="your@email.com"
            />
            {profileForm.formState.errors.email && (
              <p className="text-status-error text-xs mt-1 font-body">
                {profileForm.formState.errors.email.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="btn-primary flex items-center gap-2 disabled:opacity-60"
          >
            <Save size={14} />
            {savingProfile ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="bg-surface border border-surface-border p-8">
        <div className="flex items-center gap-3 mb-8">
          <Lock size={18} className="text-gold" />
          <h2 className="font-body text-text-primary font-medium text-sm tracking-widest uppercase">
            Change Password
          </h2>
        </div>

        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-5">
          <div>
            <label className="section-label block mb-2">Current Password</label>
            <input
              {...passwordForm.register('currentPassword')}
              type="password"
              className="input-field"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="section-label block mb-2">New Password</label>
            <input
              {...passwordForm.register('newPassword')}
              type="password"
              className="input-field"
              placeholder="Min. 6 characters"
            />
            {passwordForm.formState.errors.newPassword && (
              <p className="text-status-error text-xs mt-1 font-body">
                {passwordForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>
          <div>
            <label className="section-label block mb-2">Confirm New Password</label>
            <input
              {...passwordForm.register('confirmPassword')}
              type="password"
              className="input-field"
              placeholder="Repeat new password"
            />
            {passwordForm.formState.errors.confirmPassword && (
              <p className="text-status-error text-xs mt-1 font-body">
                {passwordForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={savingPassword}
            className="btn-primary flex items-center gap-2 disabled:opacity-60"
          >
            <Lock size={14} />
            {savingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile