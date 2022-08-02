import { InternalTask, Task } from "./models";

export function toTask(task: InternalTask): Task {
    return <Task>{ description: task.description, status: task.status }
}