import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, IconButton, Tooltip, MenuItem, Avatar, Typography, Divider,
  InputAdornment, Stack, Card, CardContent, Select, FormControl, InputLabel,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import SearchIcon from '@mui/icons-material/Search'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import CloseIcon from '@mui/icons-material/Close'
import PeopleIcon from '@mui/icons-material/People'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast'
import api from '../../api/axiosInstance'
import DataTable from '../../components/common/DataTable'

// ─── API helpers ────────────────────────────────────────────────────────────
const getUsers = (params) =>
  api.get('/user/getAllUser', { params }).then((r) => r.data.responseBody)

const getRoles = () =>
  api.get('/role/getAllRole', { params: { pageIndex: 0, pageSize: 100 } })
    .then((r) => r.data.responseBody?.content ?? [])

const getProfile = (id) =>
  api.get(`/user/getProfile/${id}`).then((r) => r.data.responseBody)

// ─── Schemas ────────────────────────────────────────────────────────────────
const addSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Min 6 characters').required('Password is required'),
  mobileNumber: yup.string().required('Mobile is required'),
  roleId: yup.string().required('Role is required'),
  countryCode: yup.string().required(),
})

const editSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  mobileNumber: yup.string().required('Mobile is required'),
  roleId: yup.string().required('Role is required'),
  countryCode: yup.string().required(),
})

const theme = {
  text: '#111827',
  muted: '#6B7280',
  border: '#E5E7EB',
  soft: '#F9FAFB',
  surface: '#FFFFFF',
}

// ─── Stat Card ───────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  color,
}) {
  return (
    <Card
      sx={{
        background: theme.surface,
        backdropFilter: 'blur(14px)',
        border: `1px solid ${theme.border}`,
        borderRadius: 3,
        boxShadow: '0 10px 30px rgba(17,24,39,0.06)',
        transition: 'all 0.25s ease',

        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 14px 34px rgba(17,24,39,0.10)',
        },
      }}
    >
      <CardContent
        sx={{
          p: '16px !important',
        }}
      >
        <Stack
          direction="row"
          alignItems="flex-start"
          sx={{
    width: '100%',
  }}
        >
          {/* LEFT CONTENT */}
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: theme.muted,
                fontSize: 13,
                fontWeight: 600,
                mb: 1,
              }}
            >
              {label}
            </Typography>

            <Typography
              sx={{
                color: theme.text,
                fontSize: 28,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {value ?? '—'}
            </Typography>
          </Box>

          {/* RIGHT ICON */}
          <Avatar
            sx={{
              bgcolor: `${color}18`,
              color,
              width: 52,
              height: 52,
              borderRadius: 3,
              flexShrink: 0,

              '& svg': {
                fontSize: 28,
              },
            }}
          >
            {icon}
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  )
}

// ─── View Dialog ─────────────────────────────────────────────────────────────
function InfoRow({ label, value }) {
  return (
    <Box
      sx={{
        py: 1.8,
        borderBottom: `1px solid ${theme.border}`,
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          color: theme.muted,
          mb: 0.7,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}
      >
        {label}
      </Typography>

      <Box
        sx={{
          bgcolor: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: 2,
          px: 1.5,
          py: 1.3,
          minHeight: 42,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            fontSize: 14,
            fontWeight: 500,
            color: '#1E1E1E',
            wordBreak: 'break-word',
            lineHeight: 1.5,
          }}
        >
          {value || '—'}
        </Typography>
      </Box>
    </Box>
  )
}


// ─── View Dialog ─────────────────────────────────────────────────────────────
function InfoField({ label, value }) {
  return (
    <TextField
      fullWidth
      size="small"
      label={label}
      value={value || '—'}
      InputProps={{
        readOnly: true,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          bgcolor: '#fff',

          '& fieldset': {
            borderColor: theme.border,
          },

          '&:hover fieldset': {
            borderColor: theme.text,
          },

          '&.Mui-focused fieldset': {
            borderColor: theme.text,
          },
        },

        '& .MuiInputLabel-root': {
          color: theme.muted,
          fontSize: 13,
          backgroundColor: '#fff',
          px: 0.5,
        },

        '& .MuiInputLabel-root.Mui-focused': {
          color: theme.text,
        },

        '& .MuiInputBase-input': {
          color: '#1E1E1E',
          fontSize: 14,
          WebkitTextFillColor: '#1E1E1E',
        },
      }}
    />
  )
}

