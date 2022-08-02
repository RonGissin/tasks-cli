export interface InternalTask {
    description: string,
    status: Status,
    id: string
}

export interface Task {
    description: string,
    status: Status,
}

export type Status = Done | Waiting | InProgress;

export type InProgress = "inProgress" | "inprogress";
export type Done = "done" | "Done";
export type Waiting = "waiting" | "Waiting";