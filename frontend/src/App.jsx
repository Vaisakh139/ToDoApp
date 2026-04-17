import { useState, useEffect } from 'react'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import LoginPage from './components/LoginPage'
import { getAllTasks, createTask, updateTask, patchStatus, deleteTask, logout } from './api/taskApi'

export default function App() {
  const [token, setToken]           = useState(() => localStorage.getItem('auth_token'))
  const [tasks, setTasks]           = useState([])
  const [editingTask, setEditing]   = useState(null)
  const [showForm, setShowForm]     = useState(false)
  const [error, setError]           = useState('')

  useEffect(() => { if (token) fetchTasks() }, [token])

  async function fetchTasks() {
    try {
      setTasks(await getAllTasks())
    } catch (e) {
      if (e.message === 'Unauthorized') handleLogout()
      else setError(e.message)
    }
  }

  async function handleSubmit(data) {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data)
      } else {
        await createTask(data)
      }
      closeForm()
      fetchTasks()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this task?')) return
    try {
      await deleteTask(id)
      fetchTasks()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleStatusChange(id, status) {
    try {
      await patchStatus(id, status)
      fetchTasks()
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleLogout() {
    await logout().catch(() => {})
    localStorage.removeItem('auth_token')
    setToken(null)
    setTasks([])
  }

  function openNew()      { setEditing(null); setShowForm(true) }
  function openEdit(task) { setEditing(task); setShowForm(true) }
  function closeForm()    { setEditing(null); setShowForm(false) }

  if (!token) return <LoginPage onLogin={setToken} />

  return (
    <div className="app">
      <header>
        <h1>Task Manager</h1>
        <div className="header-actions">
          <button className="btn-primary" onClick={openNew}>+ New Task</button>
          <button className="btn-secondary" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      <main>
        <TaskList
          tasks={tasks}
          onEdit={openEdit}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </main>

      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleSubmit}
          onCancel={closeForm}
        />
      )}
    </div>
  )
}