function ViewDialog({ userId, onClose }) {
  const { data, isLoading } = useQuery({
    queryKey: ['user-profile', userId],
    queryFn: () => getProfile(userId),
    enabled: !!userId,
  })

  return (
    <Dialog
      open={!!userId}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: 4,
          overflow: 'hidden',
          boxShadow: '0 12px 40px rgba(17,24,39,0.10)',
        },
      }}
    >
      {/* HEADER */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          pt: 2,
          pb: 2,
          bgcolor: theme.soft,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 700,
            color: theme.text,
          }}
        >
          User Details
        </Typography>

        <IconButton
          size="small"
          onClick={onClose}
          sx={{
            color: theme.muted,

            '&:hover': {
              bgcolor: theme.soft,
              color: theme.text,
            },
          }}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>
      </DialogTitle>

      {/* CONTENT */}
      <DialogContent
        sx={{
          px: 3,
          pt: 3,
          pb: 3,
          bgcolor: '#FFFFFF',
        }}
      >
        {isLoading ? (
          <Box sx={{ py: 5, textAlign: 'center' }}>
            <Typography sx={{ color: theme.muted }}>
              Loading...
            </Typography>
          </Box>
        ) : data ? (
          <Box>
            {/* PROFILE */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Avatar
                src={data.profileUrl}
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: '#F5E6DA',
                  color: theme.text,
                  fontSize: 32,
                  fontWeight: 700,
                  border: `3px solid ${theme.border}`,
                  boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                  mb: 1.5,
                }}
              >
                {!data.profileUrl &&
                  data.name?.[0]?.toUpperCase()}
              </Avatar>

              <Chip
                label={
                  data.status === 1
                    ? 'Active'
                    : 'Inactive'
                }
                size="small"
                sx={{
                  bgcolor:
                    data.status === 1
                      ? 'rgba(34,197,94,0.12)'
                      : 'rgba(239,68,68,0.12)',

                  color:
                    data.status === 1
                      ? '#22c55e'
                      : '#ef4444',

                  fontWeight: 600,
                  border: 'none',
                }}
              />
            </Box>

            {/* FORM FIELDS */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2.2,
              }}
            >
              <InfoField
                label="Full Name"
                value={data.name}
              />

              <InfoField
                label="Email Address"
                value={data.email}
              />

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '110px 1fr',
                  gap: 2,
                }}
              >
                <InfoField
                  label="Code"
                  value={data.countryCode}
                />

                <InfoField
                  label="Mobile Number"
                  value={data.mobileNumber}
                />
              </Box>

              <InfoField
                label="Role"
                value={data.roleResponse?.roleName}
              />

              <InfoField
                label="Address"
                value={data.address}
              />

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 2,
                }}
              >
                <InfoField
                  label="City"
                  value={data.city}
                />

                <InfoField
                  label="Country"
                  value={data.country}
                />
              </Box>

              <InfoField
                label="Created At"
                value={data.createdAt}
              />

              <InfoField
                label="Updated At"
                value={data.updatedAt}
              />
            </Box>
          </Box>
        ) : null}
      </DialogContent>

      {/* FOOTER */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          bgcolor: theme.soft,
          borderTop: `1px solid ${theme.border}`,
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: theme.text,
            color: '#fff',
            fontWeight: 600,
            px: 3,
            borderRadius: 2,

            '&:hover': {
              bgcolor: '#000000',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}



// ─── Add/Edit Dialog ─────────────────────────────────────────────────────────
function UserFormDialog({ open, onClose, editing, roles, onSaved }) {
  const [preview, setPreview] = useState(
  editing?.profileUrl || ''
  )
  const schema = editing ? editSchema : addSchema
  const [showPass, setShowPass] = useState(false)

  const {
  register,
  handleSubmit,
  control,
  setValue,
  formState: { errors, isSubmitting },
} = useForm({
  resolver: yupResolver(schema),
    defaultValues: editing
      ? { name: editing.name, email: editing.email, mobileNumber: editing.mobileNumber, countryCode: editing.countryCode || '+91', address: editing.address || '', city: editing.city || '', country: editing.country || '', roleId: editing.roleId }
      : { countryCode: '+91', address: '', city: '', country: '' },
  })

  const onSubmit = async (values) => {
    try {
      const fd = new FormData()
      if (editing) fd.append('id', editing.id)
      Object.entries(values).forEach(([k, v]) => {
  if (
    v !== undefined &&
    v !== '' &&
    v !== null
  ) {
    fd.append(k, v)
  }
})
        await api.post('/user/addAdmin', fd)
      toast.success(editing ? 'User updated' : 'User added')
      onSaved()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save user')
    }
  }

const field = (props) => ({
  size: 'small',
  fullWidth: true,

  sx: {
    '& .MuiOutlinedInput-root': {
      bgcolor: '#fff',

      '& fieldset': {
        borderColor: theme.border,
      },

      '&:hover fieldset': {
        borderColor: theme.text,
      },

      '&.Mui-focused fieldset': {
        borderColor: theme.text,
      },
    },

    '& .MuiInputLabel-root': {
      color: theme.muted,
      fontSize: 13,
      backgroundColor: '#fff',
      px: 0.5,
    },

    '& .MuiInputLabel-root.Mui-focused': {
      color: theme.text,
    },

    '& .MuiInputBase-input': {
      color: '#1E1E1E',
      fontSize: 14,
    },
    '& .MuiInputBase-input::placeholder': {
  color: theme.muted,
  opacity: 1,
},
  },

  ...props,
})

  return (
    <Dialog
  open={open}
  onClose={onClose}
  maxWidth="sm"
  fullWidth
  PaperProps={{
    sx: {
      bgcolor: theme.surface,
      border: `1px solid ${theme.border}`,
      borderRadius: 4,
      overflow: 'hidden',
      boxShadow: '0 12px 40px rgba(17,24,39,0.10)',
    },
  }}
>
  {/* HEADER */}
<DialogTitle
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    px: 3,
    pt: 2,
    pb: 3, // ← increase bottom padding
    bgcolor: theme.soft,
    borderBottom: `1px solid ${theme.border}`,
  }}
>
    <Typography
      sx={{
        fontSize: 18,
        fontWeight: 700,
        color: theme.text,
      }}
    >
      {editing ? 'Edit User' : 'Add New User'}
    </Typography>

    <IconButton
      size="small"
      onClick={onClose}
      sx={{
        color: theme.muted,

        '&:hover': {
          bgcolor: theme.soft,
          color: theme.text,
        },
      }}
    >
      <CloseIcon sx={{ fontSize: 20 }} />
    </IconButton>
  </DialogTitle>

  {/* CONTENT */}
<DialogContent
  sx={{
    px: 3,
    pt: 2.5,
    pb: 3,
    bgcolor: '#FFFFFF',
  }}
>
    <Box
      component="form"
      id="user-form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2.2,
      }}
    >

