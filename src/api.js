// Set VITE_API_URL in .env to the backend URL (no trailing slash)
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '')

async function request(path, { token, ...options } = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...(token && { Authorization: `Bearer ${token}` }), ...options.headers },
  })
  if (res.status === 204) return null
  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw Object.assign(new Error(body.error || `Request failed (${res.status})`), { status: res.status })
  return body
}

export const fetchEvents = () => request('/api/events')

export const login = (password) =>
  request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })

// `form` is a FormData with the event fields and, optionally, the `image` file
export const saveEvent = (token, id, form) =>
  request(id ? `/api/events/${id}` : '/api/events', { method: id ? 'PUT' : 'POST', token, body: form })

export const deleteEvent = (token, id) => request(`/api/events/${id}`, { method: 'DELETE', token })
