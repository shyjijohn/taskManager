import { useAuth } from "@clerk/clerk-react";
import { Task } from "./types/Task";

const API_URL = import.meta.env.VITE_BACKEND_HOST + "/tasks";

export const fetchWithAuth = async (url: string, options: RequestInit = {}, getToken : () => Promise<string | null>): Promise<Response> => {

  const token = await getToken(); // Get the authentication token from Clerk
  // Set up headers with the authorization token
  const headers = {
    ...options.headers,

    Authorization: `Bearer ${token}`,
  };
  return fetch(url, { ...options, headers });
};

// Fetch all tasks
export const getTasks = async (getToken : () => Promise<string | null>): Promise<Task[]> => {

  const response = await fetchWithAuth(API_URL,{}, getToken);
  if (!response.ok) throw new Error("Failed to fetch tasks");
  return response.json();
};

// Create a new task
export const createTask = async (task: Task, getToken : () => Promise<string | null>): Promise<Task> => {
  
  const response = await fetchWithAuth(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify(task),
  }, getToken);
  if (!response.ok) throw new Error("Failed to create task");
  return response.json();
};

// Update task status
export const updateTaskStatus = async (id: string, status: string, getToken : () => Promise<string | null>): Promise<Task> => {
  const response = await fetchWithAuth(`${API_URL}/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  }, getToken);
  if (!response.ok) throw new Error("Failed to update task status");
  return response.json();
};

// Delete a task
export const deleteTask = async (id: string, getToken : () => Promise<string | null>): Promise<{ message: string }> => {
  const response = await fetchWithAuth(`${API_URL}/${id}`, {
    method: "DELETE",
  }, getToken);
  if (!response.ok) throw new Error("Failed to delete task");
  return response.json();
};
