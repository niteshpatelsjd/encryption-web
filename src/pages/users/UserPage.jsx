import { useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  MenuItem,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
} from '@mui/material'

import SearchIcon from '@mui/icons-material/Search'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DeleteIcon from '@mui/icons-material/Delete'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import HourglassTopIcon from '@mui/icons-material/HourglassTop'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import EditIcon from '@mui/icons-material/Edit'
import BlockIcon from '@mui/icons-material/Block'
import DevicesIcon from '@mui/icons-material/Devices'
import RefreshIcon from '@mui/icons-material/Refresh'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import api from '../../api/axiosInstance'
import DataTable from '../../components/common/DataTable'
import { getUserDevices, revokeUserDevice } from '../../api/deviceService'

const getUsers = (params) =>
  api
    .get('/mobileUser/getAllUsers', { params })
    .then((r) => r.data.responseBody)

const blockUnblockUser = (payload) =>
  api.post('/mobileUser/blockUnblockUser', payload)

const updateMobileUser = ({ id, values }) => {
  const formData = new FormData()
  formData.append('id', id)
  Object.entries(values).forEach(([key, value]) => {
    formData.append(key, value ?? '')
  })
  return api.post('/mobileUser/createProfile', formData)
}

const getUserProfile = (id) =>
  api
    .get('/mobileUser/getProfile', {
      params: { id },
    })
    .then((r) => r.data.responseBody)

const primary = '#7A1E1E'
const theme = {
  text: '#111827',
  muted: '#6B7280',
  border: '#E5E7EB',
  soft: '#F9FAFB',
}

const filterStyle = {
  minWidth: 190,

  '& .MuiOutlinedInput-root': {
    bgcolor: '#FFFFFF',
    borderRadius: 3,

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
  },

        '& .MuiInputBase-input, & .MuiSelect-select': {
    color: '#1E293B',
    fontSize: 13,
    WebkitTextFillColor: '#1E293B',
  },
}

const statIconStyle = {
  fontSize: 28,
}

function getUserId(user) {
  return user?.id || user?._id || user?.userId || ''
}

function getStatusMeta(status) {
  if (status === 1 || status === '1') {
    return {
      label: 'Active',
      color: '#15803D',
      bg: '#DCFCE7',
      border: '#BBF7D0',
    }
  }

  if (status === 0 || status === '0') {
    return {
      label: 'Deleted',
      color: '#6B7280',
      bg: '#F3F4F6',
      border: '#E5E7EB',
    }
  }

  return {
    label: 'Blocked',
    color: '#B91C1C',
    bg: '#FEE2E2',
    border: '#FECACA',
  }
}

function StatusChip({ status }) {
  const meta = getStatusMeta(status)

  return (
    <Chip
      size="small"
      label={meta.label}
      sx={{
        bgcolor: meta.bg,
        color: meta.color,
        border: `1px solid ${meta.border}`,
        fontWeight: 800,
      }}
    />
  )
}

