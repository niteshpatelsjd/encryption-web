import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  Outlet,
  NavLink,
  useNavigate,
  useLocation,
} from 'react-router-dom'

import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  AppBar,
  Typography,
  IconButton,
  ListItemIcon,
  Divider,
  Avatar,
  Toolbar,
  LinearProgress,
} from '@mui/material'

import Collapse from '@mui/material/Collapse'

import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import SettingsIcon from '@mui/icons-material/Settings'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import DevicesIcon from '@mui/icons-material/Devices'

import {
  useDispatch,
  useSelector,
} from 'react-redux'

import { logout } from '../../store/slices/authSlice'

import api from '../../api/axiosInstance'

import toast from 'react-hot-toast'

const encryptionLogo = '/favicon.svg'

const DRAWER_WIDTH = 260

const theme = {
  black: '#0B0B0D',
  charcoal: '#161618',
  header: '#7A1E1E',
  headerDark: '#111827',
  gold: '#D4AF37',
  surface: '#FFFFFF',
  page: '#F5F5F5',
  border: '#E5E7EB',
  text: '#111827',
  muted: '#6B7280',
}

const MODULE_MAP = {
  dashboard: {
    to: '/dashboard',

    icon: (
      <DashboardIcon
        sx={{ fontSize: 16 }}
      />
    ),
  },

  staff: {
    to: '/users',

    icon: (
      <ManageAccountsIcon
        sx={{ fontSize: 16 }}
      />
    ),
  },

  user: {
    to: '/mobile-users',

    icon: (
      <PeopleAltIcon
        sx={{ fontSize: 16 }}
      />
    ),
  },

  users: {
    to: '/mobile-users',

    icon: (
      <PeopleAltIcon
        sx={{ fontSize: 16 }}
      />
    ),
  },

  'user management': {
    to: '/mobile-users',

    icon: (
      <PeopleAltIcon
        sx={{ fontSize: 16 }}
      />
    ),
  },

  device: {
    to: '/mobile-user-devices',
    icon: <DevicesIcon sx={{ fontSize: 16 }} />,
  },

  devices: {
    to: '/mobile-user-devices',
    icon: <DevicesIcon sx={{ fontSize: 16 }} />,
  },

  'mobile user device': {
    to: '/mobile-user-devices',
    icon: <DevicesIcon sx={{ fontSize: 16 }} />,
  },

  'device provisioning': {
    to: '/mobile-user-devices',
    icon: <DevicesIcon sx={{ fontSize: 16 }} />,
  },

  setting: {
    to: '/settings',
    icon: <SettingsIcon sx={{ fontSize: 16 }} />,
  },

  settings: {
    to: '/settings',
    icon: <SettingsIcon sx={{ fontSize: 16 }} />,
  },

  role: {
    to: '/roles',

    icon: (
      <AdminPanelSettingsIcon
        sx={{ fontSize: 16 }}
      />
    ),
  },

  module: {
    to: '/modules',

    icon: (
      <ViewModuleIcon
        sx={{ fontSize: 16 }}
      />
    ),
  },

  modules: {
    to: '/modules',

    icon: (
      <ViewModuleIcon
        sx={{ fontSize: 16 }}
      />
    ),
  },

  'module management': {
    to: '/modules',

    icon: (
      <ViewModuleIcon
        sx={{ fontSize: 16 }}
      />
    ),
  },

}

const fallbackIcon = (
  <SettingsIcon
    sx={{ fontSize: 16 }}
  />
)

const normalizeModuleKey = (value) =>
  value
    ?.toLowerCase()
    .trim()
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')

const REMOVED_MODULE_TERMS = [
  'family',
  'member',
  'dharamshala',
  'finance',
  'bank',
  'account',
  'booking',
  'ledger',
  'website',
  'inventory',
  'donation',
  'item',
  'location',
  'district',
  'tehsil',
  'village',
  'post',
  'report',
  'violation',
]

const isRemovedModule = (module) => {
  const value = normalizeModuleKey(
    `${module?.moduleCode ?? ''} ${module?.moduleName ?? ''}`
  )

  return REMOVED_MODULE_TERMS.some((term) =>
    value?.includes(term)
  )
}

const sidebarSx = {
  width: DRAWER_WIDTH,

  flexShrink: 0,

  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,

    boxSizing: 'border-box',

    background:
      'linear-gradient(180deg, #0B0B0D 0%, #161618 100%)',

    borderRight:
      '1px solid rgba(255,255,255,0.10)',

    color: '#fff',
  },
}

