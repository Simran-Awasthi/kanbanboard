"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import Link from "next/link";
import React from "react";

const BoardPage = () => {
  return (
    <main className="dark flex">
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          No id provided. Please go back to the{" "}
          <Link href="/" className="underline text-blue-600">
            boards
          </Link>{" "}
          page and select a board.
        </AlertDescription>
      </Alert>
    </main>
  );
};

export default BoardPage;
