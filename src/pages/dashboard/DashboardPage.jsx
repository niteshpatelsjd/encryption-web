import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Avatar,
  LinearProgress,
} from '@mui/material'

import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'

import PeopleIcon from '@mui/icons-material/People'
import SmartphoneIcon from '@mui/icons-material/Smartphone'
import DevicesIcon from '@mui/icons-material/Devices'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import NotificationsIcon from '@mui/icons-material/Notifications'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'

import api from '../../api/axiosInstance'

const getResponseList = (response) => {
  const body = response?.data?.responseBody

  if (Array.isArray(body?.content)) return body.content
  if (Array.isArray(body?.records)) return body.records
  if (Array.isArray(body)) return body
  if (Array.isArray(response?.data?.content)) {
    return response.data.content
  }

  return []
}

const getUserName = (user) =>
  user?.name ||
  [user?.firstName, user?.lastName]
    .filter(Boolean)
    .join(' ') ||
  'Mobile User'

const getProfileImage = (user) =>
  user?.profileUrl ||
  user?.profileImage ||
  user?.imageUrl ||
  user?.avatar ||
  ''

const getInitial = (name) =>
  (name || 'U').charAt(0).toUpperCase()

const fetchApprovedUsers = async () => {
  const response = await api.get(
    '/mobile/user/getAllUsers',
    {
      params: {
        pageIndex: 0,
        pageSize: 5,
        status: 1,
        verificationStatus: 'APPROVED',
      },
    }
  )

  return getResponseList(response)
}

const getDeviceName = (device) =>
  device?.deviceName ||
  device?.deviceModel ||
  device?.model ||
  device?.mobileDeviceName ||
  'Registered device'

const getDevicePlatform = (device) =>
  device?.platform ||
  device?.deviceType ||
  device?.osName ||
  device?.operatingSystem ||
  'Mobile'

/* ======================================================
   STAT CARD
====================================================== */

