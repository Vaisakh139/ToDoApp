import { useState, useEffect } from 'react'

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE']

export default function TaskForm({ task, categories = [], defaultCategoryId = null, onSubmit, onCancel, saving = false }) {
  const [title, setTitle]           = useState('')
  const [description, setDesc]      = useState('')
  const [status, setStatus]         = useState('TODO')
  const [dueDate, setDueDate]       = useState('')
  const [reminder, setReminder]     = useState('')
  const [categoryId, setCategoryId] = useState(defaultCategoryId || '')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDesc(task.description || '')
      setStatus(task.status)
      setDueDate(task.dueDate || '')
      setReminder(task.reminder || '')
      setCategoryId(task.categoryId || '')
    }
  }, [task])

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      dueDate: dueDate || null,
      reminder: reminder || null,
      categoryId: categoryId || null,
    })
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{task ? 'Edit Task' : 'New Task'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Title *
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Task title"
              autoFocus
            />
          </label>
          <label>
            Description
            <textarea
              value={description}
              onChange={e => setDesc(e.target.value)}
              placeholder="Optional description"
              rows={3}
            />
          </label>
          <div className="form-row">
            <label>
              Status
              <select value={status} onChange={e => setStatus(e.target.value)}>
                {STATUSES.map(s => (
                  <option key={s} value={s}>{s.replace('_', ' ')}</option>
                ))}
              </select>
            </label>
            <label>
              Category
              <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
                <option value="">No category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="form-row">
            <label>
              Due Date
              <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
            </label>
            <label>
              Reminder
              <input type="datetime-local" value={reminder} onChange={e => setReminder(e.target.value)} />
            </label>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel} disabled={saving}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? <span className="btn-spinner" /> : (task ? 'Save' : 'Add Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
