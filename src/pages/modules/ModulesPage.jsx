import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import DashboardCustomizeOutlinedIcon from '@mui/icons-material/DashboardCustomizeOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import SearchIcon from '@mui/icons-material/Search'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as yup from 'yup'

import api from '../../api/axiosInstance'
import DataTable from '../../components/common/DataTable'

const theme = {
  primary: '#111827',
  muted: '#6B7280',
  border: '#E5E7EB',
  soft: '#F9FAFB',
}

const EMPTY_FORM = {
  moduleName: '',
  moduleCode: '',
  parentModuleName: '',
}

const moduleSchema = yup.object({
  moduleName: yup
    .string()
    .trim()
    .required('Module name is required')
    .max(100, 'Module name must be 100 characters or fewer'),
  moduleCode: yup
    .string()
    .trim()
    .required('Module code is required')
    .max(50, 'Module code must be 50 characters or fewer'),
  parentModuleName: yup
    .string()
    .trim()
    .max(100, 'Parent module name must be 100 characters or fewer'),
})

const fetchModules = ({ pageIndex, pageSize, searchText }) =>
  api
    .get('/module/getAllModule', {
      params: { pageIndex, pageSize, searchText },
    })
    .then((response) => response.data)

function ModuleFormDialog({ open, editing, onClose, onSaved }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(moduleSchema),
    defaultValues: EMPTY_FORM,
  })

  useEffect(() => {
    reset(
      editing
        ? {
            moduleName: editing.moduleName ?? '',
            moduleCode: editing.moduleCode ?? '',
            parentModuleName: editing.parentModuleName ?? '',
          }
        : EMPTY_FORM
    )
  }, [editing, open, reset])

  const saveMutation = useMutation({
    mutationFn: (values) =>
      api.post('/module/addModule', {
        ...(editing?.id ? { id: editing.id } : {}),
        moduleName: values.moduleName.trim(),
        moduleCode: values.moduleCode.trim(),
        parentModuleName: values.parentModuleName.trim(),
      }),
    onSuccess: () => {
      toast.success(editing ? 'Module updated successfully' : 'Module created successfully')
      onSaved()
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.responseMessage ||
          'Unable to save module'
      )
    },
  })

  const closeDialog = () => {
    if (!saveMutation.isPending) onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={closeDialog}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: '#FFFFFF',
          boxShadow: '0 24px 70px rgba(17, 24, 39, 0.16)',
          position: 'relative',
        },
      }}
    >
      <IconButton
        aria-label="Close"
        onClick={closeDialog}
        disabled={saveMutation.isPending}
        size="small"
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 2,
          color: theme.primary,
          bgcolor: '#FFFFFF',
          border: `1px solid ${theme.border}`,
          boxShadow: '0 8px 18px rgba(17,24,39,0.08)',
          '&:hover': { bgcolor: '#F8FAFC' },
        }}
      >
        <CloseIcon fontSize="small" />
      </IconButton>

      <DialogTitle
        sx={{
          px: 3,
          py: 2.5,
          pr: 8,
          bgcolor: theme.soft,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography sx={{ color: theme.primary, fontSize: 18, fontWeight: 800 }}>
              {editing ? 'Edit Module' : 'Add New Module'}
            </Typography>
            <Typography sx={{ color: theme.muted, fontSize: 12, mt: 0.4 }}>
              {editing
                ? 'Update the module details below.'
                : 'Create a module for navigation and role permissions.'}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: '28px 24px 12px !important', bgcolor: '#FFFFFF' }}>
        <Box
          component="form"
          id="module-form"
          onSubmit={handleSubmit((values) => saveMutation.mutate(values))}
        >
          <Stack spacing={2.5}>
            <TextField
              label="Module Name"
              placeholder="e.g. Family Management"
              fullWidth
              autoFocus
              error={Boolean(errors.moduleName)}
              helperText={errors.moduleName?.message}
              {...register('moduleName')}
            />
            <TextField
              label="Module Code"
              placeholder="e.g. FAMILY"
              fullWidth
              error={Boolean(errors.moduleCode)}
              helperText={errors.moduleCode?.message}
              {...register('moduleCode')}
            />
            <TextField
              label="Parent Module Name"
              placeholder="Optional"
              fullWidth
              error={Boolean(errors.parentModuleName)}
              helperText={
                errors.parentModuleName?.message ||
                'Leave blank when this is a top-level module.'
              }
              {...register('parentModuleName')}
            />
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2.5, bgcolor: '#FFFFFF' }}>
        <Button
          onClick={closeDialog}
          disabled={saveMutation.isPending}
          sx={{ color: theme.muted, textTransform: 'none', fontWeight: 700 }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="module-form"
          variant="contained"
          disabled={saveMutation.isPending}
          sx={{
            minWidth: 120,
            bgcolor: theme.primary,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 700,
            boxShadow: '0 7px 16px rgba(17, 24, 39, 0.18)',
            '&:hover': { bgcolor: '#000000' },
          }}
        >
          {saveMutation.isPending
            ? 'Saving...'
            : editing
              ? 'Update Module'
              : 'Create Module'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default function ModulesPage() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  const { data, isFetching } = useQuery({
    queryKey: ['modules', page, pageSize, search],
    queryFn: () =>
      fetchModules({
        pageIndex: page,
        pageSize,
        searchText: search.trim(),
      }),
  })

  const modules = data?.responseBody?.content ?? []
  const total = data?.responseBody?.totalElements ?? 0

  const openAdd = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (module) => {
    setEditing(module)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
  }

  const columns = [
    {
      key: 'moduleName',
      label: 'Module Name',
      render: (row) => (
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <Avatar
            variant="rounded"
            sx={{
              width: 34,
              height: 34,
              bgcolor: '#FCE8E8',
              color: '#C41920',
              borderRadius: 2,
            }}
          >
            <DashboardCustomizeOutlinedIcon sx={{ fontSize: 18 }} />
          </Avatar>
          <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: '#352A27' }}>
            {row.moduleName || '—'}
          </Typography>
        </Stack>
      ),
    },
    {
      key: 'moduleCode',
      label: 'Module Code',
      render: (row) => (
        <Box
          component="span"
          sx={{
            display: 'inline-flex',
            px: 1.2,
            py: 0.55,
            borderRadius: 1.5,
            bgcolor: '#FFF3E8',
            color: '#8A4B18',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.04em',
          }}
        >
          {row.moduleCode || '—'}
        </Box>
      ),
    },
    { key: 'parentModuleName', label: 'Parent Module' },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Tooltip title="Edit module">
          <IconButton
            aria-label={`Edit ${row.moduleName || 'module'}`}
            size="small"
            onClick={() => openEdit(row)}
            sx={{
              color: '#7A1E1E',
              bgcolor: '#FCEEEE',
              '&:hover': { bgcolor: '#F7DADA' },
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 17 }} />
          </IconButton>
        </Tooltip>
      ),
    },
  ]

  return (
    <Box>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3, width: '100%' }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 800, color: theme.primary }}>
            Module Management
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: 12.5, color: theme.muted }}>
            Manage portal navigation modules and permission groups.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openAdd}
          sx={{
            ml: { sm: 'auto' },
            alignSelf: { xs: 'flex-end', sm: 'center' },
            flexShrink: 0,
            bgcolor: '#DBEAFE',
            color: '#1D4ED8',
            borderRadius: 2,
            px: 2.5,
            height: 42,
            textTransform: 'none',
            fontWeight: 800,
            boxShadow: '0 8px 18px rgba(59,130,246,0.18)',
            '&:hover': { bgcolor: '#BFDBFE' },
          }}
        >
          Add Module
        </Button>
      </Stack>

      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          border: `1px solid ${theme.border}`,
          background: '#FFFFFF',
          boxShadow: '0 8px 24px rgba(17, 24, 39, 0.06)',
        }}
      >
        <CardContent sx={{ p: '20px !important' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              variant="rounded"
              sx={{ width: 52, height: 52, bgcolor: '#FCE8E8', color: '#C41920' }}
            >
              <DashboardCustomizeOutlinedIcon />
            </Avatar>
            <Box>
              <Typography sx={{ fontSize: 12, fontWeight: 700, color: theme.muted }}>
                Total Modules
              </Typography>
              <Typography sx={{ mt: 0.2, fontSize: 27, lineHeight: 1.2, fontWeight: 800, color: theme.primary }}>
                {total}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
        spacing={1.5}
        sx={{ mb: 2 }}
      >
        <Typography sx={{ fontSize: 12, color: theme.muted }}>
          {total ? `Showing ${modules.length} of ${total} modules` : 'No modules found'}
        </Typography>
        <TextField
          size="small"
          placeholder="Search modules..."
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(0)
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#9A7C70', fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: { xs: '100%', sm: 260 },
            '& .MuiOutlinedInput-root': {
              height: 38,
              bgcolor: '#FFFFFF',
              borderRadius: 2,
              '& fieldset': { borderColor: theme.border },
              '&:hover fieldset': { borderColor: theme.primary },
              '&.Mui-focused fieldset': { borderColor: theme.primary },
            },
            '& .MuiInputBase-input': { fontSize: 12.5 },
          }}
        />
      </Stack>

      <DataTable
        columns={columns}
        rows={modules}
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

      {formOpen && (
        <ModuleFormDialog
          open={formOpen}
          editing={editing}
          onClose={closeForm}
          onSaved={() => {
            closeForm()
            queryClient.invalidateQueries({ queryKey: ['modules'] })
            queryClient.invalidateQueries({ queryKey: ['modules-all'] })
          }}
        />
      )}
    </Box>
  )
}
