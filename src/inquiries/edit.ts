import chalk from 'chalk';
import inquirer from 'inquirer';
import { Task } from '../tasks-store/models.js';

export const editTaskInquiry = (taskToEdit: Task, editTaskCallback: (t: Task, desc: string) => void) => {
    inquirer
    .prompt([
      {
        type: 'input',
        name: 'newDescription',
        message: `Write a new description for the task "${chalk.italic(taskToEdit.description)}":`,
      }])
    .then((answer) => {
        editTaskCallback(taskToEdit, answer.newDescription);
        
        console.log(`Your task was edited to "${chalk.italic(answer.newDescription)}"`);
    });
}
