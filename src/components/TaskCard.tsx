import { ElementType, useState } from "react";

import { Id, Task } from "./types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TrashIcon } from "lucide-react";
import useKanbanStore from "@/lib/store";
import { type } from "os";
import TaskView from "./TaskView";
import { format } from "date-fns/esm";

interface Props {
  task: Task;
}

function TaskCard({ task }: Props) {
  const { updateTask, deleteTask } = useKanbanStore();
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="
        opacity-30
      bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl border-2 border-rose-500  cursor-grab relative
      ">
        {task.title}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-mainBackgroundColor p-2.5 items-start flex flex-col gap-2 text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative task"
      onMouseEnter={() => {
        setMouseIsOver(true);
      }}
      onMouseLeave={() => {
        setMouseIsOver(false);
      }}>
      {task.dueDate && (
        <span className="bg-orange-400 px-2 rounded-md text-xs">
          Due on: {format(new Date(task.dueDate), "dd MMM, yyyy")}
        </span>
      )}
      <p className="my-auto w-full">{task.title}</p>
      {task.description && (
        <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap text-gray-400">
          {task.description.substring(0, 100)}
        </p>
      )}
      {mouseIsOver && (
        <TaskView
          editMode={editMode}
          setEditMode={(mode) => setEditMode(mode)}
          task={task}
        />
      )}
    </div>
  );
}

export default TaskCard;
