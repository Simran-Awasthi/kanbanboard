import React, { useState } from "react";
import { Board, Id } from "./types";
import { generateId } from "@/lib/utils";
import { CheckIcon, EditIcon, PlusIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import useKanbanStore from "@/lib/store";
import { Button } from "@/components/ui/button";

const Boards = () => {
  const { boards, addBoard, updateBoard } = useKanbanStore();
  function createBoard() {
    const newBoard: Board = {
      id: generateId(),
      title: `Board ${boards.length + 1}`,
      description: `description ${boards.length + 1}`,
    };

    addBoard(newBoard);
  }

  return (
    <div className="flex flex-col max-h-screen h-full  items-center gap-4">
      <div className="w-full max-w-md flex justify-between items-center p-4 ">
        <h3 className="">Boards</h3>
        <button
          onClick={createBoard}
          className="flex justify-center items-center gap-2">
          <PlusIcon /> Add
        </button>
      </div>
      {boards.map((board) => {
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
  const { deleteBoard } = useKanbanStore();
  const [editMode, setEditMode] = useState(false);
  return (
    <div className="w-full flex max-w-md items-center justify-between px-6 py-4 text-sm rounded-md bg-mainBackgroundColor">
      <div className="flex flex-col gap-2">
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
        <div className="flex text-gray-400 gap-2">
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
        <Link href={`/board/${board.id}`} className="underline text-xs">
          View Board
        </Link>
      </div>
      <div className="flex">
        <Button
          className="rounded-full bg-transparent hover:bg-columnBackgroundColor"
          size={"icon"}
          onClick={() => setEditMode((editMode) => !editMode)}>
          {editMode ? <CheckIcon size={18} /> : <EditIcon size={18} />}
        </Button>
        <Button
          className="rounded-full bg-transparent hover:bg-columnBackgroundColor"
          size={"icon"}
          onClick={() => deleteBoard(board.id)}>
          <TrashIcon size={18} />
        </Button>
      </div>
    </div>
  );
};
