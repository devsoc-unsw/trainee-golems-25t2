import axios from "axios";

const URL = "http://127.0.0.1:3001";

// Backend uses: id, title, description, isCompleted
export interface TodoTask {
  id: string;
  title: string;
  description: string | null;
  isCompleted: boolean;
}

export const fetchTodos = async (): Promise<TodoTask[]> => {
  try {
    const response = await axios.get(`${URL}/api/todos`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch todos:", error);
    throw error;
  }
};

export const createTodo = async (title: string, description?: string): Promise<TodoTask> => {
  try {
    const response = await axios.post(
      `${URL}/api/todos`,
      { title, description },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create todo:", error);
    throw error;
  }
};

export const updateTodo = async (
  id: string, 
  updates: { title?: string; description?: string; isCompleted?: boolean }
): Promise<TodoTask> => {
  try {
    const response = await axios.put(
      `${URL}/api/todos/${id}`,
      updates,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update todo:", error);
    throw error;
  }
};

export const deleteTodo = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${URL}/api/todos/${id}`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Failed to delete todo:", error);
    throw error;
  }
};