import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

import { setCredentials } from '../../store/slices/authSlice'
import { API_BASE_URL, publicApi } from '../../api/axiosInstance'

const encryptionLogo = '/favicon.svg'

const schema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),

  password: yup
    .string()
    .required('Password is required'),
})

const isSuccessResponse = (res) =>
  res?.status >= 200 &&
  res?.status < 300 &&
  (res.data?.responseCode === undefined ||
    res.data?.responseCode === 200)

const apiUrl = (path) =>
  `${API_BASE_URL.replace(/\/$/, '')}${path}`

const postPublicJson = async (path, payload) => {
  const response = await fetch(apiUrl(path), {
    method: 'POST',
    headers: {
      accept: '*/*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => ({}))

  return {
    status: response.status,
    data,
  }
}

export default function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [showPass, setShowPass] =
    useState(false)
  const [forgotOpen, setForgotOpen] =
    useState(false)
  const [forgotStep, setForgotStep] =
    useState('email')
  const [forgotEmail, setForgotEmail] =
    useState('')
  const [otp, setOtp] =
    useState('')
  const [newPassword, setNewPassword] =
    useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')
  const [forgotLoading, setForgotLoading] =
    useState(false)
  const [viewportWidth, setViewportWidth] =
    useState(
      typeof window === 'undefined'
        ? 1200
        : window.innerWidth
    )

  useEffect(() => {
    const handleResize = () =>
      setViewportWidth(window.innerWidth)

    handleResize()
    window.addEventListener('resize', handleResize)

    return () =>
      window.removeEventListener('resize', handleResize)
  }, [])

  const isTablet = viewportWidth <= 1100
  const isMobile = viewportWidth <= 640

  const {
    register,
    handleSubmit,

    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (
    data
  ) => {
    try {
      const res = await publicApi.post(
        '/user/login',
        {
          email: data.email,
          password: data.password,
        }
      )

      const body = res.data

      if (
        body.responseCode !== 200
      ) {
        toast.error(
          body.message ||
            'Invalid credentials'
        )

        return
      }

      const payload =
        body.responseBody

      dispatch(
        setCredentials({
          token:
            payload?.accessToken,

          user:
            payload?.userResponse,
        })
      )

      toast.success(
        'Welcome back!'
      )

      navigate('/dashboard', {
        replace: true,
      })
    } catch (err) {
      toast.error(
        err.response?.data
          ?.message ||
          'Invalid credentials'
      )
    }
  }

  const closeForgotPassword = () => {
    setForgotOpen(false)
    setForgotStep('email')
    setForgotEmail('')
    setOtp('')
    setNewPassword('')
    setConfirmPassword('')
  }

  const sendForgotOtp = async () => {
    if (!forgotEmail.trim()) {
      toast.error('Please enter email')
      return
    }

    try {
      setForgotLoading(true)
      const res = await postPublicJson(
        '/user/forgot-password-otp',
        {
          email: forgotEmail.trim(),
        }
      )

      if (!isSuccessResponse(res)) {
        toast.error(res.data?.message || 'Failed to send OTP')
        return
      }

      toast.success(res.data?.message || 'OTP sent successfully')
      setForgotStep('reset')
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Failed to send OTP'
      )
    } finally {
      setForgotLoading(false)
    }
  }

  const resetPasswordWithOtp = async () => {
    if (!forgotEmail.trim() || !otp.trim() || !newPassword.trim()) {
      toast.error('Please enter email, OTP and new password')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Password and confirm password do not match')
      return
    }

    try {
      setForgotLoading(true)
      const res = await postPublicJson(
        '/user/reset-password-otp',
        {
          email: forgotEmail.trim(),
          otp: otp.trim(),
          newPassword: newPassword.trim(),
        }
      )

      if (!isSuccessResponse(res)) {
        toast.error(res.data?.message || 'Failed to reset password')
        return
      }

      toast.success(res.data?.message || 'Password reset successfully')
      closeForgotPassword()
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          'Failed to reset password'
      )
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div
      style={{
        ...styles.root,
        ...(isTablet ? styles.rootTablet : {}),
        ...(isMobile ? styles.rootMobile : {}),
      }}
    >
      {/* LEFT PANEL */}

      <div
        style={{
          ...styles.left,
          ...(isTablet ? styles.leftTablet : {}),
          ...(isMobile ? styles.leftMobile : {}),
        }}
      >
        <div
          style={{
            ...styles.leftInner,
            ...(isMobile ? styles.leftInnerMobile : {}),
          }}
        >
          <div
            style={
              styles.logoLargeWrap
            }
          >
            <img
              src={encryptionLogo}
              alt="Encryption Web"
              style={{
                ...styles.logoLarge,
                ...(isTablet ? styles.logoLargeTablet : {}),
                ...(isMobile ? styles.logoLargeMobile : {}),
              }}
            />
          </div>

          <h1
            style={{
              ...styles.leftTitle,
              ...(isMobile ? styles.leftTitleMobile : {}),
            }}
          >
            Encryption Web
          </h1>

          <p
            style={{
              ...styles.leftSub,
              ...(isMobile ? styles.leftSubMobile : {}),
            }}
          >
            Secure, simple administration for your organization.
          </p>

          <div style={styles.appDownload}>
            <p style={styles.appDownloadTitle}>
              Access Encryption Web securely from any device
            </p>

            <div
              style={{
                ...styles.storeBadges,
                ...(isMobile ? styles.storeBadgesMobile : {}),
              }}
            >
              <div
                style={{
                  ...styles.storeBadge,
                  ...(isMobile ? styles.storeBadgeMobile : {}),
                }}
              >
                <svg style={styles.playIcon} viewBox="0 0 40 44" aria-hidden="true">
                  <path d="M3.2 1.6c-.8.5-1.3 1.5-1.3 2.8v35.2c0 1.3.5 2.3 1.3 2.8L22 22 3.2 1.6Z" fill="#34A853" />
                  <path d="M28.5 15.1 22 22l6.5 6.9 8.1-4.7c2.5-1.4 2.5-3 0-4.4l-8.1-4.7Z" fill="#FBBC04" />
                  <path d="m3.2 1.6 25.3 13.5L22 22 3.2 1.6Z" fill="#4285F4" />
                  <path d="M3.2 42.4 22 22l6.5 6.9L3.2 42.4Z" fill="#EA4335" />
                </svg>
                <span style={styles.storeTextWrap}>
                  <span style={styles.storeSmallText}>GET IT ON</span>
                  <span style={styles.storeMainText}>Google Play</span>
                </span>
              </div>

              <div
                style={{
                  ...styles.storeBadge,
                  ...(isMobile ? styles.storeBadgeMobile : {}),
                }}
              >
                <svg style={styles.appleIcon} viewBox="0 0 24 28" aria-hidden="true">
                  <path
                    d="M19.6 14.9c0-3.1 2.5-4.6 2.6-4.7-1.5-2.1-3.7-2.4-4.5-2.5-1.9-.2-3.7 1.1-4.6 1.1-1 0-2.5-1.1-4.1-1.1-2.1 0-4 1.2-5.1 3.1-2.2 3.8-.6 9.4 1.6 12.4 1.1 1.5 2.3 3.1 3.9 3 1.6-.1 2.2-1 4.1-1s2.4 1 4.1 1c1.7 0 2.8-1.5 3.8-3 1.2-1.7 1.7-3.4 1.7-3.5-.1-.1-3.5-1.4-3.5-4.8ZM16.4 5.7c.9-1.1 1.5-2.5 1.3-4-.1 0-1.5.1-2.9 1.3-1.2 1-1.6 2.3-1.5 3.7 1.3.1 2.4-.4 3.1-1Z"
                    fill="currentColor"
                  />
                </svg>
                <span style={styles.storeTextWrap}>
                  <span style={styles.storeSmallText}>Download on the</span>
                  <span style={styles.storeMainText}>App Store</span>
                </span>
              </div>
            </div>
          </div>

        </div>

        <div style={styles.leftBg} />
      </div>

      {/* RIGHT PANEL */}

      <div
        style={{
          ...styles.right,
          ...(isTablet ? styles.rightTablet : {}),
          ...(isMobile ? styles.rightMobile : {}),
        }}
      >
        <div
          style={{
            ...styles.card,
            ...(isMobile ? styles.cardMobile : {}),
          }}
        >
          {/* LOGO */}

          <div style={styles.logoWrap}>
            <div
              style={styles.logoBox}
            >
              <img
                src={encryptionLogo}
                alt="Encryption Web"
                style={styles.logoSmall}
              />
            </div>
          </div>

          <h2 style={styles.title}>Login as an Admin User</h2>

          <p style={styles.subtitle}>Enter your credentials to access the administration panel.</p>

          <form
            onSubmit={handleSubmit(
              onSubmit
            )}
            style={styles.form}
            noValidate
          >
            {/* EMAIL */}

            <div
              style={styles.fieldWrap}
            >
              <label
                style={styles.label}
              >Email</label>

              <div
                style={styles.inputWrap}
              >
                <span
                  style={
                    styles.inputIcon
                  }
                >
                  <svg
                    width="18"
                    height="18"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                      stroke="#111827"
                      strokeWidth="2"
                    />

                    <polyline
                      points="22,6 12,13 2,6"
                      stroke="#111827"
                      strokeWidth="2"
                    />
                  </svg>
                </span>

                <input
                  type="email"
                  placeholder="admin@example.com"
                  style={{
                    ...styles.input,

                    ...(errors.email
                      ? styles.inputError
                      : {}),
                  }}
                  {...register(
                    'email'
                  )}
                />
              </div>

              {errors.email && (
                <span
                  style={
                    styles.errorMsg
                  }
                >
                  {
                    errors.email
                      .message
                  }
                </span>
              )}
            </div>

            {/* PASSWORD */}

            <div
              style={styles.fieldWrap}
            >
              <label
                style={styles.label}
              >Password</label>

              <div
                style={styles.inputWrap}
              >
                <span
                  style={
                    styles.inputIcon
                  }
                >
                  <svg
                  width="18"
                  height="18"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    ry="2"
                    stroke="#111827"
                    strokeWidth="2"
                  />

                  <path
                    d="M7 11V7a5 5 0 0 1 10 0v4"
                    stroke="#111827"
                    strokeWidth="2"
                  />
                </svg>
                </span>

                <input
                  type={
                    showPass
                      ? 'text'
                      : 'password'
                  }
                  placeholder="Enter password"
                  style={{
                    ...styles.input,

                    paddingRight: 44,

                    ...(errors.password
                      ? styles.inputError
                      : {}),
                  }}
                  {...register(
                    'password'
                  )}
                />

                <button
                  type="button"
                  style={
                    styles.eyeBtn
                  }
                  onClick={() =>
                    setShowPass(
                      !showPass
                    )
                  }
                >
                  {showPass ? (
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
  >
    {/* FULL EYE */}
    <path
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      stroke="#111827"
      strokeWidth="1.5"
    />

    <circle
      cx="12"
      cy="12"
      r="3"
      stroke="#111827"
      strokeWidth="1.5"
    />

    {/* SLASH */}
    <line
      x1="1"
      y1="1"
      x2="23"
      y2="23"
      stroke="#111827"
      strokeWidth="1.5"
    />
  </svg>
) : (
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
  >
    <path
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
      stroke="#111827"
      strokeWidth="1.5"
    />

    <circle
      cx="12"
      cy="12"
      r="3"
      stroke="#111827"
      strokeWidth="1.5"
    />
  </svg>
)}
                </button>
              </div>

              {errors.password && (
                <span
                  style={
                    styles.errorMsg
                  }
                >
                  {
                    errors.password
                      .message
                  }
                </span>
              )}
            </div>

            <button
              type="button"
              style={styles.forgotBtn}
              onClick={() => {
                setForgotEmail('')
                setForgotOpen(true)
              }}
            >
              Forgot Password?
            </button>

            {/* SUBMIT */}

            <button
              type="submit"
              style={{
                ...styles.submitBtn,

                opacity:
                  isSubmitting
                    ? 0.7
                    : 1,
              }}
              disabled={
                isSubmitting
              }
            >
              {isSubmitting ? (
                <span
                  style={
                    styles.spinnerWrap
                  }
                >
                  <span
                    style={
                      styles.spinner
                    }
                  />

                  Signing in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <p style={styles.footer}>Encryption Web © {new Date().getFullYear()}</p>
        </div>

        {forgotOpen && (
          <div style={styles.modalOverlay}>
            <div style={styles.modalCard}>
              <div style={styles.modalHeader}>
                <div>
                  <h3 style={styles.modalTitle}>
                    Forgot Password
                  </h3>
                  <p style={styles.modalSub}>
                    {forgotStep === 'email'
                      ? 'Enter your email to receive OTP'
                      : 'Enter OTP and set your new password'}
                  </p>
                </div>

                <button
                  type="button"
                  style={styles.modalClose}
                  onClick={closeForgotPassword}
                  aria-label="Close forgot password"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M18 6 6 18M6 6l12 12"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>

              <div style={styles.modalBody}>
                <div style={styles.fieldWrap}>
                  <label style={styles.label}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="test@test.test"
                    value={forgotEmail}
                    disabled={forgotStep === 'reset'}
                    onChange={(e) =>
                      setForgotEmail(e.target.value)
                    }
                    style={styles.modalInput}
                  />
                </div>

                {forgotStep === 'reset' && (
                  <>
                    <div style={styles.fieldWrap}>
                      <label style={styles.label}>
                        OTP
                      </label>
                      <input
                        type="text"
                        placeholder="Enter 6 digit OTP"
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value)
                        }
                        style={styles.modalInput}
                      />
                    </div>

                    <div style={styles.fieldWrap}>
                      <label style={styles.label}>
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) =>
                          setNewPassword(e.target.value)
                        }
                        style={styles.modalInput}
                      />
                    </div>

                    <div style={styles.fieldWrap}>
                      <label style={styles.label}>
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) =>
                          setConfirmPassword(e.target.value)
                        }
                        style={styles.modalInput}
                      />
                    </div>
                  </>
                )}
              </div>

              <div style={styles.modalActions}>
                {forgotStep === 'reset' && (
                  <button
                    type="button"
                    style={styles.secondaryBtn}
                    onClick={() => setForgotStep('email')}
                    disabled={forgotLoading}
                  >
                    Change Email
                  </button>
                )}

                <button
                  type="button"
                  style={styles.submitBtn}
                  disabled={forgotLoading}
                  onClick={
                    forgotStep === 'email'
                      ? sendForgotOtp
                      : resetPasswordWithOtp
                  }
                >
                  {forgotLoading
                    ? 'Please wait...'
                    : forgotStep === 'email'
                    ? 'Send OTP'
                    : 'Reset Password'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  root: {
    display: 'flex',
    height: '100vh',
    background:
      '#FFFFFF',
    fontFamily:
      'Inter, sans-serif',
    padding: 24,
    gap: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    boxSizing: 'border-box',
  },

  rootTablet: {
    height: 'auto',
    minHeight: '100vh',
    flexDirection: 'column',
    padding: 18,
    overflowY: 'auto',
    overflowX: 'hidden',
  },

  rootMobile: {
    padding: 12,
    justifyContent: 'flex-start',
  },

  left: {
    flex: '0 1 560px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',

    background:
      'linear-gradient(145deg, #FFF7ED 0%, #FFFFFF 46%, #F8FAFC 100%)',

    borderRight:
      '1px solid #D1D5DB',
    borderRadius: '28px 0 0 28px',
    boxShadow:
      '0 22px 70px rgba(124,45,18,0.08)',
    height: 'calc(100vh - 48px)',
    maxHeight: 680,
  },

  leftTablet: {
    width: '100%',
    flex: '0 0 auto',
    height: 'auto',
    maxHeight: 'none',
    borderRadius: '24px 24px 0 0',
    borderRight: 'none',
    borderBottom: '1px solid #D1D5DB',
  },

  leftMobile: {
    borderRadius: '20px 20px 0 0',
    boxShadow: '0 14px 40px rgba(124,45,18,0.07)',
  },

  leftBg: {
    position: 'absolute',
    inset: 0,

    background:
      'radial-gradient(circle at 18% 22%, rgba(251,146,60,0.20) 0%, transparent 30%), radial-gradient(circle at 82% 18%, rgba(124,45,18,0.10) 0%, transparent 34%), linear-gradient(115deg, transparent 0%, rgba(255,255,255,0.78) 42%, transparent 58%)',

    pointerEvents: 'none',
  },

  leftInner: {
    position: 'relative',
    zIndex: 1,
    padding: '32px 56px',
    maxWidth: 460,
    width: '100%',
  },

  leftInnerMobile: {
    padding: '22px 18px',
  },

  logoLargeWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 18,
  },

  logoLarge: {
    width: 250,
    height: 250,
    objectFit: 'contain',
    filter:
      'drop-shadow(0 18px 36px rgba(15,23,42,0.16))',
    borderRadius: 36,
  },

  logoLargeTablet: {
    width: 170,
    height: 170,
  },

  logoLargeMobile: {
    width: 116,
    height: 116,
    borderRadius: 24,
  },

  leftTitle: {
    fontSize: 34,
    fontWeight: 850,
    color: '#111827',
    lineHeight: 1.2,
    marginBottom: 8,
    letterSpacing: '-0.5px',
    textAlign: 'center',
  },

  leftTitleMobile: {
    fontSize: 24,
    lineHeight: 1.15,
  },

  leftSub: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    fontWeight: 500,
    textAlign: 'center',
  },

  leftSubMobile: {
    fontSize: 13,
    marginBottom: 16,
  },

  appDownload: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 14,
  },

  appDownloadTitle: {
    margin: 0,
    color: '#111827',
    fontSize: 15,
    fontWeight: 800,
    textAlign: 'center',
    letterSpacing: '-0.1px',
  },

  storeBadges: {
    display: 'flex',
    justifyContent: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },

  storeBadgesMobile: {
    gap: 8,
  },

  storeBadge: {
    minWidth: 168,
    height: 54,
    borderRadius: 12,
    background: '#111827',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: '0 16px',
    boxShadow: '0 12px 28px rgba(17,24,39,0.16)',
    border: '1px solid rgba(255,255,255,0.08)',
  },

  storeBadgeMobile: {
    minWidth: 146,
    height: 46,
    borderRadius: 10,
    padding: '0 12px',
  },

  playIcon: {
    width: 27,
    height: 30,
    flexShrink: 0,
    display: 'block',
  },

  appleIcon: {
    width: 30,
    height: 34,
    flexShrink: 0,
    display: 'block',
    color: '#FFFFFF',
  },

  storeTextWrap: {
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.05,
  },

  storeSmallText: {
    fontSize: 8.5,
    fontWeight: 700,
    letterSpacing: '0.05em',
    opacity: 0.82,
    textTransform: 'uppercase',
  },

  storeMainText: {
    fontSize: 16,
    fontWeight: 900,
    letterSpacing: '-0.2px',
  },

  right: {
    flex: '0 1 500px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '56px 64px',

    background:
      '#FFFFFF',
    borderRadius: '0 28px 28px 0',
    height: 'calc(100vh - 48px)',
    maxHeight: 680,
    boxShadow:
      '0 22px 70px rgba(15,23,42,0.08)',
    overflow: 'hidden',

    
  },

  rightTablet: {
    width: '100%',
    flex: '0 0 auto',
    height: 'auto',
    maxHeight: 'none',
    borderRadius: '0 0 24px 24px',
    padding: '34px 28px',
  },

  rightMobile: {
    borderRadius: '0 0 20px 20px',
    padding: '24px 18px',
    boxShadow: '0 14px 40px rgba(15,23,42,0.08)',
  },

  card: {
    width: '100%',
    maxWidth: 360,

    background:
      '#FFFFFF',
    border:
      'none',

    borderRadius: 0,

    padding: 0,

    boxShadow:
      'none',

    backdropFilter:
      'blur(10px)',
  },

  cardMobile: {
    maxWidth: '100%',
  },

  logoWrap: {
    marginBottom: 22,
    display: 'flex',
    justifyContent: 'center',
  },

  logoBox: {
    width: 76,
    height: 76,

    background:
      'rgba(17,24,39,0.06)',

    border:
      '1px solid #E5E7EB',

    borderRadius: 22,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow:
      '0 12px 30px rgba(15,23,42,0.10)',
    overflow: 'hidden',
  },

  logoSmall: {
    width: 66,
    height: 66,
    objectFit: 'cover',
    borderRadius: 18,
  },

  title: {
    fontSize: 22,
    fontWeight: 850,
    color: '#111827',
    marginBottom: 8,
    letterSpacing: '-0.3px',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 12.5,
    color:
      '#6B7280',
    marginBottom: 28,
    textAlign: 'center',
    lineHeight: 1.55,
  },

  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },

  fieldWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },

  label: {
    fontSize: 13,
    fontWeight: 800,
    color: '#111827',
  },

  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },

  inputIcon: {
  position: 'absolute',
  left: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#111827',
  zIndex: 2,
},

  input: {
    width: '100%',
    padding:
      '12px 14px 12px 42px',

    background:
      '#FFFFFF',

    border:
      '1px solid #D1D5DB',

    borderRadius: 14,

    color: '#111827',

    fontSize: 14,

    outline: 'none',

    transition:
      'all 0.2s ease',

    fontFamily:
      'Inter, sans-serif',

    backdropFilter:
      'blur(8px)',
  },

  inputError: {
    borderColor: '#DC2626',
  },

  eyeBtn: {
    position: 'absolute',
    right: 12,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
  },

  errorMsg: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 2,
  },

  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: -10,
    background: 'transparent',
    border: 'none',
    color: '#111827',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    padding: 0,
  },

  submitBtn: {
    marginTop: 6,
    width: '100%',
    padding: '13px 24px',

    background: 'linear-gradient(135deg, #111827 0%, #000000 100%)',

    color: '#FFFFFF',

    border: 'none',
    borderRadius: 14,

    fontSize: 14,
    fontWeight: 800,

    cursor: 'pointer',

    fontFamily:
      'Inter, sans-serif',

    transition:
      'all 0.2s ease',

    letterSpacing: '0.2px',
    boxShadow:
      '0 16px 32px rgba(17,24,39,0.18)',
  },

  spinnerWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  spinner: {
    width: 16,
    height: 16,

    border:
      '2px solid rgba(255,255,255,0.3)',

    borderTopColor: '#fff',

    borderRadius: '50%',

    animation:
      'spin 0.7s linear infinite',

    display: 'inline-block',
  },

  footer: {
    marginTop: 32,
    textAlign: 'center',
    fontSize: 12,

    color:
      '#6B7280',
    lineHeight: 1.5,
  },

  modalOverlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(15,23,42,0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    zIndex: 9999,
  },

  modalCard: {
    width: '100%',
    maxWidth: 420,
    background:
      'linear-gradient(145deg, #FFFFFF 0%, #F9FAFB 100%)',
    borderRadius: 22,
    boxShadow:
      '0 24px 70px rgba(0,0,0,0.35)',
    border: '1px solid #E5E7EB',
    overflow: 'hidden',
  },

  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    padding: '22px 24px',
    borderBottom: '1px solid #E5E7EB',
  },

  modalTitle: {
    margin: 0,
    color: '#111827',
    fontSize: 22,
    fontWeight: 800,
  },

  modalSub: {
    margin: '6px 0 0',
    color: '#6B7280',
    fontSize: 13,
    fontWeight: 600,
  },

  modalClose: {
    width: 34,
    height: 34,
    borderRadius: 12,
    border: '1px solid #E5E7EB',
    background: '#FFFFFF',
    color: '#111827',
    fontSize: 24,
    lineHeight: 1,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },

  modalBody: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    padding: '22px 24px',
  },

  modalInput: {
    width: '100%',
    padding: '11px 13px',
    background: '#FFFFFF',
    border: '1px solid #D1D5DB',
    borderRadius: 10,
    color: '#111827',
    fontSize: 14,
    outline: 'none',
    fontFamily:
      'Inter, sans-serif',
  },

  modalActions: {
    display: 'flex',
    gap: 12,
    padding: '0 24px 24px',
  },

  secondaryBtn: {
    flex: 1,
    padding: '11px 16px',
    background: '#FFFFFF',
    color: '#111827',
    border: '1px solid #D1D5DB',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily:
      'Inter, sans-serif',
  },
}



