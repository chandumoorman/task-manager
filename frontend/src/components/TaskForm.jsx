import { useEffect, useState } from "react";

const initialForm = {
  title: "",
  description: "",
  stage: "Todo",
};

export default function TaskForm({ editingTask, isSaving, onCancel, onSubmit }) {
  const [form, setForm] = useState(initialForm);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description || "",
        stage: editingTask.stage,
      });
    } else {
      setForm(initialForm);
    }
    setValidationError("");
  }, [editingTask]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.title.trim()) {
      setValidationError("Task title is required.");
      return;
    }

    await onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
    });

    if (!editingTask) {
      setForm(initialForm);
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Write API documentation"
          maxLength={120}
          disabled={isSaving}
        />
      </div>

      <div>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Add a short description"
          maxLength={1000}
          rows="4"
          disabled={isSaving}
        />
      </div>

      <div>
        <label htmlFor="stage">Stage</label>
        <select
          id="stage"
          name="stage"
          value={form.stage}
          onChange={handleChange}
          disabled={isSaving}
        >
          <option>Todo</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>
      </div>

      {validationError && <p className="form-error">{validationError}</p>}

      <div className="form-actions">
        {editingTask && (
          <button type="button" className="button ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="button primary" disabled={isSaving}>
          {isSaving ? "Saving..." : editingTask ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
}