function StatCard({ label, value, icon, color }) {
  return (
    <Card
      sx={{
        borderRadius: 4,
        border: `1px solid ${theme.border}`,
        background: '#FFFFFF',
        boxShadow: '0 12px 30px rgba(17,24,39,0.06)',
      }}
    >
      <CardContent sx={{ p: '18px !important' }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{
            minHeight: 76,
            width: '100%',
          }}
        >
          <Box
            sx={{
              minWidth: 0,
              flex: 1,
            }}
          >
            <Typography sx={{ color: theme.muted, fontSize: 13, fontWeight: 700 }}>
              {label}
            </Typography>
            <Typography sx={{ color: theme.text, fontSize: 30, fontWeight: 900 }}>
              {value}
            </Typography>
          </Box>

          <Avatar
            sx={{
              bgcolor: `${color}18`,
              color,
              width: 54,
              height: 54,
              borderRadius: 3,
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

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

function DetailItem({ label, value }) {
  return (
    <Box
      sx={{
        p: 1.6,
        border: `1px solid ${theme.border}`,
        borderRadius: 3,
        bgcolor: '#FFFFFF',
      }}
    >
      <Typography
        sx={{
          color: theme.muted,
          fontSize: 11,
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          mb: 0.7,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          color: '#111827',
          fontSize: 14,
          fontWeight: 700,
          wordBreak: 'break-word',
        }}
      >
        {value || '-'}
      </Typography>
    </Box>
  )
}

function DeviceStatusChip({ status }) {
  const active = status === 'ACTIVE'
  return (
    <Chip
      size="small"
      label={status || '—'}
      sx={{
        bgcolor: active ? '#DCFCE7' : '#FEE2E2',
        color: active ? '#15803D' : '#B91C1C',
        border: `1px solid ${active ? '#BBF7D0' : '#FECACA'}`,
        fontWeight: 800,
      }}
    />
  )
}

function DeviceManagementSection({ userId }) {
  const queryClient = useQueryClient()
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [status, setStatus] = useState('ALL')
  const [revokeDevice, setRevokeDevice] = useState(null)

  const queryKey = ['user-devices', userId, pageIndex, pageSize, status]
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: () => getUserDevices({ userId, pageIndex, pageSize, status }),
    enabled: Boolean(userId),
    retry: false,
  })

  const revokeMutation = useMutation({
    mutationFn: revokeUserDevice,
    onSuccess: () => {
      setRevokeDevice(null)
      toast.success('Device revoked successfully')
      queryClient.invalidateQueries({ queryKey: ['user-devices', userId] })
    },
    onError: (requestError) => {
      const statusCode = requestError?.response?.status
      const fallback = {
        403: 'You do not have permission to revoke this device',
        404: 'Device or user was not found',
        500: 'Server error while revoking the device',
      }[statusCode]
      toast.error(
        requestError?.response?.data?.message ||
        requestError?.message ||
        fallback ||
        'Unable to revoke device'
      )
    },
  })

  const rows = data?.content ?? []
  const getDeviceId = (device) => device?.deviceId || device?.id || device?._id || ''
  const dateValue = (device, ...keys) => keys.map((key) => device?.[key]).find(Boolean) || '—'

  const columns = [
    { key: 'deviceName', label: 'Device name', render: (row) => row.deviceName || row.name || '—' },
    { key: 'deviceId', label: 'Device ID', render: (row) => <Typography sx={{ fontSize: 11, fontFamily: 'monospace', maxWidth: 180, overflowWrap: 'anywhere' }}>{getDeviceId(row) || '—'}</Typography> },
    { key: 'deviceType', label: 'Device type', render: (row) => row.deviceType || row.platform || '—' },
    { key: 'identityKeyAlgorithm', label: 'Identity-key algorithm', render: (row) => row.identityKeyAlgorithm || row.identityAlgorithm || row.algorithm || '—' },
    { key: 'registrationId', label: 'Registration ID', render: (row) => row.registrationId ?? '—' },
    { key: 'status', label: 'Status', render: (row) => <DeviceStatusChip status={row.status} /> },
    { key: 'lastSeen', label: 'Last seen', render: (row) => dateValue(row, 'lastSeen', 'lastSeenAt') },
    { key: 'registeredAt', label: 'Registered date', render: (row) => dateValue(row, 'registeredAt', 'registeredDate', 'createdAt') },
    { key: 'revokedAt', label: 'Revoked date', render: (row) => dateValue(row, 'revokedAt', 'revokedDate') },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => row.status === 'ACTIVE' ? (
        <Button
          size="small"
          variant="outlined"
          color="error"
          startIcon={<BlockIcon />}
          onClick={() => setRevokeDevice(row)}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 800, whiteSpace: 'nowrap' }}
        >
          Revoke
        </Button>
      ) : '—',
    },
  ]

  return (
    <Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 1.5, mb: 2 }}>
        <StatCard label="Total devices" value={data?.totalRecords ?? 0} color="#111827" icon={<DevicesIcon />} />
        <StatCard label="Active devices" value={data?.totalActive ?? 0} color="#16A34A" icon={<CheckCircleIcon />} />
        <StatCard label="Revoked devices" value={data?.totalRevoked ?? 0} color="#DC2626" icon={<PersonOffIcon />} />
      </Box>

      <Card sx={{ mb: 2, borderRadius: 3, border: `1px solid ${theme.border}`, boxShadow: 'none' }}>
        <CardContent sx={{ p: '16px !important' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} spacing={1.5}>
            <Box>
              <Typography sx={{ fontSize: 17, fontWeight: 900, color: theme.text }}>Registered Devices</Typography>
              <Typography sx={{ fontSize: 12, color: theme.muted }}>Identity-key public material is intentionally hidden.</Typography>
            </Box>
            <TextField
              select
              size="small"
              label="Status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value)
                setPageIndex(0)
              }}
              sx={{ ...filterStyle, minWidth: 170 }}
            >
              <MenuItem value="ACTIVE">Active</MenuItem>
              <MenuItem value="REVOKED">Revoked</MenuItem>
              <MenuItem value="ALL">All</MenuItem>
            </TextField>
          </Stack>
        </CardContent>
      </Card>

      {isError ? (
        <Alert
          severity="error"
          action={<Button color="inherit" size="small" startIcon={<RefreshIcon />} onClick={() => refetch()}>Retry</Button>}
          sx={{ borderRadius: 3 }}
        >
          {error?.response?.data?.message || error?.message || 'Unable to load devices'}
        </Alert>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          total={data?.totalRecords ?? 0}
          page={data?.pageIndex ?? pageIndex}
          pageSize={data?.pageSize ?? pageSize}
          onPageChange={(nextPage) => setPageIndex(nextPage)}
          onPageSizeChange={(nextSize) => {
            setPageSize(nextSize)
            setPageIndex(0)
          }}
          loading={isLoading || isFetching}
          maxHeight={390}
          emptyText="No devices found for this user"
        />
      )}

      <Dialog
        open={Boolean(revokeDevice)}
        onClose={revokeMutation.isPending ? undefined : () => setRevokeDevice(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 900, color: theme.text }}>Revoke device?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: theme.muted, lineHeight: 1.7 }}>
            Revoking this device will terminate its active sessions and remove its public prekeys. The user must register the device again before using it.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button disabled={revokeMutation.isPending} onClick={() => setRevokeDevice(null)} sx={{ color: theme.muted }}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            disabled={revokeMutation.isPending}
            startIcon={revokeMutation.isPending ? <CircularProgress size={16} color="inherit" /> : <BlockIcon />}
            onClick={() => revokeMutation.mutate({ userId, deviceId: getDeviceId(revokeDevice) })}
            sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 800 }}
          >
            Revoke device
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

