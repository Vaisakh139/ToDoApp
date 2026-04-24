import { useState, useEffect, useRef } from 'react'

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE']

function newSubtask() {
  return { id: crypto.randomUUID(), title: '', done: false }
}

export default function TaskForm({ task, categories = [], defaultCategoryId = null, onSubmit, onCancel, saving = false }) {
  const [title, setTitle]           = useState('')
  const [description, setDesc]      = useState('')
  const [status, setStatus]         = useState('TODO')
  const [dueDate, setDueDate]       = useState('')
  const [reminder, setReminder]     = useState('')
  const [categoryId, setCategoryId] = useState(defaultCategoryId || '')
  const [priority, setPriority]     = useState('MEDIUM')
  const [subtasks, setSubtasks]     = useState([])
  const lastInputRef                = useRef(null)

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDesc(task.description || '')
      setStatus(task.status)
      setDueDate(task.dueDate || '')
      setReminder(task.reminder || '')
      setCategoryId(task.categoryId || '')
      setPriority(task.priority || 'MEDIUM')
      setSubtasks(task.subtasks || [])
    }
  }, [task])

  function addSubtask() {
    setSubtasks(prev => [...prev, newSubtask()])
    setTimeout(() => lastInputRef.current?.focus(), 0)
  }

  function updateSubtaskTitle(id, title) {
    setSubtasks(prev => prev.map(s => s.id === id ? { ...s, title } : s))
  }

  function removeSubtask(id) {
    setSubtasks(prev => prev.filter(s => s.id !== id))
  }

  function handleSubtaskKeyDown(e, index) {
    if (e.key === 'Enter') { e.preventDefault(); addSubtask() }
    if (e.key === 'Backspace' && !e.target.value) {
      e.preventDefault()
      setSubtasks(prev => prev.filter((_, i) => i !== index))
    }
  }

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
      priority,
      subtasks: subtasks.filter(s => s.title.trim()).map(s => ({ ...s, title: s.title.trim() })),
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
              Priority
              <select value={priority} onChange={e => setPriority(e.target.value)} className={`priority-select priority-${priority.toLowerCase()}`}>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
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

          <div className="subtask-section">
            <div className="subtask-header">
              <span className="subtask-label">Subtasks</span>
              <button type="button" className="subtask-add-btn" onClick={addSubtask}>+ Add</button>
            </div>
            {subtasks.length > 0 && (
              <ul className="subtask-form-list">
                {subtasks.map((s, i) => (
                  <li key={s.id} className="subtask-form-item">
                    <input
                      ref={i === subtasks.length - 1 ? lastInputRef : null}
                      className="subtask-form-input"
                      value={s.title}
                      onChange={e => updateSubtaskTitle(s.id, e.target.value)}
                      onKeyDown={e => handleSubtaskKeyDown(e, i)}
                      placeholder={`Subtask ${i + 1}`}
                    />
                    <button
                      type="button"
                      className="subtask-remove-btn"
                      onClick={() => removeSubtask(s.id)}
                    >×</button>
                  </li>
                ))}
              </ul>
            )}
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
