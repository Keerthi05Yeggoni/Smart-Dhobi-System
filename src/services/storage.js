export const STORAGE_KEYS = {
  STUDENTS: 'smartdhobi_students',
  BAGS: 'smartdhobi_bags',
  STAFF: 'smartdhobi_staffs',
  ADMINS: 'smartdhobi_admins',
  AUDIT: 'smartdhobi_audit',
}

export const SESSION_KEY = 'smartdhobi_session'

export function getItem(key) {
  const raw = localStorage.getItem(key)
  try { return raw ? JSON.parse(raw) : null } catch { return null }
}

export function setItem(key, value) {
  if (value === null || typeof value === 'undefined') {
    localStorage.removeItem(key)
  } else {
    localStorage.setItem(key, JSON.stringify(value))
  }
}

export function initDefaults() {
  if (!getItem(STORAGE_KEYS.BAGS)) setItem(STORAGE_KEYS.BAGS, [])
  if (!getItem(STORAGE_KEYS.STUDENTS)) setItem(STORAGE_KEYS.STUDENTS, [])
  if (!getItem(STORAGE_KEYS.STAFF)) setItem(STORAGE_KEYS.STAFF, [])
  if (!getItem(STORAGE_KEYS.ADMINS)) setItem(STORAGE_KEYS.ADMINS, [{ username: 'admin', password: 'admin123', displayName: 'Admin' }])
  if (!getItem(STORAGE_KEYS.AUDIT)) setItem(STORAGE_KEYS.AUDIT, [])
}