export default function AdminLayout() {
  const mainRef = useRef(null)

  const [mobileOpen, setMobileOpen] =
    useState(false)

  const [openLocation, setOpenLocation] =
    useState(false)

  const [navigating, setNavigating] =
    useState(false)

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const location = useLocation()

  const { token, user } =
    useSelector((s) => s.auth)

  const scrollToPageTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto',
    })

    document.documentElement.scrollTop = 0
    document.documentElement.scrollLeft = 0
    document.body.scrollTop = 0
    document.body.scrollLeft = 0

    if (!mainRef.current) return

    mainRef.current.scrollTo?.({
      top: 0,
      left: 0,
      behavior: 'auto',
    })

    mainRef.current
      .querySelectorAll('*')
      .forEach((element) => {
        const style =
          window.getComputedStyle(element)

        const hasVerticalScroll =
          ['auto', 'scroll'].includes(
            style.overflowY
          ) &&
          element.scrollHeight >
            element.clientHeight

        const hasHorizontalScroll =
          ['auto', 'scroll'].includes(
            style.overflowX
          ) &&
          element.scrollWidth >
            element.clientWidth

        if (hasVerticalScroll) {
          element.scrollTop = 0
        }

        if (hasHorizontalScroll) {
          element.scrollLeft = 0
        }
      })
  }

  useEffect(() => {
    requestAnimationFrame(scrollToPageTop)
  }, [location.pathname, location.search])

  const handleMainActionClick = (event) => {
    const actionElement =
      event.target.closest?.(
        'a,button,[role="button"],.MuiButton-root,.MuiIconButton-root,.MuiListItemButton-root'
      )

    if (!actionElement) return

    if (
      actionElement.closest?.(
        '[data-disable-scroll-top="true"]'
      )
    ) {
      return
    }

    requestAnimationFrame(scrollToPageTop)
  }

  const moduleList =
    user?.roleResponse
      ?.roleModuleList ?? []

