import inquirer from 'inquirer';
import { Task } from '../tasks-store/models.js';

export const deleteTaskInquiry = (taskToDelete: Task, deleteCallback: (task: Task) => void) => {
    inquirer
    .prompt([
      {
        type: 'confirm',
        name: 'confirm task deletion',
        message: `Are you sure you want to delete the task - "${taskToDelete.description}" ?`,
      }])
    .then((yes) => {
        if (yes) {
            deleteCallback(taskToDelete);
            console.log("Deleted task");
        }
        else {
            console.log("Cancelled task deletion");
        }
    });
}