function StatCard({
  title,
  value,
  icon,
  color,
}) {
  return (
    <Card
      sx={{
        background: '#FFFFFF',

        backdropFilter:
          'blur(14px)',

        border:
          '1px solid #E5E7EB',

        borderRadius: 3,

        boxShadow:
          '0 10px 30px rgba(17,24,39,0.06)',

        flex: 1,
      }}
    >
      <CardContent
        sx={{
          p: '14px !important',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          {/* LEFT */}
          <Box>
            <Typography
              sx={{
                color: '#6B7280',
                fontSize: 14,
                mb: 0.5,
                fontWeight: 600,
              }}
            >
              {title}
            </Typography>

            <Typography
              sx={{
                color: '#111827',
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1,
              }}
            >
              {value}
            </Typography>
          </Box>

          {/* ICON */}
          <Avatar
            sx={{
              ml: 'auto',
              bgcolor: `${color}18`,
              color,
              width: 52,
              height: 52,

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

/* ======================================================
   DASHBOARD PAGE
====================================================== */

export default function DashboardPage() {
  const { user } = useSelector(
    (s) => s.auth
  )

  const { data: approvedUsers = [] } =
    useQuery({
      queryKey: [
        'dashboard-approved-users',
      ],
      queryFn: fetchApprovedUsers,
      staleTime: 60 * 1000,
    })

  const stats = {
    totalMembers: 1580,
    totalMobileUsers: 420,
    totalDevices: 72,
    activeUsers: 1288,
  }

  const activities = [
    { label: 'New member registered', color: '#2563EB', icon: 'member' },
    { label: 'Location added', color: '#16A34A', icon: 'notification' },
    { label: 'Role updated', color: '#9333EA', icon: 'member' },
    { label: 'Mobile user approved', color: '#F59E0B', icon: 'notification' },
    { label: 'User account activated', color: '#DC2626', icon: 'member' },
  ]

  return (
    <Box>
      {/* ======================================================
          WELCOME BANNER
      ====================================================== */}

      <Box
        sx={{
          mb: 3,
          px: 1,
          py: 1,

          display: 'flex',

          justifyContent:
            'space-between',

          alignItems: 'center',

          flexWrap: 'wrap',

          borderBottom:
            '1px solid #E5E7EB',
        }}
      >
        {/* LEFT */}
        <Box>
          <Typography
            sx={{
              color: '#111827',

              fontSize: {
                xs: 20,
                md: 24,
              },

              fontWeight: 700,
              lineHeight: 1.3,
            }}
          >
            Welcome back,{' '}

            <Box
              component="span"
              sx={{
                color: '#111827',
              }}
            >
              {user?.name ||
                'Admin'}
            </Box>
          </Typography>

          <Typography
            sx={{
              color: '#6B7280',
              fontSize: 12,
              mt: 0.7,
            }}
          >
            Encryption Web Administration Portal
          </Typography>
        </Box>

        {/* DATE */}
        <Typography
          sx={{
            color: '#6B7280',
            fontSize: 12,

            mt: {
              xs: 1,
              md: 0,
            },
          }}
        >
          {new Date().toLocaleDateString(
            'en-IN',
            {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }
          )}
        </Typography>
      </Box>

      {/* ======================================================
          STATS
      ====================================================== */}

      <Box
        sx={{
          display: 'grid',

          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2,1fr)',
            lg: 'repeat(4,1fr)',
          },

          gap: 2,
          mb: 3,
        }}
      >
        <StatCard
          title="Total Staff Users"
          value={stats.totalMembers}
          color="#2563EB"
          icon={<PeopleIcon />}
        />

        <StatCard
          title="Total Mobile Users"
          value={stats.totalMobileUsers}
          color="#9333EA"
          icon={
            <SmartphoneIcon />
          }
        />

        <StatCard
          title="Total Devices"
          value={stats.totalDevices}
          color="#16A34A"
          icon={<DevicesIcon />}
        />

        <StatCard
          title="Mobile Active Users"
          value={stats.activeUsers}
          color="#F59E0B"
          icon={<CheckCircleIcon />}
        />
      </Box>

      <DashboardAnalytics
        stats={stats}
        activities={activities}
        approvedUsers={approvedUsers}
        registeredDevices={approvedUsers}
      />

      {/* ======================================================
          BOTTOM SECTION
      ====================================================== */}

      <Box
        sx={{
          display: 'grid',

          gridTemplateColumns: {
            xs: '1fr',
            lg: '1fr 1fr',
          },

          gap: 3,
        }}
      >
        {/* QUICK SUMMARY */}

        <Card
          sx={{
            bgcolor:
              '#FFFFFF',

            backdropFilter:
              'blur(14px)',

            border:
              '1px solid #E5E7EB',

            borderRadius: 3,
          }}
        >
          <CardContent>
            <Typography
              sx={{
                color: '#111827',
                fontWeight: 700,
                mb: 3,
              }}
            >
              Quick Summary
            </Typography>

            <Box
              sx={{
                display: 'grid',

                gridTemplateColumns:
                  'repeat(2, 1fr)',

                gap: 2,
              }}
            >
              {[
                {
                  label: 'Staff Users',
                  value: stats.totalMembers,
                  color: '#3B82F6',
                },

                {
                  label: 'Mobile Users',
                  value: stats.totalMobileUsers,
                  color: '#8B5CF6',
                },

                {
                  label: 'Devices',
                  value: stats.totalDevices,
                  color: '#22C55E',
                },

                {
                  label: 'Pending',
                  value: 18,
                  color: '#F59E0B',
                },
              ].map((item) => (
                <Box
                  key={item.label}
                  sx={{
                    p: 2,

                    borderRadius: 3,

                    bgcolor:
                      '#F9FAFB',

                    border:
                      '1px solid #E5E7EB',
                  }}
                >
                  <Typography
                    sx={{
                      color: '#6B7280',
                      fontSize: 11,
                      mb: 1,
                    }}
                  >
                    {item.label}
                  </Typography>

                  <Typography
                    sx={{
                      color: '#111827',
                      fontWeight: 700,
                      fontSize: 22,
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* ACTIVITIES */}

        <Card
          sx={{
            bgcolor:
              '#FFFFFF',

            backdropFilter:
              'blur(14px)',

            border:
              '1px solid #E5E7EB',

            borderRadius: 3,
          }}
        >
          <CardContent>
            <Typography
              sx={{
                color: '#111827',
                fontWeight: 700,
                mb: 3,
              }}
            >
              Recent Activities
            </Typography>

            <Stack spacing={3}>
              {activities.map(
                (
                  activity,
                  index
                ) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <Avatar
                      sx={{
                        width: 35,
                        height: 35,

                        bgcolor:
                          `${activity.color}18`,
                      }}
                    >
                      {activity.icon ===
                      'member' ? (
                        <PersonAddIcon
                          sx={{
                            color:
                              activity.color,

                            fontSize: 18,
                          }}
                        />
                      ) : (
                        <NotificationsIcon
                          sx={{
                            color:
                              activity.color,

                            fontSize: 18,
                          }}
                        />
                      )}
                    </Avatar>

                    <Box>
                      <Typography
                        sx={{
                          color:
                            '#111827',

                          fontSize: 14,
                          fontWeight: 600,
                        }}
                      >
                        {activity.label}
                      </Typography>

                      <Typography
                        sx={{
                          color:
                            '#6B7280',

                          fontSize: 12,
                        }}
                      >
                        Just now
                      </Typography>
                    </Box>
                  </Stack>
                )
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

function WaveLine({
  color = '#111827',
  top = 44,
  opacity = 1,
}) {
  return (
    <Box
      component="svg"
      viewBox="0 0 240 80"
      sx={{
        position: 'absolute',
        left: 0,
        right: 0,
        top,
        width: '100%',
        height: 72,
        opacity,
      }}
    >
      <path
        d="M0 45 C30 12, 55 70, 88 42 S145 18, 178 44 216 66, 240 34"
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </Box>
  )
}

function MiniBarChart() {
  const bars = [36, 58, 42, 86, 48, 64, 38]

  return (
    <Box
      sx={{
        height: 114,
        display: 'flex',
        alignItems: 'end',
        gap: 1.1,
        position: 'relative',
        pt: 2,
      }}
    >
      <WaveLine
        color="#EF4444"
        top={36}
        opacity={0.85}
      />
      <WaveLine
        color="#64748B"
        top={44}
        opacity={0.55}
      />

      {bars.map((height, index) => (
        <Box
          key={index}
          sx={{
            flex: 1,
            height,
            borderRadius: 8,
            bgcolor:
              index === 3
                ? '#FB7185'
                : '#D8D5CF',
            position: 'relative',
            zIndex: 1,
          }}
        />
      ))}
    </Box>
  )
}

function DashboardAnalytics({
  stats,
  activities,
  approvedUsers = [],
  registeredDevices = [],
}) {
  const totalPeople =
    stats.totalMembers +
    stats.activeUsers

  const activePercent =
    Math.round(
      (stats.activeUsers /
        Math.max(stats.totalMembers, 1)) *
        100
    )

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          lg: '2.15fr 1fr',
        },
        gap: 2,
        mb: 3,
      }}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1fr 1fr',
          },
          gap: 2,
          alignContent: 'start',
        }}
      >
      <Card
        sx={{
          minHeight: 260,
          borderRadius: 5,
          border: '1px solid #F3D3DD',
          background:
            'linear-gradient(135deg, #FB7185 0%, #EC4899 100%)',
          boxShadow:
            '0 22px 55px rgba(236,72,153,0.22)',
          color: '#fff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <CardContent
          sx={{
            p: '24px !important',
            height: '100%',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 800,
                opacity: 0.9,
              }}
            >
              User Reach
            </Typography>
            <MoreHorizIcon />
          </Stack>

          <Typography
            sx={{
              fontSize: {
                xs: 34,
                md: 42,
              },
              fontWeight: 900,
              mt: 2,
              letterSpacing: '-0.04em',
            }}
          >
            {totalPeople.toLocaleString(
              'en-IN'
            )}
          </Typography>

          <Typography
            sx={{
              fontSize: 12,
              opacity: 0.76,
              mt: 0.6,
            }}
          >
            Staff and mobile users connected
          </Typography>

          <Box
            sx={{
              position: 'relative',
              height: 86,
              mt: 1,
            }}
          >
            <WaveLine
              color="#FFFFFF"
              top={14}
              opacity={0.82}
            />
            <WaveLine
              color="#7C3AED"
              top={24}
              opacity={0.5}
            />
            <WaveLine
              color="#FDE68A"
              top={34}
              opacity={0.7}
            />
          </Box>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns:
                'repeat(3, 1fr)',
              gap: 1.5,
              mt: 1,
            }}
          >
            {[
              {
                label: 'Staff Users',
                value:
                  stats.totalMembers,
              },
              {
                label: 'Mobile Users',
                value:
                  stats.totalMobileUsers,
              },
              {
                label: 'Devices',
                value:
                  stats.totalDevices,
              },
            ].map((item, index) => (
              <Box
                key={item.label}
                sx={{
                  borderLeft:
                    index === 0
                      ? 'none'
                      : '1px solid rgba(255,255,255,0.45)',
                  pl: index === 0 ? 0 : 1.4,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 11,
                    opacity: 0.72,
                  }}
                >
                  {item.label}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 900,
                    mt: 0.3,
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>

        <Box
          sx={{
            position: 'absolute',
            right: -40,
            bottom: -55,
            width: 180,
            height: 180,
            borderRadius: '50%',
            bgcolor:
              'rgba(255,255,255,0.16)',
          }}
        />
      </Card>

      <Card
        sx={{
          borderRadius: 5,
          border: '1px solid #E5E7EB',
          boxShadow:
            '0 18px 45px rgba(17,24,39,0.07)',
        }}
      >
        <CardContent
          sx={{
            p: '24px !important',
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              <Typography
                sx={{
                  color: '#6B7280',
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                Mobile Activity
              </Typography>
              <Typography
                sx={{
                  color: '#111827',
                  fontSize: 34,
                  fontWeight: 900,
                  mt: 0.8,
                  letterSpacing: '-0.04em',
                }}
              >
                {activePercent}%
              </Typography>
            </Box>

            <Box
              sx={{
                width: 112,
                height: 112,
                borderRadius: '50%',
                background:
                  `conic-gradient(#EC4899 0 ${activePercent}%, #F3F4F6 ${activePercent}% 100%)`,
                display: 'grid',
                placeItems: 'center',
                boxShadow:
                  'inset 0 0 0 12px #FFFFFF',
              }}
            >
              <Avatar
                sx={{
                  width: 54,
                  height: 54,
                  bgcolor: '#FFF1F2',
                  color: '#EF4444',
                }}
              >
                <Diversity3Icon />
              </Avatar>
            </Box>
          </Stack>

          <Stack
            spacing={1.5}
            sx={{ mt: 3 }}
          >
            {[
              {
                label: 'Active Users',
                value: stats.activeUsers,
                color: '#F97316',
              },
              {
                label: 'Registered Members',
                value: stats.totalMembers,
                color: '#EC4899',
              },
            ].map((item) => (
              <Box key={item.label}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mb: 0.6 }}
                >
                  <Typography
                    sx={{
                      color: '#6B7280',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {item.label}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#111827',
                      fontSize: 12,
                      fontWeight: 900,
                    }}
                  >
                    {item.value}
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={
                    (item.value /
                      Math.max(
                        totalPeople,
                        1
                      )) *
                    100
                  }
                  sx={{
                    height: 8,
                    borderRadius: 99,
                    bgcolor: '#F3F4F6',
                    '& .MuiLinearProgress-bar':
                      {
                        bgcolor:
                          item.color,
                        borderRadius: 99,
                      },
                  }}
                />
              </Box>
            ))}
        </Stack>
      </CardContent>
    </Card>

        <Card
          sx={{
            gridColumn: {
              xs: 'auto',
              md: '1 / -1',
            },
            borderRadius: 4,
            border: '1px solid #E5E7EB',
            boxShadow:
              '0 16px 36px rgba(17,24,39,0.05)',
            overflow: 'hidden',
          }}
        >
          <CardContent
            sx={{
              p: '0 !important',
            }}
          >
            <Stack
              direction="row"
              spacing={3}
              alignItems="center"
              sx={{
                px: 2.2,
                pt: 2,
                pb: 1.2,
              }}
            >
              <Typography
                sx={{
                  color: '#111827',
                  fontSize: 13,
                  fontWeight: 900,
                  pb: 1,
                  borderBottom:
                    '2px solid #111827',
                }}
              >
                Registered Devices
              </Typography>

            </Stack>

            <Stack spacing={0}>
              {registeredDevices.length === 0 ? (
                <Box
                  sx={{
                    px: 2,
                    py: 4,
                    textAlign: 'center',
                    color: '#6B7280',
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  No registered devices found
                </Box>
              ) : (
                registeredDevices
                  .slice(0, 4)
                  .map((device, index) => {
                    const uploader = device
                    const uploaderName =
                      getUserName(uploader)
                    const uploaderImage =
                      getProfileImage(uploader)
                    const createdAt =
                      device?.deviceRegisteredAt ||
                      device?.createdAt ||
                      device?.updatedAt

                    return (
                    <Stack
                      key={
                        device?._id ||
                        device?.id ||
                        `${getDeviceName(device)}-${index}`
                      }
                      direction="row"
                      alignItems="center"
                      sx={{
                        px: 1.5,
                        py: 1.15,
                        mx: 1.2,
                        mb: 0.9,
                        borderRadius: 3,
                        bgcolor: '#FFFFFF',
                        border:
                          '1px solid #F3F4F6',
                        boxShadow:
                          '0 8px 22px rgba(17,24,39,0.04)',
                        gap: 1.4,
                      }}
                    >
                      <Box
                        sx={{
                          width: 46,
                          height: 46,
                          borderRadius: 2,
                          bgcolor: '#F3F4F6',
                          overflow: 'hidden',
                          display: 'grid',
                          placeItems: 'center',
                          color: '#111827',
                          flexShrink: 0,
                          position: 'relative',
                        }}
                      >
                        <DevicesIcon
                          sx={{
                            fontSize: 22,
                            color: '#6B7280',
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          minWidth: 0,
                          flex: 1,
                        }}
                      >
                        <Typography
                          noWrap
                          sx={{
                            color: '#111827',
                            fontSize: 12,
                            fontWeight: 900,
                          }}
                        >
                          {getDeviceName(device)}
                        </Typography>
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={0.8}
                          sx={{ mt: 0.4 }}
                        >
                          <Avatar
                            src={uploaderImage}
                            sx={{
                              width: 18,
                              height: 18,
                              fontSize: 9,
                              bgcolor:
                                '#E5E7EB',
                              color:
                                '#111827',
                            }}
                          >
                            {getInitial(
                              uploaderName
                            )}
                          </Avatar>
                          <Typography
                            noWrap
                            sx={{
                              color: '#6B7280',
                              fontSize: 10.5,
                              maxWidth: 180,
                            }}
                          >
                            {uploaderName}
                          </Typography>
                        </Stack>
                      </Box>

                      <Typography
                        sx={{
                          color: '#111827',
                          fontSize: 11,
                          fontWeight: 800,
                          width: {
                            xs: 62,
                            sm: 88,
                          },
                          display: {
                            xs: 'none',
                            sm: 'block',
                          },
                        }}
                      >
                        {getDevicePlatform(device)}
                      </Typography>

                      <Typography
                        sx={{
                          color: '#6B7280',
                          fontSize: 11,
                          fontWeight: 700,
                          flexShrink: 0,
                          width: 92,
                          display: {
                            xs: 'none',
                            md: 'block',
                          },
                        }}
                      >
                        {createdAt || 'Recent'}
                      </Typography>

                      <MoreHorizIcon
                        sx={{
                          color: '#111827',
                          fontSize: 18,
                        }}
                      />
                    </Stack>
                    )
                  })
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 2,
        }}
      >
        <Card
          sx={{
            borderRadius: 5,
            border: '1px solid #E5E7EB',
            boxShadow:
              '0 16px 36px rgba(17,24,39,0.06)',
          }}
        >
          <CardContent
            sx={{
              p: '18px !important',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
            >
              <Avatar
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: 4,
                  bgcolor: '#FFE4E6',
                  color: '#111827',
                  fontWeight: 900,
                }}
              >
                <DevicesIcon />
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    color: '#111827',
                    fontSize: 24,
                    fontWeight: 900,
                  }}
                >
                  {stats.totalDevices}
                </Typography>
                <Typography
                  sx={{
                    color: '#6B7280',
                    fontSize: 12,
                    fontWeight: 700,
                    mb: 1,
                  }}
                >
                  Registered Devices
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={72}
                  sx={{
                    height: 9,
                    borderRadius: 99,
                    bgcolor: '#F3F4F6',
                    '& .MuiLinearProgress-bar':
                      {
                        bgcolor: '#111827',
                        borderRadius: 99,
                      },
                  }}
                />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card
          sx={{
            borderRadius: 5,
            border: '1px solid #E5E7EB',
            boxShadow:
              '0 16px 36px rgba(17,24,39,0.06)',
          }}
        >
          <CardContent
            sx={{
              p: '18px !important',
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ mb: 1.5 }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1.2}
              >
                <Avatar
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: '#DCFCE7',
                    color: '#16A34A',
                  }}
                >
                  <VerifiedUserIcon />
                </Avatar>

                <Box>
                  <Typography
                    sx={{
                      color: '#111827',
                      fontSize: 14,
                      fontWeight: 900,
                    }}
                  >
                    Verified Profiles
                  </Typography>
                  <Typography
                    sx={{
                      color: '#6B7280',
                      fontSize: 11,
                      mt: 0.3,
                    }}
                  >
                    Latest 5 approved users
                  </Typography>
                </Box>
              </Stack>

              <TrendingUpIcon
                sx={{ color: '#16A34A' }}
              />
            </Stack>

            <Stack spacing={1}>
              {approvedUsers.length === 0 ? (
                <Box
                  sx={{
                    py: 3,
                    textAlign: 'center',
                    color: '#6B7280',
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  No approved users found
                </Box>
              ) : (
                approvedUsers
                  .slice(0, 5)
                  .map((profile) => {
                    const name =
                      getUserName(profile)
                    const image =
                      getProfileImage(profile)

                    return (
                      <Stack
                        key={
                          profile?._id ||
                          profile?.id ||
                          name
                        }
                        direction="row"
                        alignItems="center"
                        spacing={1.2}
                        sx={{
                          p: 1,
                          borderRadius: 3,
                          bgcolor: '#F9FAFB',
                          border:
                            '1px solid #F3F4F6',
                        }}
                      >
                        <Avatar
                          src={image}
                          sx={{
                            width: 38,
                            height: 38,
                            bgcolor: '#E5E7EB',
                            color: '#111827',
                            fontSize: 13,
                            fontWeight: 900,
                          }}
                        >
                          {getInitial(name)}
                        </Avatar>

                        <Box
                          sx={{
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <Typography
                            noWrap
                            sx={{
                              color: '#111827',
                              fontSize: 12.5,
                              fontWeight: 900,
                            }}
                          >
                            {name}
                          </Typography>
                          <Typography
                            noWrap
                            sx={{
                              color: '#6B7280',
                              fontSize: 11,
                              mt: 0.2,
                            }}
                          >
                            {profile?.mobileNumber ||
                              profile?.mobile ||
                              '-'}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            width: 9,
                            height: 9,
                            borderRadius: '50%',
                            bgcolor: '#16A34A',
                            flexShrink: 0,
                          }}
                        />
                      </Stack>
                    )
                  })
              )}
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
