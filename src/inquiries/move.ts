import chalk from 'chalk';
import inquirer from 'inquirer';
import { StatusType, Task } from '../tasks-store/models.js';
import { getChangeTaskStatusChoices, goBackChoice } from './choices.js';

export const moveTaskStatusInquiry = (taskToMove: Task, moveStatusCallback: (t: Task, s: StatusType) => void) => {
    inquirer
    .prompt([
      {
        type: 'list',
        name: 'newStatus',
        pageSize: 20,
        choices: getChangeTaskStatusChoices(taskToMove.status),
        message: `To which status do you want to move your task (${chalk.italic(`current status is ${taskToMove.status}`)}) ?`,
      }])
    .then((answer) => {
        if (answer.newStatus !== goBackChoice) {
            moveStatusCallback(taskToMove, answer.newStatus);
            console.log(`Your task was moved to ${answer.newStatus}`);
        }
    });
}
