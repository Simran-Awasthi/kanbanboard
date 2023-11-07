"use client";
import KanbanBoard from "@/components/KanbanBoard";
import React, { useRef } from "react";

const BoardPage = () => {
  const ref = useRef<HTMLElement | null>(null);
  return (
    <main>
      <KanbanBoard parentRef={ref} />
    </main>
  );
};

export default BoardPage;
