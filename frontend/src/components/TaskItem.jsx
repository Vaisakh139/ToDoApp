const STATUS_CYCLE = { TODO: 'IN_PROGRESS', IN_PROGRESS: 'DONE', DONE: 'TODO' }
const STATUS_LABEL = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' }

export default function TaskItem({ task, onEdit, onDelete, onStatusChange }) {
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
        </div>
      </div>
      <div className="task-actions">
        <button className="btn-edit" onClick={() => onEdit(task)}>Edit</button>
        <button className="btn-delete" onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </div>
  )
}
