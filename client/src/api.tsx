import Dexie from 'dexie';
import { Task } from "./types/Task";

const API_URL = import.meta.env.VITE_BACKEND_HOST + "/tasks";
const USE_INDEXEDDB = true;

// Define the Dexie database class for tasks
class TaskDatabase extends Dexie {
  // The table for tasks. The second type parameter is the type of the primary key.
  tasks: Dexie.Table<Task, string>;

  constructor() {
    super("DBTaskManager");
    // Define the schema for version 1. We're using "id" as the primary key.
    this.version(1).stores({
      tasks: "id",
    });
    this.tasks = this.table("tasks");
  }
}

// Instantiate the Dexie database
const db = new TaskDatabase();

// Fetch all tasks
export const getTasks = async (): Promise<Task[]> => {
  if (!USE_INDEXEDDB) {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("Failed to fetch tasks");
    return response.json();
  }

  // Dexie returns a promise for the array of tasks
  return await db.tasks.toArray();
};

// Create a new task
export const createTask = async (task: Task): Promise<Task> => {
  if (!USE_INDEXEDDB) {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error("Failed to create task");
    return response.json();
  }

  // Add the task to the Dexie store
  await db.tasks.add(task);
  return task;
};

// Update task status
export const updateTaskStatus = async (id: string, status: string): Promise<Task> => {
  if (!USE_INDEXEDDB) {
    const response = await fetch(`${API_URL}/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error("Failed to update task status");
    return response.json();
  }

  // Retrieve the task using Dexie
  const task = await db.tasks.get(id);
  if (!task) throw new Error("Task not found");

  // Update the status and save the task back to the store
  task.status = status;
  await db.tasks.put(task);
  return task;
};

// Delete a task
export const deleteTask = async (id: string): Promise<{ message: string }> => {
  if (!USE_INDEXEDDB) {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete task");
    return response.json();
  }

  // Delete the task from Dexie
  await db.tasks.delete(id);
  return { message: "Task deleted successfully" };
};
