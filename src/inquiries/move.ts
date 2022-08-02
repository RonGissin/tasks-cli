import chalk from 'chalk';
import inquirer from 'inquirer';
import { Status, Task } from '../tasks-store/models.js';
import { getChangeTaskStatusChoices } from './choices.js';

export const moveTaskStatusInquiry = (taskToMove: Task, moveStatusCallback: (t: Task, s: Status) => void) => {
    inquirer
    .prompt([
      {
        type: 'list',
        name: 'newStatus',
        choices: getChangeTaskStatusChoices(taskToMove.status),
        message: `To which status do you want to move your task (${chalk.italic(`current status is ${taskToMove.status}`)}) ?`,
      }])
    .then((answer) => {
        moveStatusCallback(taskToMove, answer.newStatus);
        
        console.log(`Your task was moved to ${answer.newStatus}`);
    });
}
