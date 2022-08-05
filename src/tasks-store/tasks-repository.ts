import os from 'os';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { InternalTask, StatusType, Task } from './models.js';
import { toTask } from './model-mapper.js';

export class TaskRepository {
    private _cachedTasks: InternalTask[];
    private readonly _userHomeDir: string;
    private readonly _tasksStoreDirPath: string;
    private readonly _tasksStorePath: string;

    constructor() {
        this._userHomeDir = os.homedir();
        this._tasksStoreDirPath = `${this._userHomeDir}/AppData/Local/tasks-cli`;
        this._tasksStorePath = `${this._tasksStoreDirPath}/tasks-cli_store.json`;
    }

    public InitTaskStore(): void {
        if (!fs.existsSync(this._tasksStorePath)) {
            this._writeTasksStore([]);
        }
    }

    public getAllTasks(): Task[] {
        const internalTasks = this._getAllInternalTasks();
        return internalTasks.map(t => toTask(t));
    }

    public tryGetTask(description: string): [boolean, Task] {
        const [found, internalTask] = this._tryGetInternalTask(description);

        return found ? [true, toTask(internalTask)] : [false, null];
    }

    public tryAddTask(newTask: Task): boolean {
        this._cachedTasks = this._getAllInternalTasks();

        if (this._cachedTasks.some(t => t.description === newTask.description)) {
            // don't allow duplicate tasks.
            return false;
        }

        this._cachedTasks.push({ description: newTask.description, status: newTask.status, id: uuidv4() });
        
        this._writeTasksStore(this._cachedTasks);

        return true;
    }

    public moveTask(taskToMove: Task, newStatus: StatusType) {
        this.deleteTask(taskToMove) && this.tryAddTask({ description: taskToMove.description, status: newStatus});
    }

    public deleteTask(task: Task): boolean {
        this._cachedTasks = this._getAllInternalTasks();
        const wasDeleted = this._cachedTasks.some(t => t.description === task.description);
        this._cachedTasks = this._cachedTasks.filter(t => t.description !== task.description);
        this._writeTasksStore(this._cachedTasks);

        return wasDeleted;
    }

    public editTask(task: Task, newDescription: string): void {
        this.deleteTask(task) && this.tryAddTask({ description: newDescription, status: task.status });
    }

    private _tryGetInternalTask(desc: string): [boolean, InternalTask] {
        const internalTasks = this._getAllInternalTasks();
        var foundTasks = internalTasks.filter(t => t.description === desc);

        if (!foundTasks.length) {
            return [false, null];
        }

        return [true, foundTasks[0]];
    }

    private _getAllInternalTasks(): InternalTask[] {
        if (this._cachedTasks) {
            return this._cachedTasks;
        }

        if (!fs.existsSync(this._tasksStorePath)) {
            return [];
        }

        try {
            const internalTasksStringified: string = fs.readFileSync(this._tasksStorePath, { encoding: 'utf-8' });
            this._cachedTasks = <InternalTask[]>JSON.parse(internalTasksStringified);
            return this._cachedTasks;    
        }
        catch (err) {
            console.log(err);
        }
    }

    private _writeTasksStore(tasksArray: InternalTask[]) {
        this._createDirIfNotExists(this._tasksStoreDirPath);

        fs.writeFile(this._tasksStorePath, JSON.stringify(tasksArray), (err) => {
            if (err) {
                console.error(`Error occurred while creating a new tasks store. ${err}`);
            }
        });
    }

    private _createDirIfNotExists(path: string) {
        if (!fs.existsSync(path)) {
            fs.mkdir(path, (err) => {
                if (err) {
                    console.error(`Error occurred while creating a new directory. ${err}`);
                }
            });    
        }
    }
}