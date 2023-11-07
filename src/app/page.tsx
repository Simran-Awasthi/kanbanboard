"use client";
import Boards from "@/components/Boards";
import KanbanBoard from "@/components/KanbanBoard";
import { useRef } from "react";

export default function Home() {
  const ref = useRef<HTMLElement | null>(null);
  return (
    <main ref={ref}>
      <Boards />
    </main>
  );
}