<Box
  sx={{
    display: 'flex',
    justifyContent: 'center',
    mb: 2,
  }}
>
  <Box
    sx={{
      position: 'relative',
      width: 100,
      height: 100,
    }}
  >
    <Avatar
      src={preview}
      sx={{
        width: 100,
        height: 100,
        bgcolor: '#F5E6DA',
        color: theme.text,
        fontSize: 30,
        fontWeight: 700,
        border: `3px solid ${theme.border}`,
        boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
      }}
    >
      {!preview && 'U'}
    </Avatar>

    {/* EDIT BUTTON */}
    <IconButton
      component="label"
      size="small"
      sx={{
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 32,
        height: 32,
        bgcolor: theme.text,
        color: '#fff',
        border: '2px solid #fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.18)',

        '&:hover': {
          bgcolor: '#000000',
        },
      }}
    >
      <EditIcon sx={{ fontSize: 16 }} />

      <input
        hidden
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0]

          if (file) {
            setValue('imageFile', file)
            setPreview(URL.createObjectURL(file))
          }
        }}
      />
    </IconButton>
  </Box>
</Box>
      {/* NAME */}
      <TextField
        label="Full Name"
        {...field({
          ...register('name'),
          error: !!errors.name,
          helperText: errors.name?.message,
        })}
      />

      {/* EMAIL */}
      <TextField
        label="Email Address"
        {...field({
          ...register('email'),
          error: !!errors.email,
          helperText: errors.email?.message,
        })}
      />

      {/* PASSWORD */}
      {!editing && (
        <Box sx={{ position: 'relative' }}>
          <TextField
            label="Password"
            type={showPass ? 'text' : 'password'}
            {...field({
              ...register('password'),
              error: !!errors.password,
              helperText: errors.password?.message,
            })}
          />

          <IconButton
            size="small"
            onClick={() => setShowPass((p) => !p)}
            sx={{
              position: 'absolute',
              right: 10,
              top: 8,
              color: theme.muted,

              '&:hover': {
                bgcolor: 'transparent',
                color: theme.text,
              },
            }}
          >
            {showPass ? (
              <VisibilityIcon sx={{ fontSize: 18 }} />
            ) : (
              <VisibilityOffIcon sx={{ fontSize: 18 }} />
            )}
          </IconButton>
        </Box>
      )}

      {/* MOBILE */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '110px 1fr',
          gap: 2,
        }}
      >
        <TextField
          label="Code"
          {...field({
            ...register('countryCode'),
          })}
        />

        <TextField
          label="Mobile Number"
          {...field({
            ...register('mobileNumber'),
            error: !!errors.mobileNumber,
            helperText: errors.mobileNumber?.message,
          })}
        />
      </Box>

      {/* ROLE */}
      <Controller
        name="roleId"
        control={control}
        render={({ field: f }) => (
          <TextField
            select
            label="Role"
            {...field({
              ...f,
              value: f.value ?? '',
              error: !!errors.roleId,
              helperText: errors.roleId?.message,
            })}
          >
            {roles.map((r) => (
              <MenuItem
                key={r.id}
                value={r.id}
                sx={{
                  fontSize: 13,
                }}
              >
                {r.roleName}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      {/* ADDRESS */}
      <TextField
        label="Address"
        {...field({
          ...register('address'),
        })}
      />

      {/* CITY COUNTRY */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 2,
        }}
      >
        <TextField
          label="City"
          {...field({
            ...register('city'),
          })}
        />

        <TextField
          label="Country"
          {...field({
            ...register('country'),
          })}
        />
      </Box>
    </Box>
  </DialogContent>

  {/* FOOTER */}
  <DialogActions
    sx={{
      px: 3,
      py: 2,
      bgcolor: theme.soft,
      borderTop: `1px solid ${theme.border}`,
      gap: 1,
    }}
  >
    <Button
      onClick={onClose}
      sx={{
        color: theme.muted,
        fontWeight: 600,

        '&:hover': {
          bgcolor: theme.soft,
        },
      }}
    >
      Cancel
    </Button>

    <Button
      type="submit"
      form="user-form"
      variant="contained"
      disabled={isSubmitting}
      sx={{
        bgcolor: theme.text,
        color: '#fff',
        fontWeight: 600,
        px: 3,
        borderRadius: 2,

        '&:hover': {
          bgcolor: '#000000',
        },
      }}
    >
      {isSubmitting
        ? 'Saving...'
        : editing
        ? 'Update User'
        : 'Add User'}
    </Button>
  </DialogActions>
</Dialog>
  )
}

// ─── Block/Unblock Confirm Dialog ────────────────────────────────────────────
function ConfirmDialog({ open, user, onClose, onConfirm, loading }) {
  if (!user) return null
  const isActive = user.status === 1
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      PaperProps={{ sx: { bgcolor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 3, } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography fontWeight={700} fontSize={16}>{isActive ? 'Block User' : 'Activate User'}</Typography>
      </DialogTitle>
      <Divider sx={{ borderColor: theme.border }} />
      <DialogContent sx={{ pt: 2 }}>
        <Typography fontSize={13} color={theme.muted}>
          Are you sure you want to <strong style={{ color: isActive ? '#ef4444' : '#22c55e' }}>{isActive ? 'block' : 'activate'}</strong> <strong style={{ color: '#111827' }}>{user.name}</strong>?
        </Typography>
      </DialogContent>
      <Divider sx={{ borderColor: theme.border }} />
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ color: '#B0B0B0', fontSize: 13 }}>Cancel</Button>
        <Button variant="contained" disabled={loading} onClick={onConfirm}
          sx={{ bgcolor: isActive ? '#ef4444' : '#22c55e', '&:hover': { bgcolor: isActive ? '#dc2626' : '#16a34a' }, fontSize: 13, fontWeight: 600, px: 3 }}>
          {loading ? 'Please wait...' : isActive ? 'Block' : 'Activate'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function StaffUserPage() {
  const qc = useQueryClient()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [viewId, setViewId] = useState(null)
  const [confirmUser, setConfirmUser] = useState(null)

  // ── Queries ──
  const { data, isFetching } = useQuery({
    queryKey: ['users', page, pageSize, search, statusFilter],
    queryFn: () => getUsers({ pageIndex: page, pageSize, searchText: search || undefined, status: statusFilter || undefined }),
  })

  const { data: roles = [] } = useQuery({ queryKey: ['roles-all'], queryFn: getRoles })

  const users = data?.content ?? []
  const total = data?.totalRecords ?? 0
  const totalActive = data?.totalActive ?? 0
  const totalInactive = data?.totalInActive ?? 0

  // ── Block / Unblock ──
  const blockMutation = useMutation({
    mutationFn: ({ id, status }) => api.post('/user/blockUnblock', { id, status, remark: status === 1 ? 'Activated by admin' : 'Blocked by admin' }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['users'] })
      toast.success(vars.status === 1 ? 'User activated' : 'User blocked')
      setConfirmUser(null)
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Failed to update status'),
  })

  // ── Columns ──
  const columns = [
    {
      key: 'profileUrl', label: 'Photo',
      render: (r) => r.profileUrl
        ? <Avatar src={r.profileUrl} sx={{ width: 28, height: 28 }} />
        : <Avatar sx={{ width: 28, height: 28, bgcolor: 'rgba(227,30,36,0.15)', color: '#E31E24', fontSize: 11, fontWeight: 700 }}>{r.name?.[0]?.toUpperCase()}</Avatar>,
    },
    {
      key: 'name', label: 'Name',
      render: (r) => <Typography fontSize={11} fontWeight={600} color="#111827">{r.name}</Typography>,
    },
    {
      key: 'email', label: 'Email',
      render: (r) => <Typography fontSize={11} color="#6B7280">{r.email}</Typography>,
    },
    {
      key: 'mobile', label: 'Mobile',
      render: (r) => <Typography fontSize={11} color="#374151">{r.countryCode} {r.mobileNumber}</Typography>,
    },
    {
      key: 'role', label: 'Role',
      render: (r) => {
        const role = roles.find((rl) => rl.id === r.roleId)
        return role
          ? <Chip label={role.roleName} size="small" sx={{ bgcolor: 'rgba(227,30,36,0.1)', color: '#E31E24', border: '1px solid rgba(227,30,36,0.2)', fontSize: 11, height: 20 }} />
          : <Typography fontSize={11} color="#6B7280">—</Typography>
      },
    },
    {
      key: 'city', label: 'City',
      render: (r) => <Typography fontSize={11} color="#6B7280">{r.city || '—'}</Typography>,
    },
    {
      key: 'status', label: 'Status',
      render: (r) => (
        <Chip
          label={r.status === 1 ? 'Active' : 'Inactive'}
          size="small"
          sx={{
            height: 22, fontSize: 11, fontWeight: 600,
            bgcolor: r.status === 1 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
            color: r.status === 1 ? '#22c55e' : '#ef4444',
            border: `1px solid ${r.status === 1 ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
          }}
        />
      ),
    },
    {
      key: 'createdAt', label: 'Created',
      render: (r) => <Typography fontSize={11} color="#6B7280">{r.createdAt}</Typography>,
    },
    {
      key: 'actions', label: '',
      render: (r) => (
        <Stack direction="row" gap={0.5}>
          <Tooltip title="View Details">
            <IconButton size="small" onClick={() => setViewId(r.id)}
              sx={{ color: '#A1887F', '&:hover': { color: '#111827', bgcolor: '#F3F4F6' } }}>
              <VisibilityIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => { setEditing(r); setFormOpen(true) }}
              sx={{ color: '#A1887F', '&:hover': { color: '#E31E24', bgcolor: 'rgba(227,30,36,0.08)' } }}>
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title={r.status === 1 ? 'Block' : 'Activate'}>
            <IconButton size="small" onClick={() => setConfirmUser(r)}
              sx={{ color: '#A1887F', '&:hover': { color: r.status === 1 ? '#ef4444' : '#22c55e', bgcolor: r.status === 1 ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)' } }}>
              {r.status === 1 ? <BlockIcon sx={{ fontSize: 16 }} /> : <CheckCircleIcon sx={{ fontSize: 16 }} />}
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ]

return (
  <Box
    sx={{
      width: '100%',
      maxWidth: '100%',
      overflowX: 'hidden',
    }}
  >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 800, color: theme.text }}>Staff User Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => { setEditing(null); setFormOpen(true) }}
          sx={{ bgcolor: theme.text, '&:hover': { bgcolor: '#000000' }, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', ml: 'auto' }}>
          Add User
        </Button>
      </Box>


{/* Stats */}
<Box
  sx={{
    display: 'grid',
    gridTemplateColumns: {
      xs: '1fr',
      sm: 'repeat(2,1fr)',
      lg: 'repeat(3,1fr)',
    },
    gap: 2,
    mb: 3,
  }}
>
  <StatCard
    label="Total Users"
    value={total}
    color="#E31E24"
    icon={<PeopleIcon sx={{ fontSize: 20, color: '#E31E24' }} />}
  />

  <StatCard
    label="Active Users"
    value={totalActive}
    color="#22C55E"
    icon={<CheckCircleIcon sx={{ fontSize: 20, color: '#22C55E' }} />}
  />

  <StatCard
    label="Inactive Users"
    value={totalInactive}
    color="#F59E0B"
    icon={<PersonOffIcon sx={{ fontSize: 20, color: '#F59E0B' }} />}
  />
</Box>

      {/* Toolbar */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography sx={{ fontSize: 12, color: theme.muted }}>
          {total > 0 ? `Showing ${users.length} of ${total} users` : ''}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <TextField
            size="small"
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0) }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 16, color: '#A1887F' }} /></InputAdornment> }}
            sx={{
              width: 220,
              '& .MuiOutlinedInput-root': 
              { bgcolor: theme.surface, height: 34, overflow: 'visible',
                 '& fieldset': { borderColor: theme.border }, 
                 '&:hover fieldset': { borderColor: '#444' }, 
                 '&.Mui-focused fieldset': { borderColor: theme.text } },
              '& .MuiInputBase-input': { color: '#1E1E1E', fontSize: 12, py: 0 },
              '& input::placeholder': {
    color: theme.muted,
    opacity: 1,
  },
              
            }}
          />
          <Box sx={{ width: '1px', height: 20, bgcolor: theme.border }} />
          <Select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0) }}
            displayEmpty
            size="small"
            sx={{ bgcolor: theme.surface, fontSize: 12, height: 34,
               minWidth: 120, 
               color: '#1E1E1E',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: theme.border }, '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#444' }, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: theme.text }, '& .MuiSvgIcon-root': { color: '#A1887F' } }}
          >
            <MenuItem value="" sx={{ fontSize: 12 }}>All Status</MenuItem>
            <MenuItem value="1" sx={{ fontSize: 12 }}>Active</MenuItem>
            <MenuItem value="2" sx={{ fontSize: 12 }}>Inactive</MenuItem>
          </Select>
        </Box>
      </Box>

      {/* Table */}
{/* Table */}
<Box
  sx={{
    width: '100%',
    overflowX: 'auto',
  }}
>
  <Box
  sx={{
    width: '100%',
    maxWidth: '100%',
    overflowX: 'auto',
  }}
>
  <DataTable
    columns={columns}
    rows={users}
    total={total}
    page={page}
    pageSize={pageSize}
    onPageChange={setPage}
    onPageSizeChange={(s) => {
      setPageSize(s)
      setPage(0)
    }}
    loading={isFetching}
  />
  </Box>
</Box>

      {/* Dialogs */}
      {formOpen && (
        <UserFormDialog
          open={formOpen}
          onClose={() => { setFormOpen(false); setEditing(null) }}
          editing={editing}
          roles={roles}
          onSaved={() => { setFormOpen(false); setEditing(null); qc.invalidateQueries({ queryKey: ['users'] }) }}
        />
      )}

      <ViewDialog userId={viewId} onClose={() => setViewId(null)} />

      <ConfirmDialog
        open={!!confirmUser}
        user={confirmUser}
        onClose={() => setConfirmUser(null)}
        loading={blockMutation.isPending}
        onConfirm={() => blockMutation.mutate({ id: confirmUser.id, status: confirmUser.status === 1 ? 2 : 1 })}
      />
    </Box>
  )
}
 
