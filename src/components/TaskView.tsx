import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type } from "os";
import { Task } from "./types";
import { CalendarIcon, CheckIcon, EditIcon, TrashIcon } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";
import useKanbanStore from "@/lib/store";
import { de } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export type TaskViewProps = {
  task: Task;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
};
const TaskView: React.FC<TaskViewProps> = ({ task, editMode, setEditMode }) => {
  const { updateTask, deleteTask } = useKanbanStore();

  const [data, setData] = useState<Partial<Task>>({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <Dialog open={editMode} onOpenChange={setEditMode}>
      <DialogTrigger asChild>
        <Button className="stroke-white absolute right-4 top-1/2 -translate-y-1/2 bg-columnBackgroundColor p-2 rounded opacity-60 hover:opacity-100">
          <EditIcon size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-mainBackgroundColor dark">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              defaultValue={data.title}
              className="col-span-3"
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              defaultValue={data.description}
              className="col-span-3"
              onChange={handleChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Due Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !data.dueDate && "text-muted-foreground"
                  )}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.dueDate ? (
                    format(data.dueDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={data.dueDate}
                  onSelect={(date) =>
                    setData((prev) => ({ ...prev, dueDate: date }))
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              deleteTask(task.id);
              setEditMode(false);
            }}
            className="dark:bg-red-500 dark:hover:bg-red-400 flex gap-2">
            <TrashIcon size={16} />
          </Button>
          <Button
            onClick={() => {
              updateTask(task.id, data);
              setEditMode(false);
            }}
            type="submit"
            className="flex gap-2">
            <CheckIcon size={16} /> Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TaskView;
