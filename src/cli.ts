#!/usr/bin/env node

import { Command } from 'commander'
import { TaskRepository } from './tasks-store/tasks-repository.js';
import { showInquiry } from './inquiries/show.js';
import { StatusType, Task } from './tasks-store/models.js';
import { deleteTaskInquiry } from './inquiries/delete.js';

const program = new Command();
const tasksRepo = new TaskRepository();

tasksRepo.initTaskStore();

program
  .name('tasks')
  .description('CLI for day to day task management')
  .version('0.0.1');

program.command('show')
  .description('Displays all tasks')
  .option('-d, --done')
  .option('-p, --in-progress')
  .option('-w, --waiting')
  .action((options) => {
    const tasks = tasksRepo.getAllTasks();
    let includeStatuses: StatusType[] = [];

    options.done && includeStatuses.push(StatusType.Done);
    options.inProgress && includeStatuses.push(StatusType.InProgress);
    options.waiting && includeStatuses.push(StatusType.Waiting);

    if (!tasks.length) {
      console.log("You currently have no tasks");
      return;
    }

    console.log(`The TASKS are ${JSON.stringify(tasks)}`);
    showInquiry(tasks, includeStatuses, (t) => tasksRepo.deleteTask(t), (t, s) => tasksRepo.moveTask(t, s), (t, d) => tasksRepo.editTask(t, d));
});

program.command('add')
  .description('Adds a new task')
  .requiredOption('-d, --description <desc>')
  .option('-s, --status <stat>')
  .option('-a, --all')
  .action((options) => {
    if (tasksRepo.tryAddTask(
      <Task>{ 
      description: options.description,
      status: options.status || "waiting" 
    })) {
      console.log("Task added successfully");
    }
    else {
      console.log("An existing task with the same description already exists !");
      return;
    }

    if (options.all) {
      const allTasks = tasksRepo.getAllTasks();
      showInquiry(allTasks, [], (t) => tasksRepo.deleteTask(t), (t, s) => tasksRepo.moveTask(t, s), (t, d) => tasksRepo.editTask(t, d));
    }
});

program.command('delete')
  .description('Deletes a task')
  .requiredOption('-d, --description <desc>')
  .action((options) => {
    const [found, task] = tasksRepo.tryGetTask(options.description);

    if (!found) {
      console.log("No such task was found");
      return;
    }

    deleteTaskInquiry(task, (task) => tasksRepo.deleteTask(task));
});

program.command('move')
  .description('Moves a task from one status to another')
  .requiredOption('-d, --description <desc>')
  .requiredOption('-s, --status <status>')
  .action((options) => {
    const [found, task] = tasksRepo.tryGetTask(options.description);

    if (!found) {
      console.log("No such task was found");
      return;
    }

    if (task.status === options.status) {
      console.log("Task is already in the given status");
    }

    tasksRepo.moveTask(task, options.status);
  })


program.parse(process.argv);
