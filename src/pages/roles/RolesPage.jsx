import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Divider,
  Stack,
  Card,
  CardContent,
  Checkbox,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  InputAdornment,
  Avatar,
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import BlockIcon from '@mui/icons-material/Block'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import DeleteIcon from '@mui/icons-material/Delete'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import toast from 'react-hot-toast'

import api from '../../api/axiosInstance'
import DataTable from '../../components/common/DataTable'

/* ───────────────── API ───────────────── */

const getRoles = (params) =>
  api
    .get('/role/getAllRole', { params })
    .then((r) => r.data.responseBody)

const getModules = () =>
  api
    .get('/module/getAllModule', {
      params: {
        pageIndex: 0,
        pageSize: 100,
      },
    })
    .then((r) => r.data.responseBody?.content ?? [])

const getRoleInfo = (id) =>
  api
    .get('/role/info', {
      params: { roleId: id },
    })
    .then((r) => r.data.responseBody)

/* ───────────────── CONSTANTS ───────────────── */

const ACTIONS = [
  { key: 'moduleAction', label: 'Access' },
  { key: 'addAction', label: 'Add' },
  { key: 'updateAction', label: 'Update' },
  { key: 'deleteAction', label: 'Delete' },
  { key: 'viewAction', label: 'View' },
  { key: 'downloadAction', label: 'Download' },
]

const schema = yup.object({
  roleName: yup.string().required('Role name is required'),
  roleDescription: yup.string(),
})

const theme = {
  text: '#111827',
  muted: '#6B7280',
  border: '#E5E7EB',
  soft: '#F9FAFB',
  surface: '#FFFFFF',
}

/* ───────────────── STAT CARD ───────────────── */

function StatCard({ label, value, icon, color }) {
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
      <CardContent sx={{ p: '16px !important' }}>
        <Stack direction="row" alignItems="flex-start">
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

          <Avatar
            sx={{
              bgcolor: `${color}18`,
              color,
              width: 52,
              height: 52,
              borderRadius: 3,

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

/* ───────────────── INFO FIELD ───────────────── */

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
          cursor: 'default',
        },
      }}
    />
  )
}

/* ───────────────── VIEW DIALOG ───────────────── */

