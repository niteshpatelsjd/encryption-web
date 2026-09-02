import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import LockResetRoundedIcon from '@mui/icons-material/LockResetRounded'
import toast from 'react-hot-toast'
import api from '../../api/axiosInstance'
import { setCredentials } from '../../store/slices/authSlice'

const emptyForm = {
  name: '', email: '', countryCode: '+91', mobileNumber: '',
  address: '', city: '', country: '', profileUrl: '',
}

const fieldSx = {
  '& .MuiOutlinedInput-root': { borderRadius: 2.5, bgcolor: '#FFFFFF' },
}

export default function ProfilePage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, token } = useSelector((state) => state.auth)
  const userId = user?.id || user?._id || user?.userId
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [preview, setPreview] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    const loadProfile = async () => {
      if (!userId) {
        setLoading(false)
        toast.error('Profile ID is unavailable. Please sign in again.')
        return
      }
      try {
        const response = await api.get(`/user/getProfile/${userId}`)
        if (!active) return
        if (response?.data?.responseCode !== 200) throw new Error(response?.data?.message)
        const profile = response?.data?.responseBody || {}
        setForm({
          name: profile.name || '',
          email: profile.email || '',
          countryCode: profile.countryCode || '+91',
          mobileNumber: profile.mobileNumber || '',
          address: profile.address || '',
          city: profile.city || '',
          country: profile.country || '',
          profileUrl: profile.profileUrl || '',
        })
        setPreview(profile.profileUrl || '')
      } catch (error) {
        if (active) toast.error(error?.response?.data?.message || error?.message || 'Unable to load profile')
      } finally {
        if (active) setLoading(false)
      }
    }
    loadProfile()
    return () => { active = false }
  }, [userId])

  const updateField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))
  }

  const selectImage = (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Profile image must be smaller than 5 MB')
      return
    }
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const saveProfile = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.mobileNumber.trim()) {
      toast.error('Name, email, and mobile number are required')
      return
    }
    try {
      setSaving(true)
      const payload = new FormData()
      payload.append('id', userId)
      Object.entries(form).forEach(([key, value]) => {
        if (key !== 'profileUrl' && value !== '') payload.append(key, value)
      })
      if (imageFile) payload.append('imageFile', imageFile)

      const response = await api.post('/user/addAdmin', payload)
      if (response?.data?.responseCode !== 200) {
        throw new Error(response?.data?.message || 'Unable to update profile')
      }
      const updated = response?.data?.responseBody || {}
      const mergedUser = { ...user, ...updated }
      dispatch(setCredentials({ token, user: mergedUser }))
      setForm((current) => ({ ...current, ...updated }))
      setPreview(updated.profileUrl || preview)
      setImageFile(null)
      toast.success(response?.data?.message || 'Profile updated successfully')
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || 'Unable to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Box sx={{ minHeight: 420, display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box sx={{ width: 48, height: 48, borderRadius: 3, display: 'grid', placeItems: 'center', bgcolor: '#FEE2E2', color: '#7A1E1E' }}>
            <PersonRoundedIcon />
          </Box>
          <Box>
            <Typography sx={{ fontSize: 26, fontWeight: 900, color: '#111827' }}>My Profile</Typography>
            <Typography sx={{ fontSize: 13, color: '#64748B' }}>View and update your personal details.</Typography>
          </Box>
                </Stack>
      </Stack>

      <Card sx={{ position: 'relative', maxWidth: 900, mx: 'auto', borderRadius: 4, border: '1px solid #E5E7EB', boxShadow: '0 14px 36px rgba(15,23,42,0.07)' }}>
        <Box sx={{ height: 115, background: 'linear-gradient(135deg, #111827 0%, #7A1E1E 65%, #9A3412 100%)' }} />
        <Button
          variant="contained"
          startIcon={<LockResetRoundedIcon />}
          onClick={() => navigate('/settings/change-password')}
          sx={{ position: 'absolute', top: 24, right: 24, borderRadius: 2.5, px: 2.3, py: 1, color: '#111827', bgcolor: '#FFFFFF', fontWeight: 800, textTransform: 'none', boxShadow: '0 8px 20px rgba(0,0,0,0.20)', '&:hover': { bgcolor: '#111827', color: '#FFFFFF', boxShadow: '0 10px 24px rgba(0,0,0,0.30)' } }}
        >
          Change Password
        </Button>
        <CardContent component="form" onSubmit={saveProfile} sx={{ px: { xs: 2.5, md: 4 }, pb: 4 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'center', sm: 'flex-end' }} justifyContent="space-between" spacing={2} sx={{ mt: -7, mb: 3 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar src={preview} sx={{ width: 130, height: 130, bgcolor: '#7A1E1E', fontSize: 42, fontWeight: 800, border: '5px solid #FFFFFF', boxShadow: '0 8px 24px rgba(15,23,42,0.18)' }}>
                {(form.name || form.email || 'A')[0].toUpperCase()}
              </Avatar>
              <IconButton component="label" sx={{ position: 'absolute', right: 2, bottom: 5, bgcolor: '#111827', color: '#FFFFFF', border: '3px solid #FFFFFF', '&:hover': { bgcolor: '#7A1E1E' } }}>
                <EditRoundedIcon fontSize="small" />
                <input hidden type="file" accept="image/*" onChange={selectImage} />
              </IconButton>
            </Box>
          </Stack>

          <Divider sx={{ mb: 3 }} />
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.2 }}>
            <TextField label="Full Name" value={form.name} onChange={updateField('name')} required sx={fieldSx} />
            <TextField label="Email Address" type="email" value={form.email} onChange={updateField('email')} required sx={fieldSx} />
            <Box sx={{ display: 'grid', gridTemplateColumns: '105px 1fr', gap: 1.5 }}>
              <TextField label="Code" value={form.countryCode} onChange={updateField('countryCode')} sx={fieldSx} />
              <TextField label="Mobile Number" value={form.mobileNumber} onChange={updateField('mobileNumber')} required sx={fieldSx} />
            </Box>
            <TextField label="City" value={form.city} onChange={updateField('city')} sx={fieldSx} />
            <TextField label="Country" value={form.country} onChange={updateField('country')} sx={fieldSx} />
            <TextField label="Address" value={form.address} onChange={updateField('address')} multiline minRows={3} sx={{ ...fieldSx, gridColumn: { sm: '1 / -1' } }} />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              startIcon={saving ? <CircularProgress size={17} color="inherit" /> : <SaveRoundedIcon />}
              sx={{
                borderRadius: 2.5,
                px: 3,
                py: 1.2,
                bgcolor: '#0B0B0D',
                color: '#FFFFFF',
                fontWeight: 800,
                textTransform: 'none',
                letterSpacing: '0.01em',
                boxShadow: '0 10px 26px rgba(0,0,0,0.28)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  bgcolor: '#1F2937',
                  boxShadow: '0 14px 32px rgba(0,0,0,0.36)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              Update Profile
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
