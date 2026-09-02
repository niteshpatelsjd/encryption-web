import api from './axiosInstance'

/**
 * @typedef {'ACTIVE'|'REVOKED'|'ALL'} DeviceStatus
 *
 * @typedef {Object} DeviceListRequest
 * @property {string} userId
 * @property {number} [pageIndex]
 * @property {number} [pageSize]
 * @property {DeviceStatus} [status]
 *
 * @typedef {Object} DeviceRecord
 * @property {string} [id]
 * @property {string} [deviceId]
 * @property {string} [deviceName]
 * @property {string} [deviceType]
 * @property {string} [identityKeyAlgorithm]
 * @property {number|string} [registrationId]
 * @property {DeviceStatus} status
 * @property {string} [lastSeen]
 * @property {string} [registeredAt]
 * @property {string} [revokedAt]
 *
 * @typedef {Object} DevicePaginationResponse
 * @property {DeviceRecord[]} content
 * @property {string} userId
 * @property {DeviceStatus} status
 * @property {number} pageIndex
 * @property {number} pageSize
 * @property {number} totalRecords
 * @property {number} totalActive
 * @property {number} totalRevoked
 * @property {number} totalPages
 * @property {boolean} isLast
 * @property {boolean} hasNext
 * @property {boolean} hasPrevious
 *
 * @typedef {Object} RevokeDeviceResponse
 * @property {number} responseCode
 * @property {string} message
 * @property {unknown} responseBody
 */

/** @param {DeviceListRequest} request @returns {Promise<DevicePaginationResponse>} */
export async function getUserDevices({
  userId,
  pageIndex = 0,
  pageSize = 10,
  status = 'ALL',
}) {
  const response = await api.get('/devices', {
    params: { userId, pageIndex, pageSize, status },
  })
  if (response?.data?.responseCode !== 200) {
    const error = new Error(response?.data?.message || 'Unable to fetch devices')
    error.response = response
    throw error
  }
  return response.data.responseBody
}

/** @param {{userId: string, deviceId: string}} request @returns {Promise<RevokeDeviceResponse>} */
export async function revokeUserDevice({ userId, deviceId }) {
  const response = await api.delete(`/devices/${encodeURIComponent(deviceId)}`, {
    params: { userId },
  })
  if (response?.data?.responseCode !== 200) {
    const error = new Error(response?.data?.message || 'Unable to revoke device')
    error.response = response
    throw error
  }
  return response.data
}
