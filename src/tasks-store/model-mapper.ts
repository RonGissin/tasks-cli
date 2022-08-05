import { InternalTask, StatusType, Task } from "./models";

export function toTask(task: InternalTask): Task {
    return <Task>{ description: task.description, status: stringToStatusTypeMap[task.status] }
}

export const stringToStatusTypeMap = {
    "inProgress": StatusType.InProgress,
    "inprogress": StatusType.InProgress,
    "In Progress": StatusType.InProgress,
    "In-Progress": StatusType.InProgress,
    "in-progress": StatusType.InProgress,
    "done": StatusType.Done,
    "Done": StatusType.Done,
    "waiting": StatusType.Waiting,
    "Waiting": StatusType.Waiting
} as const;