import TaskItem from './TaskItem'

export default function TaskList({ tasks, onEdit, onDelete, onStatusChange }) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks yet. Add one above!</p>
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  )
}
