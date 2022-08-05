export interface InternalTask {
    description: string,
    status: string,
    id: string
}

export interface Task {
    description: string,
    status: StatusType,
}

export enum StatusType {
    Done = "Done",
    Waiting = "Waiting",
    InProgress = "In Progress"
}
