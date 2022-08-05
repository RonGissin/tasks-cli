import inquirer from 'inquirer';
import chalk from 'chalk';
import { StatusType, Task } from '../tasks-store/models.js';
import { changeTaskStatusChoice, deleteTaskChoice, editTaskDescriptionChoice as editTaskChoice, getShowChoices, getTaskActionChoices, goBackChoice } from './choices.js';
import { deleteTaskInquiry } from './delete.js';
import { moveTaskStatusInquiry } from './move.js';
import { editTaskInquiry } from './edit.js';

export const showInquiry = (
    tasks: Task[],
    statuses: StatusType[],
    deleteTaskCallback: (t: Task) => void,
    changeTaskStatusCallback: (t: Task, s: StatusType) => void,
    editTaskCallback: (t: Task, desc: string) => void
    ) => {
    inquirer
    .prompt([
      {
        type: 'list',
        name: 'value',
        message: 'Here are your current tasks',
        pageSize: 20,
        choices: getShowChoices(tasks, statuses),
      }])
    .then((chosenTask) => {
        if (chosenTask.value.includes("exit prompt")) {
            process.exit();
        }

        inquirer.prompt([
            {
              type: 'list',
              name: 'action',
              message: `What do you wish to do with the task "${chosenTask.value}" ?`,
              pageSize: 20,
              choices: getTaskActionChoices(),
            }])
            .then((chosenAction) => {
                if (chosenAction.action === goBackChoice) {
                    // loop back to show task list.
                    showInquiry(tasks, statuses, deleteTaskCallback, changeTaskStatusCallback, editTaskCallback);
                }
                else {
                    const task = tasks.find(t => t.description === chosenTask.value);

                    switch(chosenAction.action) {
                        case deleteTaskChoice:
                            deleteTaskInquiry(task, deleteTaskCallback);
                            break;
                        case changeTaskStatusChoice:
                            moveTaskStatusInquiry(task, changeTaskStatusCallback);
                            break;
                        case editTaskChoice:
                            editTaskInquiry(task, editTaskCallback);
                            break;
                    }
                }
            })
    });
}
