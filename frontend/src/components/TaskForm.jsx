import { useState, useEffect } from 'react'

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE']

export default function TaskForm({ task, onSubmit, onCancel }) {
  const [title, setTitle]       = useState('')
  const [description, setDesc]  = useState('')
  const [status, setStatus]     = useState('TODO')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDesc(task.description || '')
      setStatus(task.status)
    }
  }, [task])

  function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onSubmit({ title: title.trim(), description: description.trim(), status })
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
          <label>
            Status
            <select value={status} onChange={e => setStatus(e.target.value)}>
              {STATUSES.map(s => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
          </label>
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
            <button type="submit" className="btn-primary">{task ? 'Save' : 'Add Task'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