const navItems = moduleList
  .filter(
    (m) =>
      m.moduleAction === 1 &&
      m.status === 1 &&
      !isRemovedModule(m)
  )
  .sort((a, b) => {
    const aSetting = ['setting', 'settings'].includes(
      normalizeModuleKey(a.moduleCode) || normalizeModuleKey(a.moduleName)
    ) || ['setting', 'settings'].includes(normalizeModuleKey(a.moduleName))

    const bSetting = ['setting', 'settings'].includes(
      normalizeModuleKey(b.moduleCode) || normalizeModuleKey(b.moduleName)
    ) || ['setting', 'settings'].includes(normalizeModuleKey(b.moduleName))

    if (aSetting && !bSetting) return 1
    if (bSetting && !aSetting) return -1

    const aDashboard =
      normalizeModuleKey(
        a.moduleCode
      ) === 'dashboard' ||
      normalizeModuleKey(
        a.moduleName
      ) === 'dashboard'

    const bDashboard =
      normalizeModuleKey(
        b.moduleCode
      ) === 'dashboard' ||
      normalizeModuleKey(
        b.moduleName
      ) === 'dashboard'

    if (aDashboard) return -1
    if (bDashboard) return 1

    const aLabel =
      a.moduleName ||
      a.moduleCode ||
      ''

    const bLabel =
      b.moduleName ||
      b.moduleCode ||
      ''

    return aLabel.localeCompare(
      bLabel,
      undefined,
      {
        sensitivity: 'base',
      }
    )
  })
  .map((m) => {
      const rawKey = m.moduleCode
        ?.toLowerCase()
        .trim()

      const key =
        normalizeModuleKey(m.moduleCode)

      const rawNameKey = m.moduleName
        ?.toLowerCase()
        .trim()

      const nameKey =
        normalizeModuleKey(m.moduleName)

      const mapped =
        MODULE_MAP[rawKey] ||
        MODULE_MAP[key] ||
        MODULE_MAP[rawNameKey] ||
        MODULE_MAP[nameKey]

      if (
        rawKey === 'setting' ||
        rawKey === 'settings' ||
        key === 'setting' ||
        key === 'settings' ||
        nameKey === 'setting' ||
        nameKey === 'settings'
      ) {
        return {
          label: m.moduleName,
          to: '/settings',
          icon: mapped?.icon ?? fallbackIcon,
          children: [
            { label: 'Privacy Policy', to: '/settings/privacy-policy' },
            { label: 'Terms & Conditions', to: '/settings/terms-and-conditions' },
            { label: 'Change Password', to: '/settings/change-password' },
            { label: 'Contact Us', to: '/settings/contact-us' },
          ],
        }
      }

      return {
        label: m.moduleName,

        to:
          mapped?.to ??
          `/${rawKey || key}`,

        icon:
          mapped?.icon ??
          fallbackIcon,
      }
    })

  const handleNavClick = (to) => {
    setNavigating(true)

    setMobileOpen(false)

    navigate(to)

    requestAnimationFrame(scrollToPageTop)

    setTimeout(() => {
      setNavigating(false)
    }, 500)
  }

  const handleLogout =
    async () => {
      try {
        await api.get(
          `/user/logout?token=${token}`
        )
      } catch {
        // Local logout must still complete if the server session already expired.
      }

      dispatch(logout())

      navigate('/login')

      toast.success('Logged out')
    }

  const drawer = (
    <Box
      sx={{
        display: 'flex',

        flexDirection: 'column',

        height: '100%',
      }}
    >
      {/* LOGO */}

      <Box
        sx={{
          px: 2.5,

          py: 2.5,

          display: 'flex',

          alignItems: 'center',

          gap: 1.5,
        }}
      >
        <Box
          sx={{
            width: 42,

            height: 42,

            borderRadius: 2,

            background:
              'rgba(255,255,255,0.08)',

            display: 'flex',

            alignItems: 'center',

            justifyContent:
              'center',

            overflow: 'hidden',

            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src={encryptionLogo}
            alt="Encryption Web logo"
            sx={{
              width: 34,

              height: 34,

              objectFit: 'cover',

              borderRadius: '50%',
            }}
          />
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: 14,

              fontWeight: 700,

              color: '#FFFFFF',

              lineHeight: 1.2,
            }}
          >
            Encryption Web
          </Typography>

          <Typography
            sx={{
              fontSize: 11,

              color:
                'rgba(255,255,255,0.62)',

              lineHeight: 1.4,
            }}
          >
            {user?.roleResponse
              ?.roleName ?? 'Admin'}
          </Typography>
        </Box>
      </Box>

      <Divider
        sx={{
          borderColor:
            'rgba(255,255,255,0.10)',

          mx: 2,
        }}
      />

      {/* MENU */}

      <List
        sx={{
          px: 1.5,

          pt: 1.5,

          flex: 1,

          overflowY: 'auto',

          scrollbarWidth: 'none',

          msOverflowStyle: 'none',

          '&::-webkit-scrollbar': {
            width: 0,
          },

          '&:hover': {
            scrollbarWidth: 'thin',
          },

          '&:hover::-webkit-scrollbar': {
            width: 6,
          },

          '&:hover::-webkit-scrollbar-track': {
            background: 'transparent',
          },

          '&:hover::-webkit-scrollbar-thumb': {
            background:
              'rgba(255,255,255,0.28)',
            borderRadius: 99,
          },

          '&:hover::-webkit-scrollbar-thumb:hover':
            {
              background:
                'rgba(255,255,255,0.42)',
            },
        }}
      >
        <Typography
          sx={{
            fontSize: 12,

            fontWeight: 700,

            color:
              'rgba(255,255,255,0.54)',

            letterSpacing: '0.08em',

            textTransform:
              'uppercase',

            px: 1,

            mb: 1.2,
          }}
        >
          Menu
        </Typography>

        {navItems.length === 0 ? (
          <Typography
            sx={{
              fontSize: 11,

              color:
              'rgba(255,255,255,0.54)',

              px: 1,
            }}
          >
            No modules assigned
          </Typography>
        ) : (
          navItems.map(
            ({
              label,
              to,
              icon,
              children,
            }) => (
              <Box key={to}>
                {/* MAIN MENU */}

                <ListItemButton
                  component={
                    children
                      ? 'div'
                      : NavLink
                  }
                  to={
                    children
                      ? undefined
                      : to
                  }
                  onClick={() => {
                    if (children) {
                      setOpenLocation(
                        !openLocation
                      )
                    } else {
                      handleNavClick(
                        to
                      )
                    }
                  }}
                  sx={{
                    borderRadius: 2,

                    mb: 0.6,

                    px: 1.5,

                    py: 1,

                    color:
                      'rgba(255,255,255,0.78)',

                    transition:
                      'all 0.2s ease',

                    '& .MuiListItemIcon-root':
                      {
                        color:
                          'rgba(255,255,255,0.72)',
                      },

                    '&.active': {
                      bgcolor:
                        '#FFFFFF',

                      color: theme.black,

                      '& .MuiListItemIcon-root':
                        {
                          color:
                            theme.black,
                        },
                    },

                    '&:hover': {
                      bgcolor:
                        'rgba(255,255,255,0.10)',

                      color: '#fff',

                      '& .MuiListItemIcon-root':
                        {
                          color:
                            '#FFFFFF',
                        },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 32,

                      color:
                        'inherit',
                    }}
                  >
                    {icon}
                  </ListItemIcon>

<ListItemText
  primary={label}
  primaryTypographyProps={{
    fontSize: 13,
    fontWeight: 500,
    noWrap: true,
    sx: {
      display: 'block',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '100%',
    },
  }}
  sx={{
    minWidth: 0,
    overflow: 'hidden',
  }}
/>

                  {children ? (
                    openLocation ? (
                      <ExpandLessIcon
                        sx={{
                          fontSize: 18,
                        }}
                      />
                    ) : (
                      <ExpandMoreIcon
                        sx={{
                          fontSize: 18,
                        }}
                      />
                    )
                  ) : null}
                </ListItemButton>

                {/* SUB MENU */}

                {children && (
                  <Collapse
                    in={
                      openLocation
                    }
                    timeout="auto"
                    unmountOnExit
                  >
                    {children.map(
                      (sub) => (
                        <ListItemButton
                          key={
                            sub.to
                          }
                          component={
                            NavLink
                          }
                          to={sub.to}
                          onClick={() =>
                            handleNavClick(
                              sub.to
                            )
                          }
                          sx={{
                            ml: 4,

                            mb: 0.5,

                            borderRadius: 2,

                            py: 0.7,

                            color:
                              'rgba(255,255,255,0.66)',

                            '&.active':
                              {
                                bgcolor:
                                  '#FFFFFF',

                                color:
                                  theme.black,
                              },

                            '&:hover':
                              {
                                bgcolor:
                                  'rgba(255,255,255,0.10)',
                              },
                          }}
                        >
                          <ListItemText
                            primary={
                              sub.label
                            }
                            primaryTypographyProps={{
                              fontSize: 12,

                              fontWeight: 500,

                              noWrap: true,

                              sx: {
                                display: 'block',
                                whiteSpace:
                                  'nowrap',
                                overflow:
                                  'hidden',
                                textOverflow:
                                  'ellipsis',
                                maxWidth:
                                  '100%',
                              },
                            }}
                            sx={{
                              minWidth: 0,
                              overflow:
                                'hidden',
                            }}
                          />
                        </ListItemButton>
                      )
                    )}
                  </Collapse>
                )}
              </Box>
            )
          )
        )}

        <Divider
          sx={{
            borderColor: 'rgba(255,255,255,0.10)',
            my: 1.25,
          }}
        />

        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2,
            px: 1.5,
            py: 1,
            color: '#FCA5A5',
            transition: 'all 0.2s ease',
            '& .MuiListItemIcon-root': {
              color: '#FCA5A5',
            },
            '&:hover': {
              bgcolor: 'rgba(239,68,68,0.14)',
              color: '#FECACA',
              '& .MuiListItemIcon-root': {
                color: '#FECACA',
              },
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 32 }}>
            <LogoutIcon sx={{ fontSize: 17 }} />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{
              fontSize: 13,
              fontWeight: 600,
            }}
          />
        </ListItemButton>
      </List>
    </Box>
  )

  return (
    <Box
      sx={{
        display: 'flex',

        background: theme.page,

        minHeight: '100vh',

        overflowX: 'hidden',
      }}
    >
      {/* APPBAR */}

      <AppBar
        position="fixed"
        sx={{
          zIndex: (t) =>
            t.zIndex.drawer + 1,

          background:
            `linear-gradient(135deg, ${theme.headerDark} 0%, ${theme.header} 62%, #9A3412 100%)`,

          color: '#FFFFFF',

          boxShadow: '0 12px 34px rgba(17,24,39,0.18)',
        }}
      >
        <Toolbar
          sx={{
            minHeight:
              {
                xs: '60px !important',
                sm: '64px !important',
                md: '68px !important',
              },

            px: {
              xs: 1.5,
              sm: 2,
              md: 3,
            },

            display: 'flex',

            justifyContent:
              'space-between',

            alignItems: 'center',
          }}
        >
          {/* LEFT */}

          <Box
            sx={{
              display: 'flex',

              alignItems: 'center',

              gap: 2,
            }}
          >
            <IconButton
              color="inherit"
              edge="start"
              onClick={() =>
                setMobileOpen(
                  !mobileOpen
                )
              }
              sx={{
                display: {
                  md: 'none',
                },
              }}
            >
              <MenuIcon />
            </IconButton>

            <Box
              sx={{
                display: 'flex',

                alignItems: 'center',

                gap: 1.5,
              }}
            >
              <Box
                component="img"
                src={encryptionLogo}
                alt="Encryption Web logo"
                sx={{
                  width: 40,

                  height: 40,

                  borderRadius:
                    '50%',

                  objectFit:
                    'cover',

                  border:
                    '2px solid rgba(255,255,255,0.72)',

                  background:
                    '#fff',

                  p: 0.2,

                  boxShadow:
                    '0 8px 24px rgba(0,0,0,0.18)',
                }}
              />

              <Box>
                <Typography
                  sx={{
                    fontSize: {
                      xs: 14,
                      md: 18,
                    },

                    fontWeight: 700,

                    color: '#FFFFFF',

                    lineHeight: 1.1,
                  }}
                >
                  Encryption Web
                </Typography>

                <Typography
                  sx={{
                    fontSize: 11,

                    color: 'rgba(255,255,255,0.72)',

                    mt: 0.2,
                  }}
                >
                  Secure Administration
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* RIGHT */}

          <Box
            sx={{
              display: 'flex',

              alignItems: 'center',

              gap: 2,
            }}
          >
            <Box
              role="button"
              tabIndex={0}
              onClick={() => handleNavClick('/profile')}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  handleNavClick('/profile')
                }
              }}
              aria-label="Open my profile"
              sx={{
                display: 'flex',

                alignItems: 'center',

                gap: 1.2,

                bgcolor:
                  'rgba(255,255,255,0.14)',

                px: 1.5,

                py: 0.8,

                borderRadius: 3,

                border:
                  '1px solid rgba(255,255,255,0.22)',

                cursor: 'pointer',

                transition: 'all .2s ease',

                '&:hover': {
                  bgcolor:
                    'rgba(255,255,255,0.20)',
                },
              }}
            >
              <Avatar
                src={
                  user?.profileUrl
                }
                sx={{
                  width: 34,

                  height: 34,

                  bgcolor:
                    'rgba(255,255,255,0.22)',

                  color: '#FFFFFF',

                  fontSize: 13,

                  fontWeight: 700,
                }}
              >
                {(
                  user?.name ||
                  user?.email ||
                  'A'
                )[0].toUpperCase()}
              </Avatar>

              <Box
                sx={{
                  display: {
                    xs: 'none',
                    sm: 'block',
                  },
                }}
              >
                <Typography
                  sx={{
                    fontSize: 12,

                    fontWeight: 700,

                    color: '#FFFFFF',

                    lineHeight: 1.2,
                  }}
                >
                  {user?.name ||
                    'Admin'}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 11,

                    color: 'rgba(255,255,255,0.72)',

                    lineHeight: 1.2,
                  }}
                >
                  {user?.email}
                </Typography>
              </Box>
            </Box>

            <IconButton
              onClick={handleLogout}
              sx={{
                bgcolor:
                  'rgba(255,255,255,0.16)',

                color: '#FFFFFF',

                '&:hover': {
                  bgcolor:
                    'rgba(255,255,255,0.24)',
                },
              }}
            >
              <LogoutIcon
                sx={{
                  fontSize: 20,
                }}
              />
            </IconButton>
          </Box>
        </Toolbar>

        <Box
          sx={{
            position: 'absolute',

            bottom: 0,

            left: 0,

            right: 0,

            height: 2,
          }}
        >
          {navigating && (
            <LinearProgress
              sx={{
                height: 2,

                bgcolor:
                  'transparent',

                '& .MuiLinearProgress-bar':
                  {
                    bgcolor:
                      theme.gold,
                  },
              }}
            />
          )}
        </Box>
      </AppBar>

      {/* SIDEBAR */}

      <Drawer
        variant="permanent"
        sx={{
          ...sidebarSx,

          display: {
            xs: 'none',
            md: 'block',
          },
        }}
      >
        {drawer}
      </Drawer>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() =>
          setMobileOpen(false)
        }
        sx={{
          ...sidebarSx,

          display: {
            xs: 'block',
            md: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* MAIN */}

      <Box
        ref={mainRef}
        component="main"
        onClickCapture={handleMainActionClick}
        sx={{
          flexGrow: 1,

          width: {
            xs: '100%',

            md: `calc(100% - ${DRAWER_WIDTH}px)`,
          },

          maxWidth: '100vw',

          overflowX: 'hidden',

          p: {
            xs: 1.5,
            sm: 2,
            md: 3,
          },

          mt: {
            xs: '60px',
            sm: '64px',
            md: '68px',
          },

          height: {
            xs: 'calc(100vh - 60px)',
            sm: 'calc(100vh - 64px)',
            md: 'calc(100vh - 68px)',
          },

          minHeight: 0,

          overflowY: 'auto',

          background: theme.page,

          opacity:
            navigating ? 0.4 : 1,

          transition:
            'opacity 0.25s ease',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}
