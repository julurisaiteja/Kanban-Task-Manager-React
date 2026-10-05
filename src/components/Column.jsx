import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";

export function Column({
  id,
  title,
  tasks,
  totalCount,
  dataTestId,
  counterTestId,
  onEditTask,
  onDeleteTask,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
    data: {
      columnId: id,
    },
  });

  return (
    <section
      data-testid={dataTestId}
      data-column={id}
      className="kanban-column flex h-full min-h-[260px] flex-1 flex-col p-4"
    >
      <header className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="kanban-column-mark inline-flex h-7 w-7 items-center justify-center text-xs">
            {title[0]}
          </span>
          <h2 className="text-sm font-semibold">
            {title}
          </h2>
        </div>
        <span
          data-testid={counterTestId}
          className="kanban-column-count inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold"
        >
          {totalCount}
        </span>
      </header>

      <div
        ref={setNodeRef}
        className={`kanban-dropzone flex flex-1 flex-col gap-3 p-2 transition ${
          isOver ? "border-kanban-primary/80 bg-slate-900/80" : ""
        }`}
      >
        {tasks.length === 0 ? (
          <div className="kanban-empty flex flex-1 items-center justify-center px-3 py-6 text-center text-xs">
            Nothing scheduled here.
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => onEditTask(task)}
              onDelete={() => onDeleteTask(task)}
            />
          ))
        )}
      </div>
    </section>
  );
}