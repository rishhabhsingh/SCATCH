import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Lock, Save, MapPin, Plus, Trash2 } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { authService } from '../../services/auth.service'
import toast from 'react-hot-toast'

const profileSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
})

const passwordSchema = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

const addressSchema = z.object({
  label: z.string().min(1, 'Label required'),
  street: z.string().min(5, 'Enter valid street'),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().length(6, 'Must be 6 digits'),
})

const Profile = () => {
  const { user, setAuth, accessToken } = useAuthStore()
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [savingAddress, setSavingAddress] = useState(false)

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '', email: user?.email || '' },
  })

  const passwordForm = useForm({ resolver: zodResolver(passwordSchema) })
  const addressForm = useForm({ resolver: zodResolver(addressSchema) })

  useEffect(() => {
    authService.getAddresses()
      .then(res => setAddresses(res.data.data.address || []))
      .catch(() => {})
  }, [])

  const onProfileSubmit = async (data) => {
    setSavingProfile(true)
    try {
      const res = await authService.updateProfile(data)
      setAuth(res.data.data.user, accessToken)
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    } finally {
      setSavingProfile(false)
    }
  }

  const onPasswordSubmit = async (data) => {
    setSavingPassword(true)
    try {
      await authService.updatePassword(data)
      toast.success('Password updated')
      passwordForm.reset()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    } finally {
      setSavingPassword(false)
    }
  }

  const onAddressSubmit = async (data) => {
    setSavingAddress(true)
    try {
      const res = await authService.saveAddress(data)
      setAddresses(res.data.data.address)
      setShowAddressForm(false)
      addressForm.reset()
      toast.success('Address saved')
    } catch {
      toast.error('Failed to save address')
    } finally {
      setSavingAddress(false)
    }
  }

  const handleDeleteAddress = async (id) => {
    try {
      const res = await authService.deleteAddress(id)
      setAddresses(res.data.data.address)
      toast.success('Address removed')
    } catch {
      toast.error('Failed to delete address')
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
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-surface-border">
          <div className="w-16 h-16 bg-gold text-primary rounded-full flex items-center justify-center font-body font-medium text-2xl">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-body text-text-primary font-medium">{user?.name}</p>
            <p className="font-body text-text-secondary text-sm">{user?.email}</p>
            <span className="font-mono text-xs text-gold capitalize">{user?.role}</span>
          </div>
        </div>
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-5">
          <div>
            <label className="section-label block mb-2">Full Name</label>
            <input {...profileForm.register('name')} className="input-field" />
            {profileForm.formState.errors.name && (
              <p className="text-status-error text-xs mt-1">{profileForm.formState.errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="section-label block mb-2">Email</label>
            <input {...profileForm.register('email')} className="input-field" />
            {profileForm.formState.errors.email && (
              <p className="text-status-error text-xs mt-1">{profileForm.formState.errors.email.message}</p>
            )}
          </div>
          <button type="submit" disabled={savingProfile} className="btn-primary flex items-center gap-2 disabled:opacity-60">
            <Save size={14} />
            {savingProfile ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Saved Addresses */}
      <div className="bg-surface border border-surface-border p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <MapPin size={18} className="text-gold" />
            <h2 className="font-body text-text-primary font-medium text-sm tracking-widest uppercase">
              Saved Addresses
            </h2>
          </div>
          <button
            onClick={() => setShowAddressForm(!showAddressForm)}
            className="flex items-center gap-2 text-gold font-body text-xs hover:text-gold-light transition-colors"
          >
            <Plus size={14} />
            Add New
          </button>
        </div>

        {/* Existing addresses */}
        {addresses.length > 0 && (
          <div className="space-y-3 mb-6">
            {addresses.map((addr) => (
              <div key={addr._id} className="flex items-start justify-between p-4 border border-surface-border hover:border-gold transition-colors group">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="section-label text-[10px]">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="font-mono text-xs text-gold bg-gold/10 px-2 py-0.5">Default</span>
                    )}
                  </div>
                  <p className="font-body text-text-secondary text-sm leading-relaxed">
                    {addr.street}, {addr.city}, {addr.state} — {addr.pincode}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteAddress(addr._id)}
                  className="text-text-disabled hover:text-status-error transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {addresses.length === 0 && !showAddressForm && (
          <p className="font-body text-text-disabled text-sm mb-4">
            No saved addresses yet. Add one to auto-fill at checkout.
          </p>
        )}

        {/* Add address form */}
        {showAddressForm && (
          <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-4 border border-surface-border p-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="section-label block mb-2">Label</label>
                <input {...addressForm.register('label')} placeholder="Home / Work / Other" className="input-field" />
                {addressForm.formState.errors.label && (
                  <p className="text-status-error text-xs mt-1">{addressForm.formState.errors.label.message}</p>
                )}
              </div>
              <div>
                <label className="section-label block mb-2">Pincode</label>
                <input {...addressForm.register('pincode')} placeholder="400001" maxLength={6} className="input-field" />
                {addressForm.formState.errors.pincode && (
                  <p className="text-status-error text-xs mt-1">{addressForm.formState.errors.pincode.message}</p>
                )}
              </div>
            </div>
            <div>
              <label className="section-label block mb-2">Street Address</label>
              <input {...addressForm.register('street')} placeholder="House no, Street, Area" className="input-field" />
              {addressForm.formState.errors.street && (
                <p className="text-status-error text-xs mt-1">{addressForm.formState.errors.street.message}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="section-label block mb-2">City</label>
                <input {...addressForm.register('city')} placeholder="Mumbai" className="input-field" />
              </div>
              <div>
                <label className="section-label block mb-2">State</label>
                <input {...addressForm.register('state')} placeholder="Maharashtra" className="input-field" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowAddressForm(false)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" disabled={savingAddress} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60">
                <Save size={14} />
                {savingAddress ? 'Saving...' : 'Save Address'}
              </button>
            </div>
          </form>
        )}
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
            <input {...passwordForm.register('currentPassword')} type="password" className="input-field" placeholder="••••••••" />
          </div>
          <div>
            <label className="section-label block mb-2">New Password</label>
            <input {...passwordForm.register('newPassword')} type="password" className="input-field" placeholder="Min. 6 characters" />
            {passwordForm.formState.errors.newPassword && (
              <p className="text-status-error text-xs mt-1">{passwordForm.formState.errors.newPassword.message}</p>
            )}
          </div>
          <div>
            <label className="section-label block mb-2">Confirm New Password</label>
            <input {...passwordForm.register('confirmPassword')} type="password" className="input-field" placeholder="Repeat new password" />
            {passwordForm.formState.errors.confirmPassword && (
              <p className="text-status-error text-xs mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>
            )}
          </div>
          <button type="submit" disabled={savingPassword} className="btn-primary flex items-center gap-2 disabled:opacity-60">
            <Lock size={14} />
            {savingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Profile