"use client";
import KanbanBoard from "@/components/KanbanBoard";
import useKanbanStore from "@/lib/store";
import { redirect } from "next/navigation";
import React, { useRef } from "react";

const BoardPage = ({ params }: { params: { id: string } }) => {
  const ref = useRef<HTMLElement | null>(null);
  if (!params.id) return null;

  return (
    <main>
      <KanbanBoard boardId={params.id} parentRef={ref} />
    </main>
  );
};

export default BoardPage;
