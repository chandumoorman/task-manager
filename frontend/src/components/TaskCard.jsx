export default function TaskCard({ task, onDelete, onEdit, onStageChange }) {
  return (
    <article className="task-card">
      <div>
        <h3>{task.title}</h3>
        <p>{task.description || "No description added."}</p>
      </div>

      <div className="task-meta">
        <span>{task.stage}</span>
        <small>{new Date(task.created_at).toLocaleDateString()}</small>
      </div>

      <label className="compact-label" htmlFor={`stage-${task.id}`}>
        Move stage
      </label>
      <select
        id={`stage-${task.id}`}
        value={task.stage}
        onChange={(event) => onStageChange(task, event.target.value)}
      >
        <option>Todo</option>
        <option>In Progress</option>
        <option>Done</option>
      </select>

      <div className="card-actions">
        <button type="button" className="button ghost" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button type="button" className="button danger" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}
