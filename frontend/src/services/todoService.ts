import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 
                 import.meta.env.VITE_BACKEND_URL || 
                 "http://localhost:3001";

export interface Task {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  isCompleted?: boolean;
}

class TodoService {
  private async makeRequest<T>(method: string, url: string, data?: any): Promise<T> {
    try {
      console.log(`Making ${method} request to ${API_BASE}${url}`);
      console.log('Request data:', data);
      console.log('Cookies:', document.cookie);
      
      const response = await axios({
        method,
        url: `${API_BASE}${url}`,
        data,
        withCredentials: true,
      });
      
      console.log(`Response from ${method} ${url}:`, response.data);
      return response.data;
    } catch (error: any) {
      console.error(`Todo API Error (${method} ${url}):`, error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
      }
      throw error;
    }
  }

  async getTasks(): Promise<Task[]> {
    return this.makeRequest<Task[]>("GET", "/api/todos");
  }

  async createTask(taskData: CreateTaskRequest): Promise<Task> {
    return this.makeRequest<Task>("POST", "/api/todos", taskData);
  }

  async updateTask(taskId: string, taskData: UpdateTaskRequest): Promise<Task> {
    return this.makeRequest<Task>("PUT", `/api/todos/${taskId}`, taskData);
  }

  async deleteTask(taskId: string): Promise<{ message: string }> {
    return this.makeRequest<{ message: string }>("DELETE", `/api/todos/${taskId}`);
  }
}

export const todoService = new TodoService();