function UserDetailDialog({
  user,
  onClose,
  onBlockToggle,
  onDelete,
}) {
  const userId = getUserId(user)
  const [profileTab, setProfileTab] = useState(0)

  const { data: profile, isFetching: profileLoading } = useQuery({
    queryKey: ['mobile-user-profile', userId],
    queryFn: () => getUserProfile(userId),
    enabled: Boolean(userId),
  })

  const detailUser = profile || user

  const fullName =
    detailUser?.name ||
    [detailUser?.firstName, detailUser?.lastName]
      .filter(Boolean)
      .join(' ')

  return (
    <Box
      sx={{
        minHeight: '100%',
        bgcolor: '#FFFFFF',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: { xs: 0, md: 4 },
        border: { md: `1px solid ${theme.border}` },
        boxShadow: { md: '0 12px 34px rgba(15,23,42,0.07)' },
      }}
    >
      <Button
        onClick={onClose}
        startIcon={<ArrowBackIcon />}
        sx={{
          position: 'absolute',
          top: 20,
          left: 24,
          zIndex: 3,
          color: '#FFFFFF',
          bgcolor: 'rgba(255,255,255,0.14)',
          border: '1px solid rgba(255,255,255,0.28)',
          borderRadius: 2.5,
          px: 2,
          py: 0.9,
          fontWeight: 800,
          textTransform: 'none',

          '&:hover': {
            bgcolor: 'rgba(255,255,255,0.22)',
          },
        }}
      >
        Back to User Management
      </Button>

      <Box
        sx={{
          px: { xs: 2.5, md: 5 },
          pt: 10,
          pb: 4,
          background: 'linear-gradient(135deg, #0B0B0D, #1F2937)',
          color: '#FFFFFF',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ maxWidth: 1440, mx: 'auto' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={detailUser?.profileUrl}
              sx={{
                width: 86,
                height: 86,
                border: '3px solid rgba(255,255,255,0.35)',
                bgcolor: 'rgba(255,255,255,0.18)',
                fontSize: 32,
                fontWeight: 900,
              }}
            >
              {fullName?.[0] || 'U'}
            </Avatar>

            <Box>
              <Typography sx={{ fontSize: 25, fontWeight: 900, lineHeight: 1.1 }}>
                {fullName || 'User'}
              </Typography>
              <Typography sx={{ opacity: 0.88, mt: 0.7 }}>
                {detailUser?.mobileNumber || '-'} {detailUser?.email ? `• ${detailUser.email}` : ''}
              </Typography>

              <Stack direction="row" spacing={1} mt={1.4} flexWrap="wrap" useFlexGap>
                <StatusChip status={detailUser?.status} />
                {detailUser?.isPrivate && (
                  <Chip
                    size="small"
                    label="Private Profile"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.16)',
                      color: '#FFFFFF',
                      fontWeight: 800,
                    }}
                  />
                )}
              </Stack>
            </Box>
          </Stack>

          <Box sx={{ width: 44, flexShrink: 0 }} />
        </Stack>
      </Box>

      <Box sx={{ px: { xs: 2, md: 5 }, borderBottom: `1px solid ${theme.border}`, bgcolor: '#FFFFFF' }}>
        <Tabs
          value={profileTab}
          onChange={(_, value) => setProfileTab(value)}
          sx={{ maxWidth: 1440, mx: 'auto', '& .MuiTab-root': { minHeight: 58, fontWeight: 800, textTransform: 'none' }, '& .Mui-selected': { color: `${primary} !important` }, '& .MuiTabs-indicator': { bgcolor: primary, height: 3 } }}
        >
          <Tab label="Profile" />
          <Tab label="Devices" icon={<DevicesIcon />} iconPosition="start" />
        </Tabs>
      </Box>

      <Box sx={{ px: { xs: 2, md: 5 }, py: 4, bgcolor: '#F5F7FA' }}>
        <Box sx={{ maxWidth: 1440, mx: 'auto' }}>
        {profileTab === 0 ? (
          <>
        {profileLoading && (
          <Typography sx={{ color: theme.muted, fontSize: 13, mb: 2, fontWeight: 700 }}>
            Loading full profile...
          </Typography>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, minmax(0, 1fr))',
            },
            gap: 2,
          }}
        >
          <DetailItem label="User ID" value={getUserId(detailUser)} />
          <DetailItem label="Full Name" value={detailUser?.name || fullName} />
          <DetailItem label="Email" value={detailUser?.email} />
          <DetailItem
            label="Mobile Number"
            value={`${detailUser?.countryCode || ''} ${detailUser?.mobileNumber || ''}`.trim()}
          />
          <DetailItem label="Gender" value={detailUser?.gender} />
          <DetailItem label="Device Type" value={detailUser?.deviceType || 'Not registered'} />
          <DetailItem label="Last Login" value={detailUser?.lastLogin || 'No login yet'} />
          <DetailItem label="Profile Completed" value={detailUser?.profileCompleted ? 'Yes' : 'No'} />
          <DetailItem label="Email Confirmed" value={detailUser?.isEmailVerified ? 'Yes' : 'No'} />
          <DetailItem label="Notifications" value={detailUser?.notificationEnable ? 'Enabled' : 'Disabled'} />
          <DetailItem label="Created At" value={detailUser?.createdAt} />
          <DetailItem label="Updated At" value={detailUser?.updatedAt} />
        </Box>

          </>
        ) : (
          <DeviceManagementSection userId={userId} />
        )}
        </Box>
      </Box>

      {profileTab === 0 && (
      <Box
        sx={{
          px: { xs: 2, md: 5 },
          py: 2,
          bgcolor: theme.soft,
          borderTop: `1px solid ${theme.border}`,
          flexWrap: 'wrap',
          gap: 1,
          position: 'sticky',
          bottom: 0,
          zIndex: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <Button
          variant="outlined"
          startIcon={detailUser?.status === 1 ? <PersonOffIcon /> : <CheckCircleIcon />}
          onClick={() => onBlockToggle(detailUser)}
          sx={{
            borderColor: detailUser?.status === 1 ? '#DC2626' : '#16A34A',
            color: detailUser?.status === 1 ? '#DC2626' : '#16A34A',
          }}
        >
          {detailUser?.status === 1 ? 'Block' : 'Unblock'}
        </Button>

        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => onDelete(detailUser)}
        >
          Delete
        </Button>
      </Box>
      )}
    </Box>
  )
}

