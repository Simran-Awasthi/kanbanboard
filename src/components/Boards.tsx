import React, { useState } from "react";
import { Board, Id } from "./types";
import { generateId } from "@/lib/utils";
import { CheckIcon, EditIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

const Boards = () => {
  const [kanbanBoards, setKanbanBoards] = useState<Board[]>([]);
  function createBoard() {
    const newBoard: Board = {
      id: generateId(),

      title: `Board ${kanbanBoards.length + 1}`,
      description: `description ${kanbanBoards.length + 1}`,
    };

    setKanbanBoards([...kanbanBoards, newBoard]);
  }

  function updateBoard(id: Id, data: Partial<Board>) {
    const newBoards = kanbanBoards.map((col) => {
      if (col.id !== id) return col;
      return { ...col, ...data };
    });

    setKanbanBoards(newBoards);
  }
  return (
    <div className="flex flex-col max-h-screen h-full  items-center gap-4">
      <div className="w-full max-w-md flex justify-between items-center p-4 ">
        <h3 className="">Boards</h3>
        <button
          onClick={createBoard}
          className="flex justify-center items-center gap-2"
        >
          <PlusIcon /> Add
        </button>
      </div>
      {kanbanBoards.map((board) => {
        return (
          <BoardTile key={board.id} board={board} updateBoard={updateBoard} />
        );
      })}
    </div>
  );
};

export default Boards;
export type BoardTileProps = {
  board: Board;
  updateBoard: (id: Id, data: Partial<Board>) => void;
};
const BoardTile = ({ board, updateBoard }: BoardTileProps) => {
  const [editMode, setEditMode] = useState(false);
  return (
    <div
      className="w-full flex
      max-w-md
       items-center justify-between
    bg-columnBackgroundColor
    px-6
    py-4
    text-sm
    rounded-md
    "
    >
      <div>
        <div className="flex gap-2">
          {!editMode && board.title}
          {editMode && (
            <input
              className="bg-black focus:border-rose-500 border rounded outline-none px-2"
              value={board.title}
              onChange={(e) => updateBoard(board.id, { title: e.target.value })}
              autoFocus
              //   onBlur={() => {
              //     setEditMode(false);
              //   }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <div className="flex  text-gray-400 gap-2">
          {!editMode && board.description}
          {editMode && (
            <input
              className="bg-black focus:border-rose-500 border rounded outline-none px-2"
              value={board.description}
              onChange={(e) =>
                updateBoard(board.id, { description: e.target.value })
              }
              //   onBlur={() => {
              //     setEditMode(false);
              //   }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            />
          )}
        </div>
        <Link href={"/board"} className="underline text-xs">
          View Board
        </Link>
      </div>
      <button
        onClick={() => setEditMode((editMode) => !editMode)}
        className="flex items-end "
      >
        {editMode ? <CheckIcon /> : <EditIcon />}
      </button>
    </div>
  );
};
