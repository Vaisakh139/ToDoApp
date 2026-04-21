import TaskItem from './TaskItem'

export default function TaskList({ tasks, categories = [], onEdit, onDelete, onStatusChange }) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks yet. Add one above!</p>
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          categories={categories}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  )
}
