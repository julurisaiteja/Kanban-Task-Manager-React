import React from "react";
import { KanbanBoard } from "./components/KanbanBoard";
import { TaskModal } from "./components/TaskModal";
import { useTasks } from "./hooks/useTasks";
import { COLUMN_IDS, PRIORITY } from "./constants";

function App() {
  const {
    tasksByColumn,
    filteredTasksByColumn,
    allTasksFlat,
    priorityFilter,
    searchQuery,
    setPriorityFilter,
    setSearchQuery,
    createTask,
    updateTask,
    deleteTask,
    moveTask,
    reorderWithinColumn,
  } = useTasks();

  const [isModalOpen, setModalOpen] = React.useState(false);
  const [modalMode, setModalMode] = React.useState("create"); // "create" | "edit"
  const [editingTask, setEditingTask] = React.useState(null);

  const openCreateModal = () => {
    setModalMode("create");
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setModalMode("edit");
    setEditingTask(task);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleSubmitTask = (data) => {
    if (modalMode === "edit" && editingTask) {
      updateTask(editingTask.id, {
        title: data.title,
        description: data.description,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : null,
      });
    } else {
      createTask(data);
    }
    closeModal();
  };

  const handleDeleteTask = (task) => {
    deleteTask(task.id);
  };

  return (
    <div className="kanban-workspace min-h-screen px-3 py-4 md:px-8 md:py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <header className="kanban-topbar flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <div className="kanban-brand-mark flex h-10 w-10 items-center justify-center">
              <span className="text-sm font-black">KB</span>
            </div>
            <div>
              <h1 className="text-base font-semibold md:text-lg">
                Fieldwork / Tasks
              </h1>
              <p className="text-[11px] md:text-xs">
                Project board <span aria-hidden="true">/</span> Local workspace
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <div className="kanban-mode-label flex items-center gap-2 px-2.5 py-1.5 text-[11px]">
              <span className="inline-flex h-2 w-2 rounded-full" />
              Saved in this browser
            </div>
            <button
              data-testid="add-task-button"
              onClick={openCreateModal}
              className="kanban-add-task inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold transition"
            >
              <span className="flex h-5 w-5 items-center justify-center text-sm">
                +
              </span>
              New task
            </button>
          </div>
        </header>

        <section className="kanban-pulse" aria-label="Board summary">
          <div><span>Open work</span><strong>{allTasksFlat.filter((task) => task.columnId !== COLUMN_IDS.DONE).length}</strong></div>
          <div><span>Due this week</span><strong>{allTasksFlat.filter((task) => {
            if (task.columnId === COLUMN_IDS.DONE || !task.dueDate) return false;
            const dueDate = new Date(task.dueDate);
            const now = new Date();
            const weekAhead = new Date(now);
            weekAhead.setDate(now.getDate() + 7);
            return dueDate >= new Date(now.toDateString()) && dueDate <= weekAhead;
          }).length}</strong></div>
          <div><span>High priority</span><strong>{allTasksFlat.filter((task) => task.priority === PRIORITY.HIGH && task.columnId !== COLUMN_IDS.DONE).length}</strong></div>
          <div><span>Completed</span><strong>{allTasksFlat.filter((task) => task.columnId === COLUMN_IDS.DONE).length}</strong></div>
        </section>

        <section className="kanban-controls flex flex-col gap-3 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="w-full max-w-sm">
                  <label className="mb-1 block text-[11px] font-medium">
                  Search tasks
                </label>
                <div className="relative">
                  <input
                    data-testid="search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title or description…"
                    className="kanban-input w-full px-9 py-2 text-xs outline-none ring-0 transition focus:border-kanban-primary focus:ring-2 focus:ring-kanban-primary/30"
                  />
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs">
                    ⌕
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-end gap-3">
              <div className="w-40">
                <label className="mb-1 block text-[11px] font-medium">
                  Priority filter
                </label>
                <select
                  data-testid="priority-filter"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="kanban-input w-full px-3 py-2 text-xs outline-none ring-0 transition focus:border-kanban-primary focus:ring-2 focus:ring-kanban-primary/30"
                >
                  <option value="all">All priorities</option>
                  <option value={PRIORITY.LOW}>Low</option>
                  <option value={PRIORITY.MEDIUM}>Medium</option>
                  <option value={PRIORITY.HIGH}>High</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        <main className="kanban-board-shell flex flex-1 flex-col gap-4 p-4">
          <KanbanBoard
            tasksByColumn={tasksByColumn}
            filteredTasksByColumn={filteredTasksByColumn}
            allTasksFlat={allTasksFlat}
            onMoveTask={moveTask}
            onReorderWithinColumn={reorderWithinColumn}
            onEditTask={openEditModal}
            onDeleteTask={handleDeleteTask}
          />
        </main>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        mode={modalMode}
        initialData={editingTask}
        onClose={closeModal}
        onSubmit={handleSubmitTask}
      />
    </div>
  );
}

export default App;