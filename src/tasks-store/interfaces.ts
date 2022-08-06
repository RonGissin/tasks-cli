import { StatusType, Task } from "./models";

export interface ITaskRepository {
    getAllTasks(): Task[];
    tryGetTask(description: string): [boolean, Task];
    tryAddTask(newTask: Task): boolean;
    moveTask(taskToMove: Task, newStatus: StatusType);
    deleteTask(task: Task): boolean;
    editTask(task: Task, newDescription: string): void;
}