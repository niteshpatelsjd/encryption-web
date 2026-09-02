import { useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import LockResetIcon from '@mui/icons-material/LockReset'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import toast from 'react-hot-toast'
import api from '../../api/axiosInstance'

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 3,
    bgcolor: '#FFFFFF',
  },
}

export default function ChangePasswordPage() {
  const user = useSelector((state) => state.auth.user)
  const [form, setForm] = useState({
    existingPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [visible, setVisible] = useState({
    existingPassword: false,
    newPassword: false,
    confirmPassword: false,
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const update = (key) => (event) => {
    setSuccess(false)
    setForm((current) => ({ ...current, [key]: event.target.value }))
  }

  const passwordAdornment = (key) => ({
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          edge="end"
          onClick={() => setVisible((current) => ({ ...current, [key]: !current[key] }))}
        >
          {visible[key] ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
      </InputAdornment>
    ),
  })

  const submit = async (event) => {
    event.preventDefault()
    const id = user?.id || user?._id || user?.userId

    if (!id) {
      toast.error('Admin user ID is unavailable. Please sign in again.')
      return
    }
    if (form.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error('New password and confirmation do not match')
      return
    }

    try {
      setSaving(true)
      const response = await api.post('/user/change-password', {
        id,
        existingPassword: form.existingPassword,
        newPassword: form.newPassword,
      })
      if (response?.data?.responseCode !== 200) {
        throw new Error(response?.data?.message || 'Failed to change password')
      }
      setForm({ existingPassword: '', newPassword: '', confirmPassword: '' })
      setSuccess(true)
      toast.success(response?.data?.message || 'Password changed successfully')
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || 'Failed to change password'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto' }}>
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 3,
            display: 'grid',
            placeItems: 'center',
            bgcolor: '#FEE2E2',
            color: '#7A1E1E',
          }}
        >
          <LockResetIcon />
        </Box>
        <Box>
          <Typography sx={{ fontSize: 25, fontWeight: 900, color: '#111827' }}>
            Change Password
          </Typography>
          <Typography sx={{ fontSize: 13, color: '#64748B' }}>
            Update the password for your administrator account.
          </Typography>
        </Box>
      </Stack>

      {success && (
        <Alert severity="success" sx={{ mb: 2, borderRadius: 3 }}>
          Your password was changed successfully.
        </Alert>
      )}

      <Card sx={{ borderRadius: 4, border: '1px solid #E5E7EB' }}>
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Box component="form" onSubmit={submit}>
            <Stack spacing={2.25}>
              <TextField
                label="Current Password"
                type={visible.existingPassword ? 'text' : 'password'}
                value={form.existingPassword}
                onChange={update('existingPassword')}
                required
                fullWidth
                sx={fieldSx}
                InputProps={passwordAdornment('existingPassword')}
              />
              <TextField
                label="New Password"
                type={visible.newPassword ? 'text' : 'password'}
                value={form.newPassword}
                onChange={update('newPassword')}
                required
                fullWidth
                helperText="Use at least 6 characters."
                sx={fieldSx}
                InputProps={passwordAdornment('newPassword')}
              />
              <TextField
                label="Confirm New Password"
                type={visible.confirmPassword ? 'text' : 'password'}
                value={form.confirmPassword}
                onChange={update('confirmPassword')}
                required
                fullWidth
                sx={fieldSx}
                InputProps={passwordAdornment('confirmPassword')}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                startIcon={<LockResetIcon />}
                sx={{
                  alignSelf: 'flex-end',
                  bgcolor: '#111827',
                  borderRadius: 3,
                  px: 3,
                  py: 1.15,
                  fontWeight: 800,
                  '&:hover': { bgcolor: '#1F2937' },
                }}
              >
                {saving ? 'Changing...' : 'Change Password'}
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
