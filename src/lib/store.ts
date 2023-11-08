"use client";
import { Board, Column, Task, Id } from "@/components/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const getDefaultColumns = (boardId: Id): Column[] => {
  return [
    {
      id: `${boardId}-todo`,
      title: "Todo",
      boardId: boardId,
    },
    {
      id: `${boardId}-doing`,
      title: "In progress",
      boardId: boardId,
    },
    {
      id: `${boardId}-done`,
      title: "Done",
      boardId: boardId,
    },
  ];
};

type KanbanStore = {
  boards: Board[];
  addBoard: (board: Board) => void;
  updateBoard: (boardId: Id, updatedBoard: Partial<Board>) => void;
  deleteBoard: (boardId: Id) => void;

  columns: Column[];
  addColumn: (column: Column) => void;
  updateColumn: (columnId: Id, title: string) => void;
  deleteColumn: (columnId: Id) => void;
  setColumns: (columns: Column[]) => void;

  tasks: Task[];
  addTask: (task: Task) => void;
  setTasks: (tasks: Task[]) => void;
  updateTask: (taskId: Id, updatedTask: Partial<Task>) => void;
  deleteTask: (taskId: Id) => void;
};

const useKanbanStore = create<KanbanStore>()(
  persist<KanbanStore>(
    (set) => ({
      boards: [],
      addBoard: (board) =>
        set((state) => ({
          boards: [...state.boards, board],
          columns: [...state.columns, ...getDefaultColumns(board.id)],
        })),
      updateBoard: (boardId, updatedBoard) =>
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === boardId ? { ...board, ...updatedBoard } : board
          ),
        })),

      deleteBoard: (boardId) =>
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== boardId),
          columns: state.columns.filter((col) => col.boardId !== boardId),
        })),

      columns: [],
      addColumn: (column) =>
        set((state) => ({ columns: [...state.columns, column] })),
      setColumns: (columns) => set(() => ({ columns })),
      updateColumn: (columnId, title) =>
        set((state) => ({
          columns: state.columns.map((column) =>
            column.id === columnId ? { ...column, title: title } : column
          ),
        })),
      deleteColumn: (columnId) =>
        set((state) => ({
          columns: state.columns.filter((column) => column.id !== columnId),
          tasks: state.tasks.filter((task) => task.columnId !== columnId),
        })),

      tasks: [],
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      setTasks: (tasks) => set(() => ({ tasks })),
      updateTask: (taskId, updatedTask) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updatedTask } : task
          ),
        })),
      deleteTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
        })),
    }),
    {
      name: "kanban-storage",
      skipHydration: true,
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useKanbanStore;
