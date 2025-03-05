
import { Task } from "./types/Task";

const API_URL = import.meta.env.VITE_BACKEND_HOST + "/tasks";

const USE_INDEXEDDB = true;

const DB_NAME = "DBTaskManager";
const STORE_NAME = "tasks";

// Initialize IndexedDB
const initDB = async (): Promise<IDBDatabase> => {


    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: "id" });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

// Fetch all tasks
export const getTasks = async (): Promise<Task[]> => {
    if (!USE_INDEXEDDB) {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Failed to fetch tasks");
        return response.json();
    }

    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result as Task[]);
        request.onerror = () => reject("Failed to fetch tasks");
    });
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

    const db = await initDB();
    console.log(db.objectStoreNames)
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.add(task);
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(task);
        request.onerror = () => reject("Failed to create task");
    });
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

    const db = await initDB();
    
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const getRequest = store.get(id);
    return new Promise((resolve, reject) => {
        getRequest.onsuccess = () => {
            const task = getRequest.result as Task;
            if (!task) return reject("Task not found");

            task.status = status;
            const updateRequest = store.put(task);
            updateRequest.onsuccess = () => resolve(task);
            updateRequest.onerror = () => reject("Failed to update task status");
        };
        getRequest.onerror = () => reject("Failed to fetch task");
    });
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

    const db = await initDB();
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const request = store.delete(id);
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve({ message: "Task deleted successfully" });
        request.onerror = () => reject("Failed to delete task");
    });
};
