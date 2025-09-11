import { useState, useEffect } from "react";
import supabase from "../supabase";
import { useAuth } from "../hooks/useAuth";
import Button from "../components/Button";

const API_URL = import.meta.env.VITE_API_URL;

export default function Dashboard() {
  const user = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Load tasks when user logs in
  useEffect(() => {
    if (!user) {
      // demo mode
      setTasks([
        { id: 1, title: "Example task (not saved)", completed: false },
        { id: 2, title: "Sign up to save tasks!", completed: false },
      ]);
      return;
    }

    const fetchTasks = async () => {
      const res = await fetch(`${API_URL}/tasks/${user.id}`);
      const data = await res.json();
      setTasks(data);
    };

    fetchTasks();
  }, [user]);

  // Add task
  const addTask = async () => {
    if (!newTask.trim() || !user) return;
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, title: newTask }),
    });
    const task = await res.json();
    setTasks([task, ...tasks]);
    setNewTask("");
  };

  // Toggle complete
  const toggleTask = async (id) => {
    const res = await fetch(`${API_URL}/tasks/${id}/toggle`, {
      method: "PUT",
    });
    const updated = await res.json();
    setTasks(tasks.map((t) => (t.id === id ? updated : t)));
  };

  // Delete task
  const deleteTask = async (id) => {
    await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Jessica A. Quill, I'm finna get on yo ahh, this is future AI speaking to you.... Dashboard</h1>

      {user ? (
        <p className="mb-4 text-gray-700">Logged in as {user.email}</p>
      ) : (
        <p className="mb-4 text-gray-600">
          You’re in demo mode. <a href="/signup" className="text-green-600 underline">Sign up</a> to save tasks.
        </p>
      )}

      {user && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="New task..."
            className="border p-2 rounded w-full"
          />
          <Button text="Add" onClick={addTask} color="green" />
        </div>
      )}

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex justify-between items-center p-2 border rounded"
          >
            <span className={task.completed ? "line-through text-gray-500" : ""}>
              {task.title}
            </span>
            {user && (
              <div className="flex gap-2">
                <Button
                  text={task.completed ? "Undo" : "Done"}
                  onClick={() => toggleTask(task.id)}
                  color="blue"
                />
                <Button
                  text="Delete"
                  onClick={() => deleteTask(task.id)}
                  color="red"
                />
              </div>
            )}
          </li>
        ))}
      </ul>

      {user && (
        <Button
          text="Log Out"
          onClick={async () => await supabase.auth.signOut()}
          color="red"
        />
      )}
    </div>
  );
}
