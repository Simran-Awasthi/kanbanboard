import { MutableRefObject, useEffect, useMemo, useState } from "react";
import { Column, Id, Task } from "./types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import { PlusIcon } from "lucide-react";
import { type } from "os";
import { generateId } from "@/lib/utils";
import useKanbanStore from "@/lib/store";
import { redirect } from "next/navigation";

export type KanbanBoardProps = {
  parentRef: MutableRefObject<HTMLElement | null>;
  boardId: Id;
};

function KanbanBoard(props: KanbanBoardProps) {
  const { boards, tasks, columns, addColumn, setColumns, addTask, setTasks } =
    useKanbanStore();

  const columnsId = useMemo(
    () =>
      columns
        .filter((col) => col.boardId == props.boardId)
        .map((col) => col.id),
    [columns]
  );

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  useEffect(() => {
    setTimeout(() => {
      if (boards.filter((board) => board.id == props.boardId).length === 0) {
        return redirect("/404");
      }
    }, 500);
  }, []);

  return (
    <div className="m-auto flex min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-[40px]">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}>
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns
                .filter((col) => col.boardId == props.boardId)
                .map((col) => (
                  <ColumnContainer
                    key={col.id}
                    column={col}
                    createTask={createTask}
                    tasks={tasks.filter((task) => task.columnId === col.id)}
                  />
                ))}
            </SortableContext>
          </div>
          <button
            onClick={createNewColumn}
            className=" h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-4 ring-rose-500 hover:ring-2 flex gap-2">
            <PlusIcon />
            Add Column
          </button>
        </div>

        {props.parentRef.current &&
          createPortal(
            <DragOverlay>
              {activeColumn && (
                <ColumnContainer
                  column={activeColumn}
                  createTask={createTask}
                  tasks={tasks.filter(
                    (task) => task.columnId === activeColumn.id
                  )}
                />
              )}
              {activeTask && <TaskCard task={activeTask} />}
            </DragOverlay>,
            props.parentRef.current
          )}
      </DndContext>
    </div>
  );

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: generateId(),
      columnId,
      title: `Task ${tasks.length + 1}`,
    };

    addTask(newTask);
  }

  function createNewColumn() {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
      boardId: props.boardId,
    };

    addColumn(columnToAdd);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (!isActiveAColumn) return;

    console.log("DRAG END");
    const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

    const overColumnIndex = columns.findIndex((col) => col.id === overId);

    setColumns(arrayMove(columns, activeColumnIndex, overColumnIndex));
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);
      const overIndex = tasks.findIndex((t) => t.id === overId);

      if (tasks[activeIndex].columnId != tasks[overIndex].columnId) {
        // Fix introduced after video recording
        tasks[activeIndex].columnId = tasks[overIndex].columnId;
        setTasks(arrayMove<Task>(tasks, activeIndex, overIndex - 1));
      }

      setTasks(arrayMove<Task>(tasks, activeIndex, overIndex));
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      const activeIndex = tasks.findIndex((t) => t.id === activeId);

      tasks[activeIndex].columnId = overId;
      console.log("DROPPING TASK OVER COLUMN", { activeIndex });
      setTasks(arrayMove(tasks, activeIndex, activeIndex));
    }
  }
}

export default KanbanBoard;