function ViewDialog({ roleId, onClose }) {
  const { data, isLoading } = useQuery({
    queryKey: ['role-info', roleId],
    queryFn: () => getRoleInfo(roleId),
    enabled: !!roleId,
  })

  return (
    <Dialog
      open={!!roleId}
      onClose={onClose}
      maxWidth="md"
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
          Role Details
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
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 3,
              }}
            >
              

              
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2.2,
              }}
            >
              <InfoField
                label="Role Name"
                value={data.roleName}
              />

              <InfoField
                label="Description"
                value={data.roleDescription}
              />

              <InfoField
                label="Created At"
                value={data.createdAt}
              />

              <InfoField
                label="Updated At"
                value={data.updatedAt}
              />

              {/* PERMISSIONS */}
              <Box>
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: theme.text,
                    mb: 1.5,
                  }}
                >
                  Module Permissions
                </Typography>

                <Box
                  sx={{
                    border: `1px solid ${theme.border}`,
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ bgcolor: theme.soft }}>
                        <TableCell
                          sx={{
                            fontWeight: 700,
                            color: theme.text,
                          }}
                        >
                          Module
                        </TableCell>

                        {ACTIONS.map((a) => (
                          <TableCell
                            key={a.key}
                            align="center"
                            sx={{
                              fontWeight: 700,
                              color: theme.text,
                              fontSize: 11,
                            }}
                          >
                            {a.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {(data.roleModuleList ?? []).map((m) => (
                        <TableRow key={m.id}>
                          <TableCell
                            sx={{
                              fontSize: 13,
                              color: '#1E1E1E',
                              fontWeight: 600,
                            }}
                          >
                            {m.moduleName || '—'}
                          </TableCell>

                          {ACTIONS.map((a) => (
                            <TableCell
                              key={a.key}
                              align="center"
                            >
                              <Checkbox
                                checked={m[a.key] === 1}
                                disabled
                                sx={{
                                  color: '#D6BFAE',

                                  '&.Mui-checked': {
                                    color: '#7A1E1E',
                                  },
                                }}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              </Box>
            </Box>
          </Box>
        ) : null}
      </DialogContent>

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

/* ───────────────── ROLE FORM DIALOG ───────────────── */

function RoleFormDialog({
  open,
  onClose,
  editing,
  modules,
  onSaved,
}) {
const [permissions, setPermissions] = useState([])

useEffect(() => {
  if (!modules?.length) return

  const mappedModules = modules.map((m) => {
    const existing =
      editing?.roleModuleList?.find(
        (e) =>
          String(e.moduleId) === String(m.id)
      )

    return {
      moduleId: m.id,
      moduleName: m.moduleName,
      moduleCode: m.moduleCode,

      moduleAction:
        existing?.moduleAction || 0,

      addAction:
        existing?.addAction || 0,

      updateAction:
        existing?.updateAction || 0,

      deleteAction:
        existing?.deleteAction || 0,

      viewAction:
        existing?.viewAction || 0,

      downloadAction:
        existing?.downloadAction || 0,

      status: existing?.status || 1,
    }
  })

  setPermissions(mappedModules)
}, [modules, editing, open])
 const {
  register,
  handleSubmit,
  reset,
  formState: { errors, isSubmitting },
} = useForm({
  resolver: yupResolver(schema),

  defaultValues: {
    roleName: '',
    roleDescription: '',
  },
})
useEffect(() => {
  reset({
    roleName: editing?.roleName || '',
    roleDescription:
      editing?.roleDescription || '',
  })
}, [editing, open, reset])

  const toggle = (idx, action) => {
    setPermissions((prev) =>
      prev.map((p, i) =>
        i === idx
          ? {
              ...p,
              [action]:
                p[action] === 1 ? 0 : 1,
            }
          : p
      )
    )
  }

  const onSubmit = async (values) => {
    try {
      const body = {
        roleName: values.roleName,
        roleDescription:
          values.roleDescription,
        status: 1,
        roleModuleRequestList: permissions,
      }

      if (editing) {
        body.id = editing.id
      }

      await api.post(
        '/role/addRole',
        body
      )

      toast.success(
        editing
          ? 'Role updated'
          : 'Role created'
      )

      onSaved()
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Failed to save role'
      )
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
    },

    ...props,
  })

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 3,
          pt: 2,
          pb: 3,
          bgcolor: theme.soft,
          borderBottom:
            `1px solid ${theme.border}`,
        }}
      >
        <Typography
          sx={{
            fontSize: 18,
            fontWeight: 700,
            color: theme.text,
          }}
        >
          {editing
            ? 'Edit Role'
            : 'Add New Role'}
        </Typography>

        <IconButton
  size="small"
  onClick={onClose}
  sx={{
    color: '#1E1E1E',

    '&:hover': {
      bgcolor: theme.soft,
      color: theme.text,
    },
  }}
>
  <CloseIcon />
</IconButton>
      </DialogTitle>

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
          id="role-form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2.2,
          }}
        >
          <TextField
            label="Role Name"
            {...field({
              ...register('roleName'),
              error: !!errors.roleName,
              helperText:
                errors.roleName?.message,
            })}
          />

          <TextField
            label="Description"
            {...field({
              ...register(
                'roleDescription'
              ),
            })}
          />

          {/* PERMISSIONS */}

          <Box>
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 700,
                color: theme.text,
                mb: 1.5,
              }}
            >
              Module Permissions
            </Typography>

            <Box
              sx={{
                border: `1px solid ${theme.border}`,
                borderRadius: 2,
                overflow: 'hidden',
              }}
            >
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ bgcolor: theme.soft }}>
                    <TableCell
                      sx={{
                        fontWeight: 700,
                        color: theme.text,
                      }}
                    >
                      Module
                    </TableCell>

                    {ACTIONS.map((a) => (
                      <TableCell
                        key={a.key}
                        align="center"
                        sx={{
                          fontWeight: 700,
                          color: theme.text,
                          fontSize: 11,
                        }}
                      >
                        {a.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {permissions.map((perm, idx) => (
                    <TableRow key={perm.moduleId}>
                      <TableCell
                        sx={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: '#1E1E1E',
                        }}
                      >
                        {perm.moduleName || '—'}
                      </TableCell>

                      {ACTIONS.map((a) => (
                        <TableCell
                          key={a.key}
                          align="center"
                        >
                          <Checkbox
                            checked={
                              perm[a.key] === 1
                            }
                            onChange={() =>
                              toggle(idx, a.key)
                            }
                            sx={{
                              color: '#D6BFAE',

                              '&.Mui-checked': {
                                color: '#7A1E1E',
                              },
                            }}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          bgcolor: theme.soft,
          borderTop:
            `1px solid ${theme.border}`,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: theme.muted,
          }}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          form="role-form"
          variant="contained"
          disabled={isSubmitting}
          sx={{
            bgcolor: theme.text,

            '&:hover': {
              bgcolor: '#000000',
            },
          }}
        >
          {isSubmitting
            ? 'Saving...'
            : editing
            ? 'Update Role'
            : 'Add Role'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

/* ───────────────── CONFIRM DIALOG ───────────────── */

function ConfirmDialog({
  open,
  role,
  action,
  onClose,
  onConfirm,
  loading,
}) {
  if (!role) return null

  const isActive = role.status === 1
  const isDelete = action === 'delete'
  const actionText = isDelete
    ? 'delete'
    : isActive
      ? 'block'
      : 'activate'
  const title = isDelete
    ? 'Delete Role'
    : isActive
      ? 'Block Role'
      : 'Activate Role'

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle>
        <Typography fontWeight={700}>
          {title}
        </Typography>
      </DialogTitle>

      <Divider sx={{ borderColor: theme.border }} />

      <DialogContent>
        <Typography fontSize={13}>
          Are you sure you want to{' '}
          <strong>
            {actionText}
          </strong>{' '}
          <strong>{role.roleName}</strong>?
        </Typography>
      </DialogContent>

      <Divider sx={{ borderColor: theme.border }} />

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          disabled={loading}
          onClick={onConfirm}
          sx={{
            bgcolor: isDelete || isActive
              ? '#ef4444'
              : '#22c55e',

            '&:hover': {
              bgcolor: isDelete || isActive
                ? '#dc2626'
                : '#16a34a',
            },
          }}
        >
          {loading
            ? 'Please wait...'
            : isDelete
              ? 'Delete'
              : isActive
                ? 'Block'
                : 'Activate'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

/* ───────────────── MAIN PAGE ───────────────── */

export default function RolesPage() {
  const qc = useQueryClient()

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] =
    useState(10)

  const [search, setSearch] =
    useState('')

  const [formOpen, setFormOpen] =
    useState(false)

  const [editing, setEditing] =
    useState(null)

  const [viewId, setViewId] =
    useState(null)

  const [confirmRole, setConfirmRole] =
    useState(null)

  const [confirmAction, setConfirmAction] =
    useState('')

  const { data, isFetching } = useQuery({
    queryKey: [
      'roles',
      page,
      pageSize,
      search,
    ],

    queryFn: () =>
      getRoles({
        pageIndex: page,
        pageSize,
        searchText:
          search || undefined,
      }),
  })

  const { data: modules = [] } = useQuery({
    queryKey: ['modules-all'],
    queryFn: getModules,
  })

  const roles = data?.content ?? []

  const total = data?.total ?? 0

  const totalActive = roles.filter(
    (r) => r.status === 1
  ).length

  const totalInactive = roles.filter(
    (r) => r.status !== 1
  ).length

  const blockMutation = useMutation({
    mutationFn: ({ id, status }) =>
      api.post(
        '/role/blockUnblock',
        {
          id,
          status,

          remark:
            status === 0
              ? 'Deleted by admin'
              : status === 1
              ? 'Activated by admin'
              : 'Blocked by admin',
        }
      ),

    onSuccess: (_, vars) => {
      qc.invalidateQueries({
        queryKey: ['roles'],
      })

      toast.success(
        vars.status === 0
          ? 'Role deleted'
          : vars.status === 1
          ? 'Role activated'
          : 'Role blocked'
      )

      setConfirmRole(null)
      setConfirmAction('')
    },

    onError: (e) =>
      toast.error(
        e.response?.data?.message ||
          'Failed to update status'
      ),
  })

  const openEdit = async (role) => {
    try {
      const info = await getRoleInfo(
        role.id
      )

      setEditing(info)
    } catch (_) {
      setEditing(role)
    }

    setFormOpen(true)
  }

  const columns = [
    {
      key: 'roleName',

      label: 'Role Name',

      render: (r) => (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.2}
        >
          <Avatar
            sx={{
              width: 30,
              height: 30,
              bgcolor:
                'rgba(122,30,30,0.10)',
            }}
          >
            <AdminPanelSettingsIcon
              sx={{
                fontSize: 16,
                color: '#7A1E1E',
              }}
            />
          </Avatar>

          <Typography
            fontSize={11}
            fontWeight={600}
             color="#1E1E1E"
          >
            {r.roleName}
          </Typography>
        </Stack>
      ),
    },

    {
      key: 'description',

      label: 'Description',

      render: (r) => (
        <Typography
          fontSize={11}
          color="#888"
        >
          {r.roleDescription || '—'}
        </Typography>
      ),
    },

    {
      key: 'modules',

      label: 'Modules',

      render: (r) => (
        <Chip
          label={`${
            r.roleModuleList?.length ?? 0
          } modules`}
          size="small"
          sx={{
            bgcolor:
              'rgba(227,30,36,0.10)',
            color: theme.text,
            border:
              '1px solid rgba(227,30,36,0.20)',
            fontSize: 11,
            height: 20,
          }}
        />
      ),
    },

    {
      key: 'status',

      label: 'Status',

      render: (r) => (
        <Chip
          label={
            r.status === 1
              ? 'Active'
              : 'Inactive'
          }
          size="small"
          sx={{
            height: 22,
            fontSize: 11,
            fontWeight: 600,

            bgcolor:
              r.status === 1
                ? 'rgba(34,197,94,0.1)'
                : 'rgba(239,68,68,0.1)',

            color:
              r.status === 1
                ? '#22c55e'
                : '#ef4444',

            border: `1px solid ${
              r.status === 1
                ? 'rgba(34,197,94,0.2)'
                : 'rgba(239,68,68,0.2)'
            }`,
          }}
        />
      ),
    },

    {
      key: 'createdAt',

      label: 'Created',

      render: (r) => (
        <Typography
          fontSize={11}
          color="#555"
        >
          {r.createdAt}
        </Typography>
      ),
    },

    {
  key: 'actions',
  label: '',
  render: (r) => (
    <Stack direction="row" gap={0.5}>
      <Tooltip title="View Details">
        <IconButton
          size="small"
          onClick={() => setViewId(r.id)}
          sx={{
            color: '#A1887F',

            '&:hover': {
              color: '#7A1E1E',
              bgcolor: 'rgba(122,30,30,0.08)',
            },
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

            '&:hover': {
              color: '#E31E24',
              bgcolor: 'rgba(227,30,36,0.08)',
            },
          }}
        >
          <EditIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>

      <Tooltip title={r.status === 1 ? 'Block' : 'Activate'}>
        <IconButton
          size="small"
          onClick={() => {
            setConfirmRole(r)
            setConfirmAction(r.status === 1 ? 'block' : 'activate')
          }}
          sx={{
            color: '#A1887F',

            '&:hover': {
              color:
                r.status === 1
                  ? '#ef4444'
                  : '#22c55e',

              bgcolor:
                r.status === 1
                  ? 'rgba(239,68,68,0.08)'
                  : 'rgba(34,197,94,0.08)',
            },
          }}
        >
          {r.status === 1 ? (
            <BlockIcon sx={{ fontSize: 16 }} />
          ) : (
            <CheckCircleIcon sx={{ fontSize: 16 }} />
          )}
        </IconButton>
      </Tooltip>

      <Tooltip title="Delete">
        <IconButton
          size="small"
          onClick={() => {
            setConfirmRole(r)
            setConfirmAction('delete')
          }}
          sx={{
            color: '#A1887F',

            '&:hover': {
              color: '#ef4444',
              bgcolor: 'rgba(239,68,68,0.08)',
            },
          }}
        >
          <DeleteIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
    </Stack>
  ),
},
  ]

  return (
    <Box>
      {/* HEADER */}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent:
            'space-between',
          mb: 3,
        }}
      >
        <Typography
          sx={{
            fontSize: 20,
            fontWeight: 700,
            color: '#7A1E1E',
          }}
        >
          Role Management
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditing(null)
            setFormOpen(true)
          }}
          sx={{
            bgcolor: theme.text,

            '&:hover': {
              bgcolor: '#000000',
            },
          }}
        >
          Add Role
        </Button>
      </Box>

      {/* STATS */}

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
          label="Total Roles"
          value={total}
          color="#E31E24"
          
        />

        <StatCard
          label="Active Roles"
          value={totalActive}
          color="#22C55E"
          icon={<CheckCircleIcon />}
        />

        <StatCard
          label="Inactive Roles"
          value={totalInactive}
          color="#F59E0B"
          icon={<PersonOffIcon />}
        />
      </Box>

      {/* TOOLBAR */}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent:
            'space-between',
          mb: 2,
        }}
      >
        <Typography
          sx={{
            fontSize: 12,
            color: theme.muted,
          }}
        >
          {total > 0
            ? `Showing ${roles.length} of ${total} roles`
            : ''}
        </Typography>

        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(0)
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{
                    fontSize: 16,
                    color: '#A1887F',
                  }}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            width: 220,

            '& .MuiOutlinedInput-root': {
              bgcolor: theme.surface,
              height: 34,

              '& fieldset': {
                borderColor: theme.border,
              },

              '&:hover fieldset': {
                borderColor: '#444',
              },

              '&.Mui-focused fieldset': {
                borderColor: theme.text,
              },
            },

            '& .MuiInputBase-input': {
              color: '#1E1E1E',
              fontSize: 12,
              py: 0,
            },
          }}
        />
      </Box>

      {/* TABLE */}

      <DataTable
        columns={columns}
        rows={roles}
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

      {/* DIALOGS */}

      {formOpen && (
        <RoleFormDialog
          open={formOpen}
          onClose={() => {
            setFormOpen(false)
            setEditing(null)
          }}
          editing={editing}
          modules={modules}
          onSaved={() => {
            setFormOpen(false)
            setEditing(null)

            qc.invalidateQueries({
              queryKey: ['roles'],
            })
          }}
        />
      )}

      <ViewDialog
        roleId={viewId}
        onClose={() => setViewId(null)}
      />

      <ConfirmDialog
        open={!!confirmRole}
        role={confirmRole}
        action={confirmAction}
        onClose={() =>
          {
            setConfirmRole(null)
            setConfirmAction('')
          }
        }
        loading={blockMutation.isPending}
        onConfirm={() =>
          blockMutation.mutate({
            id: confirmRole.id,

            status:
              confirmAction === 'delete'
                ? 0
                : confirmRole.status === 1
                  ? 2
                  : 1,
          })
        }
      />
    </Box>
  )
}
