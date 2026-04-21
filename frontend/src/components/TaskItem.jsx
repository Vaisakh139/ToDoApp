const STATUS_CYCLE = { TODO: 'IN_PROGRESS', IN_PROGRESS: 'DONE', DONE: 'TODO' }
const STATUS_LABEL = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' }

function fmtDate(val) {
  if (!val) return null
  return new Date(val).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function fmtDateTime(val) {
  if (!val) return null
  return new Date(val).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function isOverdue(dueDate) {
  if (!dueDate) return false
  return new Date(dueDate) < new Date(new Date().toDateString())
}

export default function TaskItem({ task, categories = [], onEdit, onDelete, onStatusChange }) {
  const category = task.categoryId ? categories.find(c => c.id === task.categoryId) : null
  return (
    <div className={`task-item status-${task.status.toLowerCase()}`}>
      <div className="task-main">
        <span
          className="status-badge"
          title="Click to advance status"
          onClick={() => onStatusChange(task.id, STATUS_CYCLE[task.status])}
        >
          {STATUS_LABEL[task.status]}
        </span>
        <div className="task-text">
          <strong>{task.title}</strong>
          {task.description && <p>{task.description}</p>}
          <div className="task-meta">
            {category && (
              <span className="meta-tag cat-badge">{category.name}</span>
            )}
            {task.dueDate && (
              <span className={`meta-tag${isOverdue(task.dueDate) && task.status !== 'DONE' ? ' overdue' : ''}`}>
                📅 {fmtDate(task.dueDate)}
              </span>
            )}
            {task.reminder && (
              <span className="meta-tag">
                🔔 {fmtDateTime(task.reminder)}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="task-actions">
        <button className="btn-edit" onClick={() => onEdit(task)}>Edit</button>
        <button className="btn-delete" onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </div>
  )
}
