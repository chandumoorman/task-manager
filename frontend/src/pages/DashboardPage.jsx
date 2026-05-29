import { useEffect, useMemo, useState } from "react";

import { createTask, deleteTask, fetchTasks, updateTask } from "../api/taskApi";
import TaskColumn from "../components/TaskColumn";
import TaskForm from "../components/TaskForm";
import { useAuth } from "../context/AuthContext";

const stages = ["Todo", "In Progress", "Done"];

export default function DashboardPage() {
  const { logout, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  async function loadTasks() {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetchTasks();
      setTasks(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to load tasks.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(payload) {
    setIsSaving(true);
    setError("");
    try {
      if (editingTask) {
        const response = await updateTask(editingTask.id, payload);
        setTasks((current) =>
          current.map((task) => (task.id === editingTask.id ? response.data : task)),
        );
        setEditingTask(null);
      } else {
        const response = await createTask(payload);
        setTasks((current) => [response.data, ...current]);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to save task.");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(taskId) {
    const shouldDelete = window.confirm("Delete this task?");
    if (!shouldDelete) return;

    setError("");
    try {
      await deleteTask(taskId);
      setTasks((current) => current.filter((task) => task.id !== taskId));
      if (editingTask?.id === taskId) {
        setEditingTask(null);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to delete task.");
    }
  }

  async function handleStageChange(task, stage) {
    setError("");
    try {
      const response = await updateTask(task.id, { stage });
      setTasks((current) =>
        current.map((item) => (item.id === task.id ? response.data : item)),
      );
    } catch (err) {
      setError(err.response?.data?.detail || "Unable to update task stage.");
    }
  }

  const tasksByStage = useMemo(() => {
    return stages.reduce((grouped, stage) => {
      grouped[stage] = tasks.filter((task) => task.stage === stage);
      return grouped;
    }, {});
  }, [tasks]);

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">Task Manager</p>
          <h1>Hello, {user?.username || "there"}</h1>
        </div>
        <button type="button" className="button ghost" onClick={logout}>
          Logout
        </button>
      </header>

      <section className="dashboard-grid">
        <aside className="sidebar">
          <h2>{editingTask ? "Edit task" : "Create task"}</h2>
          <TaskForm
            editingTask={editingTask}
            isSaving={isSaving}
            onCancel={() => setEditingTask(null)}
            onSubmit={handleSubmit}
          />
        </aside>

        <section className="board">
          {error && <p className="page-error">{error}</p>}

          {isLoading ? (
            <div className="loading-panel">Loading your tasks...</div>
          ) : (
            <div className="columns">
              {stages.map((stage) => (
                <TaskColumn
                  key={stage}
                  stage={stage}
                  tasks={tasksByStage[stage]}
                  onDelete={handleDelete}
                  onEdit={setEditingTask}
                  onStageChange={handleStageChange}
                />
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
