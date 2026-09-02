import { useState } from 'react'
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt'
import KeyIcon from '@mui/icons-material/Key'
import SmartphoneIcon from '@mui/icons-material/Smartphone'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../api/axiosInstance'

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 3,
    bgcolor: '#FFFFFF',
  },
}

const getResponseBody = (response) =>
  response?.data?.responseBody ?? {}

const formatDate = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
}

export default function MobileUserDevicePage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    countryCode: '+91',
    mobileNumber: '',
  })
  const [userId, setUserId] = useState('')
  const [createdUser, setCreatedUser] = useState(null)
  const [activation, setActivation] = useState(null)
  const [creating, setCreating] = useState(false)
  const [generating, setGenerating] = useState(false)

  const updateForm = (key) => (event) =>
    setForm((current) => ({
      ...current,
      [key]: event.target.value,
    }))

  const createMobileUser = async (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.email.trim() || !form.mobileNumber.trim()) {
      toast.error('Name, email and mobile number are required')
      return
    }

    try {
      setCreating(true)
      const response = await api.post('/mobileUser', {
        name: form.name.trim(),
        email: form.email.trim(),
        countryCode: form.countryCode.trim(),
        mobileNumber: form.mobileNumber.trim(),
      })
      const user = getResponseBody(response)
      const id = user.userId || user.id || user._id || ''
      setCreatedUser(user)
      setUserId(id)
      setActivation(null)
      toast.success(response?.data?.message || 'Mobile user created')
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Failed to create mobile user'
      )
    } finally {
      setCreating(false)
    }
  }

  const generateSerial = async () => {
    const id = userId.trim()
    if (!id) {
      toast.error('Enter a mobile user ID')
      return
    }

    try {
      setGenerating(true)
      const response = await api.post(
        `/mobileUser/${encodeURIComponent(id)}/generate-serial`
      )
      setActivation(getResponseBody(response))
      toast.success(response?.data?.message || 'Activation code generated')
    } catch (error) {
      toast.error(
        error?.response?.data?.message || 'Failed to generate activation code'
      )
    } finally {
      setGenerating(false)
    }
  }

  const copySerial = async () => {
    if (!activation?.serialId) return
    try {
      await navigator.clipboard.writeText(activation.serialId)
      toast.success('Activation code copied')
    } catch {
      toast.error('Unable to copy activation code')
    }
  }

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
        spacing={2}
        sx={{
          mb: 3,
          width: '100%',
          minHeight: 58,
          position: 'relative',
          pr: { xs: 0, sm: 20 },
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 25, fontWeight: 900, color: '#111827' }}>
            Mobile Device Provisioning
          </Typography>
          <Typography sx={{ mt: 0.5, color: '#64748B', fontSize: 13 }}>
            Create a mobile user and issue a secure, expiring activation code.
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/mobile-users"
          startIcon={<ArrowBackIcon />}
          sx={{
            position: 'absolute',
            top: '50%',
            right: 0,
            transform: 'translateY(-50%)',
            color: '#111827',
            fontWeight: 800,
            flexShrink: 0,
          }}
        >
          Mobile Users
        </Button>
      </Stack>

      <Alert severity="info" sx={{ mb: 3, borderRadius: 3 }}>
        Each newly generated activation code revokes any previous active code for
        the same user. The mobile app uses this code to activate and register its
        Android or iOS device.
      </Alert>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1.15fr 0.85fr' },
          gap: 3,
          alignItems: 'start',
        }}
      >
        <Card sx={{ borderRadius: 4, border: '1px solid #E5E7EB' }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: 3,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: '#DBEAFE',
                  color: '#1D4ED8',
                }}
              >
                <PersonAddAltIcon />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 900, color: '#111827' }}>
                  Create Mobile User
                </Typography>
                <Typography sx={{ color: '#64748B', fontSize: 12 }}>
                  Admin-authorized provisioning
                </Typography>
              </Box>
            </Stack>

            <Box component="form" onSubmit={createMobileUser}>
              <Stack spacing={2}>
                <TextField
                  label="Full Name"
                  value={form.name}
                  onChange={updateForm('name')}
                  required
                  fullWidth
                  sx={fieldSx}
                />
                <TextField
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={updateForm('email')}
                  required
                  fullWidth
                  sx={fieldSx}
                />
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <TextField
                    label="Country Code"
                    value={form.countryCode}
                    onChange={updateForm('countryCode')}
                    sx={{ ...fieldSx, width: { xs: '100%', sm: 150 } }}
                  />
                  <TextField
                    label="Mobile Number"
                    value={form.mobileNumber}
                    onChange={updateForm('mobileNumber')}
                    required
                    fullWidth
                    inputProps={{ inputMode: 'numeric' }}
                    sx={fieldSx}
                  />
                </Stack>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={creating}
                  startIcon={<PersonAddAltIcon />}
                  sx={{
                    alignSelf: 'flex-start',
                    bgcolor: '#111827',
                    borderRadius: 3,
                    px: 3,
                    py: 1.2,
                    fontWeight: 800,
                    '&:hover': { bgcolor: '#1F2937' },
                  }}
                >
                  {creating ? 'Creating...' : 'Create Mobile User'}
                </Button>
              </Stack>
            </Box>

            {createdUser && (
              <Box sx={{ mt: 3, p: 2.2, borderRadius: 3, bgcolor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
                  <CheckCircleIcon sx={{ color: '#15803D' }} />
                  <Typography sx={{ color: '#166534', fontWeight: 900 }}>
                    User created successfully
                  </Typography>
                </Stack>
                <Typography sx={{ color: '#374151', fontSize: 13 }}>
                  {createdUser.name} · {createdUser.email}
                </Typography>
                <Typography sx={{ color: '#64748B', fontSize: 12, mt: 0.5, wordBreak: 'break-all' }}>
                  User ID: {createdUser.userId}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 4, border: '1px solid #E5E7EB' }}>
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: 3,
                  display: 'grid',
                  placeItems: 'center',
                  bgcolor: '#FEF3C7',
                  color: '#B45309',
                }}
              >
                <KeyIcon />
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 900, color: '#111827' }}>
                  Generate Activation Code
                </Typography>
                <Typography sx={{ color: '#64748B', fontSize: 12 }}>
                  One-time device activation
                </Typography>
              </Box>
            </Stack>

            <TextField
              label="Mobile User ID"
              value={userId}
              onChange={(event) => {
                setUserId(event.target.value)
                setActivation(null)
              }}
              fullWidth
              sx={fieldSx}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SmartphoneIcon sx={{ color: '#64748B' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              disabled={generating || !userId.trim()}
              onClick={generateSerial}
              startIcon={<KeyIcon />}
              fullWidth
              sx={{
                mt: 2,
                bgcolor: '#7A1E1E',
                borderRadius: 3,
                py: 1.2,
                fontWeight: 800,
                '&:hover': { bgcolor: '#641919' },
              }}
            >
              {generating ? 'Generating...' : 'Generate Activation Code'}
            </Button>

            {activation && (
              <Box sx={{ mt: 3 }}>
                <Divider sx={{ mb: 3 }} />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 1, width: '100%' }}
                >
                  <Typography sx={{ fontSize: 12, color: '#64748B', fontWeight: 800 }}>
                    ACTIVATION CODE
                  </Typography>
                  <Chip
                    label="Active"
                    size="small"
                    color="success"
                    sx={{ ml: 'auto', flexShrink: 0 }}
                  />
                </Stack>
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    bgcolor: '#111827',
                    color: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 1.25,
                  }}
                >
                  <Typography sx={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 900, wordBreak: 'break-all' }}>
                    {activation.serialId}
                  </Typography>
                  <Button
                    onClick={copySerial}
                    startIcon={<ContentCopyIcon />}
                    size="small"
                    variant="outlined"
                    sx={{
                      minWidth: 0,
                      px: 1.25,
                      py: 0.35,
                      color: '#FFFFFF',
                      borderColor: 'rgba(255,255,255,0.45)',
                      fontSize: 11,
                      fontWeight: 800,
                      '& .MuiButton-startIcon': {
                        mr: 0.6,
                        '& svg': { fontSize: 16 },
                      },
                      '&:hover': {
                        borderColor: '#FFFFFF',
                        bgcolor: 'rgba(255,255,255,0.08)',
                      },
                    }}
                  >
                    Copy
                  </Button>
                </Box>
                <Typography sx={{ mt: 1.5, color: '#64748B', fontSize: 12 }}>
                  Expires: {formatDate(activation.expiresAt)}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
