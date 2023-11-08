export type Id = string;

export type Column = {
  id: Id;
  title: string;
  boardId: Id;
};

export type Task = {
  id: Id;
  columnId: Id;
  title: string;
  description?: string;
  dueDate?: Date;
};

export type Board = {
  id: Id;
  title: string;
  description: string;
};
