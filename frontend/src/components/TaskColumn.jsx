import TaskCard from "./TaskCard";

export default function TaskColumn({ stage, tasks, onDelete, onEdit, onStageChange }) {
  return (
    <section className="task-column">
      <div className="column-header">
        <h2>{stage}</h2>
        <span>{tasks.length}</span>
      </div>

      <div className="task-list">
        {tasks.length === 0 ? (
          <p className="empty-state">No tasks here yet.</p>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={onDelete}
              onEdit={onEdit}
              onStageChange={onStageChange}
            />
          ))
        )}
      </div>
    </section>
  );
}
