import chalk from "chalk";
import inquirer from "inquirer";
import { StatusType, Task } from "../tasks-store/models";
import { stringToStatusTypeMap } from "../tasks-store/model-mapper";
import Separator from "inquirer/lib/objects/separator";

export const getShowChoices = (tasks: Task[], statuses: StatusType[]) => {
    let choiceList: (string | Separator)[] = [inquiryTitleSeparator];

    if (shouldShowTasksOfStatus(StatusType.InProgress, statuses, tasks)) {
        choiceList.push(...[
            ...statusSeperator(chalk.cyan.bold("IN-PROGRESS")),
            ...getTasksByStatus(tasks, StatusType.InProgress)
        ]);
    }

    if (shouldShowTasksOfStatus(StatusType.Waiting, statuses, tasks)) {
        choiceList.push(...[
            ...statusSeperator(chalk.blue.bold("WAITING")),
            ...getTasksByStatus(tasks, StatusType.Waiting)
        ]);
    }

    if (shouldShowTasksOfStatus(StatusType.Done, statuses, tasks)) {
        choiceList.push(...[
            ...statusSeperator(chalk.green.bold("DONE")),
            ...getTasksByStatus(tasks, StatusType.Done)
        ]);
    }

    choiceList.push(...exitChoice())

    return choiceList;
}

export const getTaskActionChoices = () => [
    inquiryTitleSeparator,
    deleteTaskChoice,
    separator,
    changeTaskStatusChoice,
    separator,
    editTaskDescriptionChoice,
    separator,
    goBackChoice
]

export const getChangeTaskStatusChoices = (existingStatus: StatusType) => [
    inquiryTitleSeparator,
    getStatusChoiceByStatus("Done", existingStatus),
    separator,
    getStatusChoiceByStatus("In Progress", existingStatus),
    separator,
    getStatusChoiceByStatus("Waiting", existingStatus),
    separator,
    goBackChoice
]

export const exitChoice = () => [
    chalk.red.bold("exit prompt"),
    separator,
]

export const statusSeperator = (header: string) => [
    new inquirer.Separator(header),
    separator
];

export const deleteTaskChoice = "Delete task";
export const changeTaskStatusChoice = "Change task status";
export const editTaskDescriptionChoice = "Edit task description";
export const goBackChoice = "Go back";

export const getStatusChoiceByStatus = (statusChoiceName: string, currentTaskStatus: StatusType) => {
    return { name: statusChoiceName, disabled: currentTaskStatus === stringToStatusTypeMap[statusChoiceName] };
}

function getTasksByStatus(tasks: Task[], desiredStatus: StatusType) {
    const filteredTasks = tasks.filter(t => t.status === desiredStatus).map(t => t.description);
    // insert separators in between tasks.
    return filteredTasks.reduce(function (acc, currTask) {
        return acc.concat(currTask).concat(separator);
    }, [])
}

function shouldShowTasksOfStatus(status: StatusType, statusChoices: StatusType[], tasks: Task[]) {
    return (statusChoices === undefined || statusChoices.includes(status) || !statusChoices.length) 
    && tasks.some(t => t.status === status)
}

const separator = new inquirer.Separator("---------------------------------------------------");
const inquiryTitleSeparator = new inquirer.Separator("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");