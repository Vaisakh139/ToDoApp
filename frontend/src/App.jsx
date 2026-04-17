import { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './firebase'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import LoginPage from './components/LoginPage'
import { getAllTasks, createTask, updateTask, patchStatus, deleteTask } from './api/taskApi'

export default function App() {
  const [user, setUser]            = useState(undefined)
  const [tasks, setTasks]          = useState([])
  const [editingTask, setEditing]  = useState(null)
  const [showForm, setShowForm]    = useState(false)
  const [error, setError]          = useState('')

  useEffect(() => onAuthStateChanged(auth, setUser), [])
  useEffect(() => { if (user) fetchTasks(); else setTasks([]) }, [user])

  async function fetchTasks() {
    try {
      setTasks(await getAllTasks())
    } catch (e) {
      setError(e.message)
    }
  }

  async function handleSubmit(data) {
    try {
      if (editingTask) await updateTask(editingTask.id, data)
      else await createTask(data)
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
    await signOut(auth)
    setTasks([])
  }

  function openNew()      { setEditing(null); setShowForm(true) }
  function openEdit(task) { setEditing(task); setShowForm(true) }
  function closeForm()    { setEditing(null); setShowForm(false) }

  if (user === undefined) return <div className="loading">Loading…</div>
  if (!user) return <LoginPage />

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
