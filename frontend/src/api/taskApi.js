const BASE = '/api/tasks'

async function request(url, options = {}) {
  const token = localStorage.getItem('auth_token')
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(url, { headers, ...options })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Request failed')
  }
  return res.status === 204 ? null : res.json()
}

export const getAllTasks  = ()           => request(BASE)
export const createTask  = (data)       => request(BASE, { method: 'POST', body: JSON.stringify(data) })
export const updateTask  = (id, data)   => request(`${BASE}/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const patchStatus = (id, status) => request(`${BASE}/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) })
export const deleteTask  = (id)         => request(`${BASE}/${id}`, { method: 'DELETE' })

export const login = (username, password) =>
  fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }).then(async res => {
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Login failed')
    return data
  })

export const logout = () => request('/api/auth/logout', { method: 'POST' })
