import { useState, useEffect, useRef } from 'react'

/* ── constants ─────────────────────────────────────────────── */
const STATUS_OPTIONS   = [
  { value: 'TODO',        label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE',        label: 'Done' },
]
const PRIORITY_OPTIONS = [
  { value: 'LOW',    label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH',   label: 'High' },
]

/* ── helpers ───────────────────────────────────────────────── */
function fmtDate(val) {
  if (!val) return null
  return new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

function calcProgress(subtasks = []) {
  if (!subtasks.length) return 0
  return Math.round(subtasks.filter(s => s.done).length / subtasks.length * 100)
}

function isDueHighlighted(dueDate, reminder) {
  if (!dueDate || !reminder) return false
  const now        = new Date()
  const reminderDt = new Date(reminder)
  const dueDt      = new Date(dueDate + 'T23:59:59')
  return now >= reminderDt && now <= dueDt
}

/* ── ProgressBar ───────────────────────────────────────────── */
function ProgressBar({ subtasks }) {
  if (!subtasks?.length) return null
  const pct      = calcProgress(subtasks)
  const done     = subtasks.filter(s => s.done).length
  const total    = subtasks.length
  const complete = pct === 100
  return (
    <div className="progress-wrap">
      <div className="progress-track">
        <div className={`progress-fill${complete ? ' complete' : ''}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="progress-label">{done}/{total}</span>
    </div>
  )
}

/* ── DropdownBtn ───────────────────────────────────────────── */
function DropdownBtn({ value, options, onChange, btnClass }) {
  const [open, setOpen] = useState(false)
  const ref             = useRef(null)

  useEffect(() => {
    if (!open) return
    function close(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  function select(val) {
    onChange(val)
    setOpen(false)
  }

  const current = options.find(o => o.value === value)
  const label   = current?.label ?? value

  return (
    <div className="dd-wrap" ref={ref}>
      <button
        className={`dd-btn ${btnClass}`}
        onClick={() => setOpen(o => !o)}
        title={label}
      >
        <span className="dd-label">{label}</span>
      </button>
      {open && (
        <ul className="dd-menu">
          {options.map(o => (
            <li
              key={o.value}
              className={`dd-option${o.value === value ? ' selected' : ''}`}
              onClick={() => select(o.value)}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

/* ── TaskItem ──────────────────────────────────────────────── */
export default function TaskItem({ task, categories = [], onEdit, onDelete, onStatusChange, onPriorityChange, onCategoryChange, onSubtaskToggle }) {
  const subtasks = task.subtasks || []
  const showDue  = isDueHighlighted(task.dueDate, task.reminder)

  const categoryOptions = [
    { value: '', label: 'No category' },
    ...categories.map(c => ({ value: c.id, label: c.name })),
  ]

  function toggleSubtask(id) {
    const updated = subtasks.map(s => s.id === id ? { ...s, done: !s.done } : s)
    onSubtaskToggle(task.id, updated)
  }

  return (
    <div className={`task-item status-${task.status.toLowerCase()}`}>
      <div className="task-main">

        {/* Left column: status → category → priority */}
        <div className="task-left">
          <DropdownBtn
            value={task.status}
            options={STATUS_OPTIONS}
            onChange={val => onStatusChange(task.id, val)}
            btnClass={`status-dd status-dd-${task.status.toLowerCase()}`}
          />
          <DropdownBtn
            value={task.categoryId || ''}
            options={categoryOptions}
            onChange={val => onCategoryChange(task.id, val || null)}
            btnClass="category-dd"
          />
          <DropdownBtn
            value={task.priority || 'MEDIUM'}
            options={PRIORITY_OPTIONS}
            onChange={val => onPriorityChange(task.id, val)}
            btnClass={`priority-dd priority-dd-${(task.priority || 'MEDIUM').toLowerCase()}`}
          />
        </div>

        {/* Main content */}
        <div className="task-text">
          <strong>{task.title}</strong>
          {task.description && <p>{task.description}</p>}
          <ProgressBar subtasks={subtasks} />
          {subtasks.length > 0 && (
            <ul className="subtask-list">
              {subtasks.map(s => (
                <li key={s.id} className="subtask-item">
                  <label className="subtask-check-label">
                    <input
                      type="checkbox"
                      checked={s.done}
                      onChange={() => toggleSubtask(s.id)}
                      className="subtask-checkbox"
                    />
                    <span className={s.done ? 'subtask-title done' : 'subtask-title'}>{s.title}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Right column: action buttons + conditional due date */}
      <div className="task-actions">
        <div className="action-btns">
          <button className="btn-edit" onClick={() => onEdit(task)}>Edit</button>
          <button className="btn-delete" onClick={() => onDelete(task.id)}>Delete</button>
        </div>
        {showDue && (() => {
          const d        = new Date(task.dueDate)
          const dayMonth = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
          const year     = d.getFullYear()
          return (
            <div className="due-highlight">
              <span className="due-label">Last date</span>
              <span className="due-main">{dayMonth}</span>
              <span className="due-year">{year}</span>
            </div>
          )
        })()}
      </div>
    </div>
  )
}
