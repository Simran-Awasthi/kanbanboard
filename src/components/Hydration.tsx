"use client";

import useKanbanStore from "@/lib/store";
import { useEffect } from "react";

export default function Hydrations() {
  useEffect(() => {
    useKanbanStore.persist.rehydrate();
  }, []);

  return null;
}