function ConfirmDialog({
  action,
  user,
  loading,
  onClose,
  onConfirm,
}) {
  const titleMap = {
    block: 'Block User',
    unblock: 'Unblock User',
    delete: 'Delete User',
  }

  const name =
    user?.name ||
    [user?.firstName, user?.lastName].filter(Boolean).join(' ')

  return (
    <Dialog open={!!user && !!action} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ color: theme.text, fontWeight: 900 }}>
        {titleMap[action] || 'Confirm Action'}
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: '#374151' }}>
          Are you sure you want to {action} <strong>{name || 'this user'}</strong>?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          color={action === 'unblock' ? 'success' : 'error'}
          disabled={loading}
          onClick={onConfirm}
        >
          {loading ? 'Saving...' : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default function UserPage() {
  const qc = useQueryClient()

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [viewUser, setViewUser] = useState(null)
  const [editUser, setEditUser] = useState(null)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    countryCode: '+91',
    mobileNumber: '',
    occupation: '',
    gender: '',
  })
  const [confirmState, setConfirmState] = useState({
    action: '',
    user: null,
  })

  const { data, isFetching } = useQuery({
    queryKey: [
      'users',
      page,
      pageSize,
      search,
      statusFilter,
    ],
    queryFn: () =>
      getUsers({
        pageIndex: page,
        pageSize,
        searchText: search || undefined,
        status: statusFilter || undefined,
      }),
  })

  const blockMutation = useMutation({
    mutationFn: blockUnblockUser,
    onSuccess: (_, variables) => {
      toast.success(
        variables.status === 0
          ? 'User deleted'
          : variables.status === 1
            ? 'User unblocked'
            : 'User blocked'
      )
      qc.invalidateQueries({ queryKey: ['users'] })
      setConfirmState({ action: '', user: null })
      setViewUser(null)
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to update status'),
  })

  const editMutation = useMutation({
    mutationFn: updateMobileUser,
    onSuccess: () => {
      toast.success('Mobile user updated')
      qc.invalidateQueries({ queryKey: ['users'] })
      setEditUser(null)
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Failed to update mobile user'),
  })

  const users = useMemo(
    () => data?.content ?? [],
    [data?.content]
  )
  const total = data?.totalRecords ?? 0

  const stats = useMemo(() => {
    const active = data?.totalActive ?? users.filter((u) => u.status === 1).length
    const inactive = data?.totalInActive ?? users.filter((u) => u.status !== 1).length
    const incomplete = users.filter((u) => !u.profileCompleted).length

    return {
      total: total || users.length,
      active,
      inactive,
      incomplete,
    }
  }, [users, total, data?.totalActive, data?.totalInActive])

  const openConfirm = (action, user) =>
    setConfirmState({ action, user })

  const openEdit = (user) => {
    setEditUser(user)
    setEditForm({
      name: user?.name || '',
      email: user?.email || '',
      countryCode: user?.countryCode || '+91',
      mobileNumber: user?.mobileNumber || '',
      occupation: user?.occupation || '',
      gender: user?.gender || '',
    })
  }

  const confirmStatusAction = () => {
    const { action, user } = confirmState
    if (!user) return

    const status =
      action === 'delete'
        ? 0
        : action === 'unblock'
          ? 1
          : 2

    blockMutation.mutate({
      id: getUserId(user),
      status,
    })
  }

  const columns = [
    {
      key: 'profile',
      label: 'User',
      render: (r) => {
        const name =
          r.name ||
          [r.firstName, r.lastName].filter(Boolean).join(' ')

        return (
          <Stack direction="row" spacing={1.4} alignItems="center" sx={{ minWidth: 230 }}>
            <Avatar
              src={r.profileUrl}
              sx={{
                width: 42,
                height: 42,
                bgcolor: 'rgba(122,30,30,0.10)',
                color: primary,
                fontWeight: 900,
              }}
            >
              {name?.[0] || 'U'}
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 900, color: '#111827' }}>
                {name || '-'}
              </Typography>
              <Typography sx={{ fontSize: 11, color: '#64748B' }}>
                ID: {getUserId(r) || '-'}
              </Typography>
            </Box>
          </Stack>
        )
      },
    },
    {
      key: 'mobileNumber',
      label: 'Contact',
      render: (r) => (
        <Box sx={{ minWidth: 150 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 800 }}>
            {r.mobileNumber || '-'}
          </Typography>
          <Typography sx={{ fontSize: 11, color: '#64748B' }}>{r.email || '-'}</Typography>
        </Box>
      ),
    },
    {
      key: 'deviceType',
      label: 'Device',
      render: (r) => (
        <Box sx={{ minWidth: 120 }}>
          <Typography sx={{ fontSize: 12, fontWeight: 800 }}>
            {r.deviceType || 'Not registered'}
          </Typography>
          <Typography sx={{ fontSize: 11, color: '#64748B' }}>
            {r.lastLogin ? `Last login: ${r.lastLogin}` : 'No login yet'}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'profileCompleted',
      label: 'Profile',
      render: (r) => (
        <Chip
          size="small"
          label={r.profileCompleted ? 'Completed' : 'Incomplete'}
          sx={{
            bgcolor: r.profileCompleted ? '#DCFCE7' : '#FEF3C7',
            color: r.profileCompleted ? '#15803D' : '#B45309',
            fontWeight: 800,
          }}
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => <StatusChip status={r.status} />,
    },
    {
      key: 'createdAt',
      label: 'Created At',
      render: (r) => r.createdAt || '—',
    },
    {
      key: 'actions',
      label: '',
      render: (r) => (
        <Stack direction="row" spacing={0.4} alignItems="center">
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => setViewUser(r)}
              sx={{
                color: '#A1887F',
                '&:hover': { color: primary, bgcolor: 'rgba(122,30,30,0.08)' },
              }}
            >
              <VisibilityIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={() => openEdit(r)}
              sx={{
                color: '#A1887F',
                '&:hover': { color: '#E31E24', bgcolor: 'rgba(227,30,36,0.08)' },
              }}
            >
              <EditIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>

          <Tooltip title={r.status === 1 ? 'Block' : 'Unblock'}>
            <IconButton
              size="small"
              onClick={() => openConfirm(r.status === 1 ? 'block' : 'unblock', r)}
              sx={{
                color: '#A1887F',
                '&:hover': {
                  color: r.status === 1 ? '#EF4444' : '#22C55E',
                  bgcolor: r.status === 1
                    ? 'rgba(239,68,68,0.08)'
                    : 'rgba(34,197,94,0.08)',
                },
              }}
            >
              {r.status === 1
                ? <BlockIcon sx={{ fontSize: 16 }} />
                : <CheckCircleIcon sx={{ fontSize: 16 }} />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              size="small"
              onClick={() => openConfirm('delete', r)}
              sx={{
                color: '#A1887F',
                '&:hover': { color: '#EF4444', bgcolor: 'rgba(239,68,68,0.08)' },
              }}
            >
              <DeleteIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>

        </Stack>
      ),
    },
  ]

  if (viewUser) {
    return (
      <Box>
        <UserDetailDialog
          user={viewUser}
          onClose={() => setViewUser(null)}
          onBlockToggle={(selectedUser) =>
            openConfirm(
              selectedUser?.status === 1 ? 'block' : 'unblock',
              selectedUser
            )
          }
          onDelete={(selectedUser) => openConfirm('delete', selectedUser)}
        />

        <ConfirmDialog
          action={confirmState.action}
          user={confirmState.user}
          loading={blockMutation.isPending}
          onClose={() => setConfirmState({ action: '', user: null })}
          onConfirm={confirmStatusAction}
        />
      </Box>
    )
  }

  return (
    <Box>
      <Stack
        direction="row"
        justifyContent="flex-start"
        alignItems="center"
        spacing={2}
        sx={{
          mb: 3,
          width: '100%',
          minHeight: 54,
          position: 'relative',
          pr: { xs: 0, sm: 24 },
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 24, fontWeight: 900, color: theme.text }}>
            User Management
          </Typography>
          <Typography sx={{ color: theme.muted, fontSize: 13, mt: 0.5 }}>
            Review mobile users, profile details, devices, and account access.
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/mobile-user-devices"
          variant="contained"
          startIcon={<VerifiedUserIcon />}
          sx={{
            position: 'absolute',
            top: '50%',
            right: 0,
            transform: 'translateY(-50%)',
            flexShrink: 0,
            bgcolor: '#111827',
            borderRadius: 3,
            px: 2.5,
            py: 1.1,
            fontWeight: 800,
            '&:hover': { bgcolor: '#1F2937' },
          }}
        >
          Device Provisioning
        </Button>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 2,
          mb: 3,
        }}
      >
        <StatCard label="Total Users" value={stats.total} color="#7A1E1E" icon={<VerifiedUserIcon sx={statIconStyle} />} />
        <StatCard label="Active" value={stats.active} color="#16A34A" icon={<CheckCircleIcon sx={statIconStyle} />} />
        <StatCard label="Inactive" value={stats.inactive} color="#DC2626" icon={<PersonOffIcon sx={statIconStyle} />} />
        <StatCard label="Incomplete Profiles" value={stats.incomplete} color="#F59E0B" icon={<HourglassTopIcon sx={statIconStyle} />} />
      </Box>

      <Card
        sx={{
          mb: 2.5,
          borderRadius: 4,
          border: `1px solid ${theme.border}`,
          boxShadow: '0 10px 28px rgba(17,24,39,0.06)',
        }}
      >
        <CardContent sx={{ p: '18px !important' }}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            alignItems={{ xs: 'stretch', md: 'center' }}
          >
            <TextField
              size="small"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPage(0)
              }}
              placeholder="Search by name or mobile..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ fontSize: 18, color: '#8A6D3B' }} />
                  </InputAdornment>
                ),
              }}
              sx={{ ...filterStyle, flex: 1 }}
            />

            <TextField
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(0)
              }}
              sx={filterStyle}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="1">Active</MenuItem>
              <MenuItem value="2">Inactive</MenuItem>
            </TextField>

          </Stack>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        rows={users}
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(0)
        }}
        loading={isFetching}
      />

      <Dialog
        open={Boolean(editUser)}
        onClose={() => setEditUser(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle sx={{ color: theme.text, fontWeight: 900 }}>
          Edit Mobile User
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Full Name"
              value={editForm.name}
              onChange={(event) => setEditForm({ ...editForm, name: event.target.value })}
              fullWidth
              required
              sx={filterStyle}
            />
            <TextField
              label="Email"
              type="email"
              value={editForm.email}
              onChange={(event) => setEditForm({ ...editForm, email: event.target.value })}
              fullWidth
              required
              sx={filterStyle}
            />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Country Code"
                value={editForm.countryCode}
                onChange={(event) => setEditForm({ ...editForm, countryCode: event.target.value })}
                sx={{ ...filterStyle, minWidth: 135 }}
              />
              <TextField
                label="Mobile Number"
                value={editForm.mobileNumber}
                onChange={(event) => setEditForm({ ...editForm, mobileNumber: event.target.value })}
                fullWidth
                required
                sx={filterStyle}
              />
            </Stack>
            <TextField
              label="Occupation"
              value={editForm.occupation}
              onChange={(event) => setEditForm({ ...editForm, occupation: event.target.value })}
              fullWidth
              sx={filterStyle}
            />
            <TextField
              select
              label="Gender"
              value={editForm.gender}
              onChange={(event) => setEditForm({ ...editForm, gender: event.target.value })}
              fullWidth
              sx={filterStyle}
            >
              <MenuItem value="">Not specified</MenuItem>
              <MenuItem value="MALE">Male</MenuItem>
              <MenuItem value="FEMALE">Female</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setEditUser(null)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={editMutation.isPending || !editForm.name.trim() || !editForm.email.trim() || !editForm.mobileNumber.trim()}
            onClick={() => editMutation.mutate({
              id: getUserId(editUser),
              values: editForm,
            })}
            sx={{ bgcolor: '#111827', '&:hover': { bgcolor: '#1F2937' } }}
          >
            {editMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        action={confirmState.action}
        user={confirmState.user}
        loading={blockMutation.isPending}
        onClose={() => setConfirmState({ action: '', user: null })}
        onConfirm={confirmStatusAction}
      />
    </Box>
  )
}
