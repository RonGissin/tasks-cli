import chalk from "chalk";
import inquirer from "inquirer";
import { Status, Task, InProgress, Waiting, Done } from "../tasks-store/models";

export const getShowChoices = (tasks: Task[], statuses: Status[]) => {
    let choiceList = [];

    if (shouldShowTasksOfStatus("inProgress", statuses, tasks)) {
        choiceList.push(...[
            ...statusSeperator(chalk.cyan.bold("IN-PROGRESS")),
            ...getInProgressTasks(tasks)
        ]);
    }

    if (shouldShowTasksOfStatus("waiting", statuses, tasks)) {
        choiceList.push(...[
            ...statusSeperator(chalk.blue.bold("WAITING")),
            ...getWaitingTasks(tasks)
        ]);
    }

    if (shouldShowTasksOfStatus("done", statuses, tasks)) {
        choiceList.push(...[
            ...statusSeperator(chalk.green.bold("DONE")),
            ...getDoneTasks(tasks)
        ]);
    }

    choiceList.push(...exitChoice())

    return choiceList;
}

export const getTaskActionChoices = () => [
    deleteTaskChoice,
    separator,
    changeTaskStatusChoice,
    separator,
    editTaskDescriptionChoice,
    separator,
    goBackChoice
]

export const getChangeTaskStatusChoices = (existingStatus: Status) => [
    doneStatusChoice(existingStatus),
    separator,
    inProgressStatusChoice(existingStatus),
    separator,
    waitingStatusChoice(existingStatus),
    separator,
    goBackChoice
]

export const exitChoice = () => [
    separator,
    chalk.red.bold("exit prompt"),
    separator,
]

export const statusSeperator = (header: string) => [
    separator,
    new inquirer.Separator(header),
    separator,
]

export const deleteTaskChoice = "Delete task";
export const changeTaskStatusChoice = "Change task status";
export const editTaskDescriptionChoice = "Edit task description";
export const goBackChoice = "Go back";

export const waitingStatusChoice = (status: Status) => {
    return { name: "Waiting", disabled: status === "waiting" };
}

export const inProgressStatusChoice = (status: Status) => {
    return { name: "In Progress", disabled: status === "inprogress" };
}

export const doneStatusChoice = (status: Status) => {
    return { name: "Done", disabled: status === "done" };
}

function getInProgressTasks(tasks: Task[]) {
    return tasks.filter(t => t.status.toLowerCase() === "inprogress").map(t => t.description);
}

function getWaitingTasks(tasks: Task[]) {
    return tasks.filter(t => t.status.toLowerCase() === "waiting").map(t => t.description);
}

function getDoneTasks(tasks: Task[]) {
    return tasks.filter(t => t.status.toLowerCase() === "done").map(t => t.description);
}

function shouldShowTasksOfStatus(status: Status, statusChoices: Status[], tasks: Task[]) {
    return (statusChoices === undefined || statusChoices.includes(status) || !statusChoices.length) 
    && tasks.some(t => t.status === status)
}

const separator = new inquirer.Separator("---------------------------------------------------");