import { useState, useEffect, useRef } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from './firebase'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import LoginPage from './components/LoginPage'
import Sidebar from './components/Sidebar'
import { getAllTasks, createTask, updateTask, patchStatus, deleteTask, deleteTasksByCategory } from './api/taskApi'
import { getCategories, createCategory, renameCategory, deleteCategory } from './api/categoryApi'

export default function App() {
  const [user, setUser]               = useState(undefined)
  const [tasks, setTasks]             = useState([])
  const [categories, setCategories]   = useState([])
  const [selectedCat, setSelectedCat] = useState(null)
  const [editingTask, setEditing]     = useState(null)
  const [showForm, setShowForm]       = useState(false)
  const [error, setError]             = useState('')
  const [filter, setFilter]           = useState('ALL')
  const [saving, setSaving]           = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => onAuthStateChanged(auth, setUser), [])
  useEffect(() => {
    if (user) { fetchTasks(); fetchCategories() }
    else { setTasks([]); setCategories([]) }
  }, [user])

  async function fetchTasks() {
    try { setTasks(await getAllTasks(user.uid)) }
    catch (e) { setError(e.message) }
  }

  async function fetchCategories() {
    try { setCategories(await getCategories(user.uid)) }
    catch (e) { setError(e.message) }
  }

  async function handleSubmit(data) {
    setSaving(true)
    try {
      if (editingTask) await updateTask(user.uid, editingTask.id, data)
      else await createTask(user.uid, data)
      closeForm()
      fetchTasks()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this task?')) return
    try { await deleteTask(user.uid, id); fetchTasks() }
    catch (e) { setError(e.message) }
  }

  async function handleStatusChange(id, status) {
    try { await patchStatus(user.uid, id, status); fetchTasks() }
    catch (e) { setError(e.message) }
  }

  async function handleAddCategory(name) {
    try { await createCategory(user.uid, name); fetchCategories() }
    catch (e) { setError(e.message) }
  }

  async function handleRenameCategory(id, name) {
    try { await renameCategory(user.uid, id, name); fetchCategories() }
    catch (e) { setError(e.message) }
  }

  async function handleDeleteCategory(id) {
    if (!window.confirm('Delete this category and all its tasks? This cannot be undone.')) return
    try {
      await deleteTasksByCategory(user.uid, id)
      await deleteCategory(user.uid, id)
      if (selectedCat === id) setSelectedCat(null)
      fetchCategories()
      fetchTasks()
    } catch (e) { setError(e.message) }
  }

  async function handleLogout() {
    await signOut(auth)
    setTasks([])
    setCategories([])
  }

  function openNew()      { setEditing(null); setShowForm(true) }
  function openEdit(task) { setEditing(task); setShowForm(true) }
  function closeForm()    { setEditing(null); setShowForm(false) }

  const today = new Date(new Date().toDateString())

  const visibleTasks = tasks
    .filter(t => selectedCat === null || t.categoryId === selectedCat)
    .filter(t => {
      if (filter === 'ALL')     return true
      if (filter === 'OVERDUE') return ['TODO', 'IN_PROGRESS'].includes(t.status) && t.dueDate && new Date(t.dueDate) < today
      return t.status === filter
    })

  if (user === undefined) return <div className="loading">Loading…</div>
  if (!user) return <LoginPage />

  return (
    <div className="shell">
      <header>
        <h1>Task Manager</h1>
        <div className="header-actions">
          <button className="btn-primary" onClick={openNew}>+ New Task</button>
          <div className="user-profile" ref={profileRef}>
            <button className="avatar-btn" onClick={() => setProfileOpen(o => !o)}>
              <span className="avatar-circle">
                {(user.displayName || user.email).charAt(0).toUpperCase()}
              </span>
            </button>
            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  <span className="avatar-circle avatar-lg">
                    {(user.displayName || user.email).charAt(0).toUpperCase()}
                  </span>
                  {user.displayName && <p className="profile-name">{user.displayName}</p>}
                  <p className="profile-email">{user.email}</p>
                </div>
                <hr className="profile-divider" />
                <button className="profile-logout" onClick={handleLogout}>Sign out</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      <div className="workspace">
        <Sidebar
          categories={categories}
          selectedId={selectedCat}
          onSelect={setSelectedCat}
          onAdd={handleAddCategory}
          onRename={handleRenameCategory}
          onDelete={handleDeleteCategory}
        />

        <div className="content">
          <div className="filter-bar">
            {['ALL', 'TODO', 'IN_PROGRESS', 'DONE', 'OVERDUE'].map(f => (
              <button
                key={f}
                className={`filter-btn${filter === f ? ' active' : ''}${f === 'OVERDUE' ? ' filter-btn-overdue' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'ALL' ? 'All' : f === 'IN_PROGRESS' ? 'In Progress' : f === 'OVERDUE' ? 'Overdue' : f.charAt(0) + f.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <main>
            <TaskList
              tasks={visibleTasks}
              categories={categories}
              onEdit={openEdit}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          </main>
        </div>
      </div>

      {showForm && (
        <TaskForm
          task={editingTask}
          categories={categories}
          defaultCategoryId={selectedCat}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          saving={saving}
        />
      )}
    </div>
  )
}
